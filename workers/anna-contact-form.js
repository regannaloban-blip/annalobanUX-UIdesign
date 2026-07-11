const CONTACT_EMAIL = "hello.anna.loban@proton.me";
const FORM_SUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const ALLOWED_ORIGINS = new Set([
  "https://ann-loban.workers.dev",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://ann-loban.workers.dev",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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

    const formData = await request.formData();
    const email = getText(formData, "email", 254);
    const name = getText(formData, "name", 200);
    const project = getText(formData, "project", 200);
    const message = getText(formData, "message");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) {
      return jsonResponse({ ok: false, error: "Invalid form data" }, 400, origin);
    }

    const emailData = new FormData();
    emailData.set("email", email);
    emailData.set("name", name);
    emailData.set("project", project);
    emailData.set("message", message);
    emailData.set("_replyto", email);
    emailData.set("_subject", "New portfolio project request");
    emailData.set("_template", "table");

    const telegramText = [
      "New portfolio project request",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${project || "Not provided"}`,
      `Message: ${message || "Not provided"}`,
    ].join("\n");

    const [emailResponse, telegramResponse] = await Promise.all([
      fetch(FORM_SUBMIT_ENDPOINT, {
        method: "POST",
        body: emailData,
        headers: { Accept: "application/json" },
      }),
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: telegramText }),
      }),
    ]);

    if (!emailResponse.ok || !telegramResponse.ok) {
      return jsonResponse({ ok: false, error: "Could not send message" }, 502, origin);
    }

    return jsonResponse({ ok: true }, 200, origin);
  },
};
