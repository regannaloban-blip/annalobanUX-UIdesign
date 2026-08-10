const CONTACT_EMAIL = "hello.anna.loban@proton.me";
const FORM_SUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const ALLOWED_ORIGINS = new Set([
  "https://annaloban.vercel.app",
  "https://ann-loban.workers.dev",
  "https://anna-contact-form-v2.ann-loban.workers.dev",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
]);

function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://annaloban.vercel.app";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(payload, status, origin) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function getText(formData, name, limit = 2000) {
  return String(formData.get(name) || "").trim().slice(0, limit);
}

function formatError(responseText) {
  return responseText.slice(0, 500);
}

async function sendWithFormSubmit({ email, message, name, project }) {
  const emailData = new FormData();
  emailData.set("email", email);
  emailData.set("name", name);
  emailData.set("project", project);
  emailData.set("message", message);
  emailData.set("_replyto", email);
  emailData.set("_subject", "New portfolio project request");
  emailData.set("_template", "table");

  const response = await fetch(FORM_SUBMIT_ENDPOINT, {
    method: "POST",
    body: emailData,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return { ok: false, provider: "formsubmit", error: formatError(await response.text()) };
  }

  return { ok: true, provider: "formsubmit" };
}

async function sendWithResend(env, { email, message, name, project }) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { ok: false, provider: "resend", skipped: true, error: "Resend is not configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: env.CONTACT_EMAIL || CONTACT_EMAIL,
      reply_to: email,
      subject: "New portfolio project request",
      text: [
        "New portfolio project request",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${project || "Not provided"}`,
        `Message: ${message || "Not provided"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    return { ok: false, provider: "resend", error: formatError(await response.text()) };
  }

  return { ok: true, provider: "resend" };
}

async function sendEmail(env, payload) {
  const resendResult = await sendWithResend(env, payload);
  if (resendResult.ok) return resendResult;
  const formSubmitResult = await sendWithFormSubmit(payload);
  return formSubmitResult.ok ? formSubmitResult : { ...formSubmitResult, fallbackFrom: resendResult };
}

async function sendTelegram(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return { ok: false, provider: "telegram", skipped: true, error: "Telegram is not configured" };
  }

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
  });

  if (!response.ok) {
    return { ok: false, provider: "telegram", error: formatError(await response.text()) };
  }

  return { ok: true, provider: "telegram" };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return ALLOWED_ORIGINS.has(origin)
        ? new Response(null, { status: 204, headers: corsHeaders(origin) })
        : new Response(null, { status: 403 });
    }

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405, origin);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse({ ok: false, error: "Origin not allowed" }, 403, origin);
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid request body" }, 400, origin);
    }

    const email = getText(formData, "email", 254);
    const name = getText(formData, "name", 200);
    const project = getText(formData, "project", 200);
    const message = getText(formData, "message");
    const payload = { email, message, name, project };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) {
      return jsonResponse({ ok: false, error: "Invalid form data" }, 400, origin);
    }

    const telegramText = [
      "New portfolio project request",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${project || "Not provided"}`,
      `Message: ${message || "Not provided"}`,
    ].join("\n");

    const [emailResult, telegramResult] = await Promise.all([
      sendEmail(env, payload),
      sendTelegram(env, telegramText),
    ]);

    if (!emailResult.ok && !telegramResult.ok) {
      return jsonResponse(
        { ok: false, error: "Could not send message", channels: { email: emailResult, telegram: telegramResult } },
        502,
        origin,
      );
    }

    return jsonResponse({ ok: true, channels: { email: emailResult, telegram: telegramResult } }, 200, origin);
  },
};
