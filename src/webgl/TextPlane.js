import { Mesh, Plane, Program, Texture } from "ogl";
import { planeVertex, textureFragment } from "./shaders.js";
import { createCanvas, getBounds, isInView, updateMeshFromBounds } from "./utils.js";

export class TextPlane {
  constructor({ gl, scene, element, canvas }) {
    this.gl = gl;
    this.scene = scene;
    this.element = element;
    this.canvas = canvas;
    this.bounds = getBounds(element);
    this.color = element.dataset.color === "black" ? "#000" : "#fff";
    this.createTexture();
    this.createMesh();
    this.element.setAttribute("data-gl-text-active", "");
  }

  createTexture() {
    const { width, height } = this.bounds;
    const { canvas, ctx } = createCanvas(width, height);
    const style = getComputedStyle(this.element);
    const size = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight) || size * 1.2;
    const fontFamily = style.fontFamily;
    const fontWeight = style.fontWeight || 400;
    const letterSpacing = style.letterSpacing !== "normal" ? parseFloat(style.letterSpacing) || 0 : 0;
    const align = style.textAlign;
    const text = (this.element.innerText || this.element.textContent || "").trim();
    const lines = this.getWrappedLines(ctx, text, width, letterSpacing);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = this.color;
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    ctx.textBaseline = "top";
    ctx.textAlign = align === "right" ? "right" : align === "center" ? "center" : "left";

    const x = ctx.textAlign === "right" ? width : ctx.textAlign === "center" ? width / 2 : 0;
    lines.forEach((line, lineIndex) => {
      if (letterSpacing === 0) {
        if (align === "justify" && lineIndex < lines.length - 1) {
          this.drawJustified(ctx, line, 0, lineIndex * lineHeight, width);
        } else {
          ctx.fillText(line, x, lineIndex * lineHeight);
        }
        return;
      }
      if (align === "justify" && lineIndex < lines.length - 1) {
        this.drawJustified(ctx, line, 0, lineIndex * lineHeight, width, letterSpacing);
      } else {
        this.drawLetterSpaced(ctx, line, x, lineIndex * lineHeight, letterSpacing, ctx.textAlign);
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
    this.bounds = getBounds(this.element);
    this.createTexture();
    this.mesh.program.uniforms.tMap.value = this.texture;
    this.update();
  }

  update() {
    this.bounds = getBounds(this.element);
    if (!this.mesh) return;
    const visible = isInView(this.bounds);
    this.mesh.visible = visible;
    if (!visible) return;

    updateMeshFromBounds(this.mesh, this.bounds, this.canvas);
  }

  destroy() {
    this.element.removeAttribute("data-gl-text-active");
    this.mesh?.setParent(null);
  }
}
