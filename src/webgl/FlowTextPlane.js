import { Mesh, Plane, Program, Texture } from "ogl";
import { planeVertex, textureFragment } from "./shaders.js";
import { createCanvas, getBounds, isInView, updateMeshFromBounds } from "./utils.js";

export class FlowTextPlane {
  constructor({ gl, scene, element, canvas }) {
    this.gl = gl;
    this.scene = scene;
    this.element = element;
    this.canvas = canvas;
    this.bounds = getBounds(element);
    this.texturePadding = this.getTexturePadding();
    this.createTexture();
    this.createMesh();
    this.element.setAttribute("data-gl-flow-text-active", "");
  }

  createTexture() {
    const bounds = this.getTextureBounds();
    const { canvas, ctx } = createCanvas(bounds.width, bounds.height);

    ctx.clearRect(0, 0, bounds.width, bounds.height);
    this.getTextRuns().forEach((run) => {
      this.drawRun(ctx, run, bounds);
    });

    this.texture = new Texture(this.gl, {
      image: canvas,
      premultiplyAlpha: true,
      generateMipmaps: false,
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
    });
  }

  getTexturePadding() {
    const style = getComputedStyle(this.element);
    const size = parseFloat(style.fontSize) || 24;
    return Math.min(96, Math.ceil(size * 0.6));
  }

  getTextureBounds() {
    const padding = this.texturePadding || 0;
    return {
      ...this.bounds,
      left: this.bounds.left - padding,
      top: this.bounds.top - padding,
      right: this.bounds.right + padding,
      bottom: this.bounds.bottom + padding,
      width: this.bounds.width + padding * 2,
      height: this.bounds.height + padding * 2,
    };
  }

  getTextRuns() {
    const runs = [];
    const walker = document.createTreeWalker(this.element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent || parent.closest("[data-gl-flow-exclude]")) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue || "";
      const parent = node.parentElement;
      const style = getComputedStyle(parent);
      const range = document.createRange();
      const matcher = /\S+/g;
      let match;

      while ((match = matcher.exec(text))) {
        const word = match[0];
        range.setStart(node, match.index);
        range.setEnd(node, match.index + word.length);
        const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
        rects.forEach((rect) => {
          runs.push({ rect, style, text: this.transformText(word, style) });
        });
      }
      range.detach();
    }

    return runs;
  }

  transformText(text, style) {
    if (style.textTransform === "uppercase") return text.toUpperCase();
    if (style.textTransform === "lowercase") return text.toLowerCase();
    if (style.textTransform === "capitalize") {
      return text.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
    }
    return text;
  }

  drawRun(ctx, run, textureBounds) {
    const size = parseFloat(run.style.fontSize) || 24;
    const lineHeight = parseFloat(run.style.lineHeight) || size * 1.2;
    const fontFamily = run.style.fontFamily;
    const fontWeight = run.style.fontWeight || 400;
    const fontStyle = run.style.fontStyle === "italic" ? "italic" : "normal";
    const letterSpacing = run.style.letterSpacing !== "normal" ? parseFloat(run.style.letterSpacing) || 0 : 0;
    const metricsFont = `${fontStyle} ${fontWeight} ${size}px ${fontFamily}`;

    ctx.fillStyle = run.style.color;
    ctx.font = metricsFont;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    const metrics = ctx.measureText(run.text);
    const ascent = metrics.actualBoundingBoxAscent || size * 0.8;
    const x = run.rect.left - textureBounds.left;
    const y = run.rect.top - textureBounds.top + Math.max(0, (lineHeight - size) * 0.5) + ascent;

    if (!letterSpacing) {
      ctx.fillText(run.text, x, y);
      return;
    }

    let cursor = x;
    [...run.text].forEach((char, index, chars) => {
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width + (index < chars.length - 1 ? letterSpacing : 0);
    });
  }

  createMesh() {
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: planeVertex,
      fragment: textureFragment,
      uniforms: {
        tMap: { value: this.texture },
        uAlpha: { value: 1 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    this.mesh.renderOrder = 20;
    this.mesh.setParent(this.scene);
    this.update();
  }

  resize() {
    this.bounds = getBounds(this.element);
    this.texturePadding = this.getTexturePadding();
    this.createTexture();
    this.mesh.program.uniforms.tMap.value = this.texture;
    this.update();
  }

  update() {
    this.bounds = getBounds(this.element);
    if (!this.mesh) return;
    const textureBounds = this.getTextureBounds();
    const visible = isInView(textureBounds);
    this.mesh.visible = visible;
    if (!visible) return;

    updateMeshFromBounds(this.mesh, textureBounds, this.canvas);
  }

  destroy() {
    this.element.removeAttribute("data-gl-flow-text-active");
    this.mesh?.setParent(null);
  }
}
