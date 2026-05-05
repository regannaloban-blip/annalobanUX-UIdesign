export function getBounds(element) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom,
  };
}

export function isInView(bounds, margin = 160) {
  return bounds.bottom > -margin && bounds.top < window.innerHeight + margin;
}

export function updateMeshFromBounds(mesh, bounds, canvas) {
  mesh.scale.x = canvas.sizes.x * bounds.width / canvas.viewport.x;
  mesh.scale.y = canvas.sizes.y * bounds.height / canvas.viewport.y;
  mesh.position.x = -canvas.sizes.x / 2 + mesh.scale.x / 2 + bounds.left / canvas.viewport.x * canvas.sizes.x;
  mesh.position.y = canvas.sizes.y / 2 - mesh.scale.y / 2 - bounds.top / canvas.viewport.y * canvas.sizes.y;
}

export function createCanvas(width, height, ratio = window.devicePixelRatio || 1) {
  const canvas = document.createElement("canvas");
  const dpr = Math.min(ratio, 2) * 2;
  canvas.width = Math.max(1, Math.ceil(width * dpr));
  canvas.height = Math.max(1, Math.ceil(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx, dpr };
}

export function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
