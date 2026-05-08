import { Mesh, Plane, Program, Texture } from "ogl";
import { planeVertex, textureFragment } from "./shaders.js";
import { createCanvas, getBounds, isInView, updateMeshFromBounds } from "./utils.js";

export class TextPlane {
  constructor({ gl, scene, element, canvas }) {
    this.gl = gl;
    this.scene = scene;
    this.element = element;
    this.canvas = canvas;
    this.bounds = this.getTextBounds();
    this.color = element.dataset.color === "black" ? "#000" : "#fff";
    this.createTexture();
    this.createMesh();
    this.element.setAttribute("data-gl-text-active", "");
  }

  createTexture() {
    const { width, height } = this.bounds;
    const style = getComputedStyle(this.element);
    const size = parseFloat(style.fontSize);
    this.texturePadding = this.getTexturePadding(size);
    const paddedWidth = width + this.texturePadding * 2;
    const paddedHeight = height + this.texturePadding * 2;
    const { canvas, ctx } = createCanvas(paddedWidth, paddedHeight);
    const lineHeight = parseFloat(style.lineHeight) || size * 1.2;
    const fontFamily = style.fontFamily;
    const fontWeight = style.fontWeight || 400;
    const letterSpacing = style.letterSpacing !== "normal" ? parseFloat(style.letterSpacing) || 0 : 0;
    const align = style.textAlign;
    const shouldWrap = style.whiteSpace !== "nowrap";
    let text = (this.element.innerText || this.element.textContent || "").trim();
    if (style.textTransform === "uppercase") {
      text = text.toUpperCase();
    }

    ctx.clearRect(0, 0, paddedWidth, paddedHeight);
    ctx.fillStyle = this.color;
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    ctx.textBaseline = "top";
    ctx.textAlign = align === "right" ? "right" : align === "center" ? "center" : "left";

    const lines = shouldWrap ? this.getWrappedLines(ctx, text, width, letterSpacing) : this.getHardLines(text);
    const x =
      ctx.textAlign === "right"
        ? width + this.texturePadding
        : ctx.textAlign === "center"
          ? width / 2 + this.texturePadding
          : this.texturePadding;
    lines.forEach((line, lineIndex) => {
      const y = lineIndex * lineHeight + this.texturePadding;
      if (letterSpacing === 0) {
        if (align === "justify" && lineIndex < lines.length - 1) {
          this.drawJustified(ctx, line, this.texturePadding, y, width);
        } else {
          ctx.fillText(line, x, y);
        }
        return;
      }
      if (align === "justify" && lineIndex < lines.length - 1) {
        this.drawJustified(ctx, line, this.texturePadding, y, width, letterSpacing);
      } else {
        this.drawLetterSpaced(ctx, line, x, y, letterSpacing, ctx.textAlign);
      }
    });

    this.texture = new Texture(this.gl, {
      image: canvas,
      premultiplyAlpha: true,
      generateMipmaps: false,
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
    });
  }

  getTextBounds() {
    const bounds = getBounds(this.element);
    const style = getComputedStyle(this.element);
    if (style.whiteSpace !== "nowrap") return bounds;

    const width = Math.max(bounds.width, this.element.scrollWidth);
    const height = Math.max(bounds.height, this.element.scrollHeight);
    return {
      ...bounds,
      width,
      height,
      right: bounds.left + width,
      bottom: bounds.top + height,
    };
  }

  getTexturePadding(fontSize) {
    return Math.ceil(Math.max(10, Math.min(56, fontSize * 0.2)));
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

  getHardLines(text) {
    return text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  }

  getWrappedLines(ctx, text, maxWidth, letterSpacing) {
    const hardLines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const measure = (value) => {
      const chars = [...value];
      return chars.reduce((sum, char, index) => {
        return sum + ctx.measureText(char).width + (index < chars.length - 1 ? letterSpacing : 0);
      }, 0);
    };

    return hardLines.flatMap((hardLine) => {
      const words = hardLine.split(/\s+/);
      const lines = [];
      let current = "";
      words.forEach((word) => {
        const next = current ? `${current} ${word}` : word;
        if (current && measure(next) > maxWidth) {
          lines.push(current);
          current = word;
        } else {
          current = next;
        }
      });
      if (current) lines.push(current);
      return lines;
    });
  }

  drawLetterSpaced(ctx, text, x, y, spacing, align) {
    const chars = [...text];
    const width = chars.reduce((sum, char, index) => {
      return sum + ctx.measureText(char).width + (index < chars.length - 1 ? spacing : 0);
    }, 0);
    let cursor = align === "right" ? x - width : align === "center" ? x - width / 2 : x;
    chars.forEach((char, index) => {
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width + (index < chars.length - 1 ? spacing : 0);
    });
  }

  drawJustified(ctx, text, x, y, width, spacing = 0) {
    const words = text.split(/\s+/);
    if (words.length <= 1) {
      this.drawLetterSpaced(ctx, text, x, y, spacing, "left");
      return;
    }
    const textWidth = words.reduce((sum, word) => {
      return sum + [...word].reduce((wordSum, char, index, chars) => {
        return wordSum + ctx.measureText(char).width + (index < chars.length - 1 ? spacing : 0);
      }, 0);
    }, 0);
    const gap = (width - textWidth) / (words.length - 1);
    let cursor = x;
    words.forEach((word, index) => {
      this.drawLetterSpaced(ctx, word, cursor, y, spacing, "left");
      const wordWidth = [...word].reduce((sum, char, charIndex, chars) => {
        return sum + ctx.measureText(char).width + (charIndex < chars.length - 1 ? spacing : 0);
      }, 0);
      cursor += wordWidth + (index < words.length - 1 ? gap : 0);
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
    this.bounds = this.getTextBounds();
    this.createTexture();
    this.mesh.program.uniforms.tMap.value = this.texture;
    this.update();
  }

  update() {
    this.bounds = this.getTextBounds();
    if (!this.mesh) return;
    const textureBounds = this.getTextureBounds();
    const visible = isInView(textureBounds);
    this.mesh.visible = visible;
    if (!visible) return;

    updateMeshFromBounds(this.mesh, textureBounds, this.canvas);
  }

  destroy() {
    this.element.removeAttribute("data-gl-text-active");
    this.mesh?.setParent(null);
  }
}
