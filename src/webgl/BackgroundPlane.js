import { Mesh, Plane, Program, Texture } from "ogl";
import { planeVertex, textureFragment } from "./shaders.js";
import { createCanvas, getBounds, isInView, updateMeshFromBounds } from "./utils.js";

export class BackgroundPlane {
  constructor({ gl, scene, element, canvas }) {
    this.gl = gl;
    this.scene = scene;
    this.element = element;
    this.canvas = canvas;
    this.bounds = getBounds(element);
    this.createTexture();
    this.createMesh();
    this.element.setAttribute("data-gl-background-active", "");
  }

  createTexture() {
    const { width, height } = this.bounds;
    const { canvas, ctx } = createCanvas(width, height);
    const style = getComputedStyle(this.element);
    const topWidth = parseFloat(style.borderTopWidth) || 0;
    const bottomWidth = parseFloat(style.borderBottomWidth) || 0;
    const leftWidth = parseFloat(style.borderLeftWidth) || 0;
    const rightWidth = parseFloat(style.borderRightWidth) || 0;
    const opacity = parseFloat(style.opacity);

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = Number.isFinite(opacity) ? opacity : 1;
    if (style.backgroundImage && style.backgroundImage !== "none") {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.2)");
      gradient.addColorStop(0.72, "rgba(255,255,255,0.2)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.strokeStyle = style.borderTopColor || "#fff";
    if (topWidth > 0) {
      ctx.lineWidth = Math.max(1, topWidth);
      ctx.beginPath();
      ctx.moveTo(0, topWidth / 2);
      ctx.lineTo(width, topWidth / 2);
      ctx.stroke();
    }
    if (bottomWidth > 0) {
      ctx.lineWidth = Math.max(1, bottomWidth);
      ctx.beginPath();
      ctx.moveTo(0, height - bottomWidth / 2);
      ctx.lineTo(width, height - bottomWidth / 2);
      ctx.stroke();
    }
    if (leftWidth > 0) {
      ctx.lineWidth = Math.max(1, leftWidth);
      ctx.beginPath();
      ctx.moveTo(leftWidth / 2, 0);
      ctx.lineTo(leftWidth / 2, height);
      ctx.stroke();
    }
    if (rightWidth > 0) {
      ctx.lineWidth = Math.max(1, rightWidth);
      ctx.beginPath();
      ctx.moveTo(width - rightWidth / 2, 0);
      ctx.lineTo(width - rightWidth / 2, height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    this.texture = new Texture(this.gl, {
      image: canvas,
      premultiplyAlpha: true,
      generateMipmaps: false,
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
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
    this.mesh.renderOrder = 0;
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
    this.element.removeAttribute("data-gl-background-active");
    this.mesh?.setParent(null);
  }
}
