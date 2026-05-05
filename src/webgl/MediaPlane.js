import { Mesh, Plane, Program, Texture } from "ogl";
import { mediaFragment, planeVertex, textureFragment } from "./shaders.js";
import { createCanvas, getBounds, isInView, updateMeshFromBounds } from "./utils.js";

export class MediaPlane {
  constructor({ gl, scene, element, canvas }) {
    this.gl = gl;
    this.scene = scene;
    this.element = element;
    this.canvas = canvas;
    this.bounds = getBounds(element);
    this.image = element.querySelector("img");
    this.createTexture();
    this.createMesh();
    this.element.setAttribute("data-gl-media-active", "");
  }

  createTexture() {
    if (this.image) {
      this.image.crossOrigin = "anonymous";
      this.texture = new Texture(this.gl, {
        image: this.image,
        premultiplyAlpha: true,
        generateMipmaps: false,
        minFilter: this.gl.LINEAR,
        magFilter: this.gl.LINEAR,
      });
      this.imageSize = [
        this.image.naturalWidth || this.image.width || this.bounds.width,
        this.image.naturalHeight || this.image.height || this.bounds.height,
      ];
      if (!this.image.complete) {
        this.image.addEventListener(
          "load",
          () => {
            this.texture.image = this.image;
            this.texture.needsUpdate = true;
            this.imageSize = [this.image.naturalWidth, this.image.naturalHeight];
          },
          { once: true },
        );
      }
      return;
    }

    const { canvas, ctx } = createCanvas(this.bounds.width, this.bounds.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
    this.texture = new Texture(this.gl, {
      image: canvas,
      premultiplyAlpha: true,
      generateMipmaps: false,
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
    });
    this.imageSize = [this.bounds.width, this.bounds.height];
  }

  createMesh() {
    const hasImage = Boolean(this.image);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: planeVertex,
      fragment: hasImage ? mediaFragment : textureFragment,
      uniforms: hasImage
        ? {
            tMap: { value: this.texture },
            uPlaneSize: { value: [this.bounds.width, this.bounds.height] },
            uImageSize: { value: this.imageSize },
            uAlpha: { value: 1 },
          }
        : {
            tMap: { value: this.texture },
            uAlpha: { value: 1 },
          },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    this.mesh.renderOrder = 10;
    this.mesh.setParent(this.scene);
    this.update();
  }

  resize() {
    this.bounds = getBounds(this.element);
    if (this.mesh.program.uniforms.uPlaneSize) {
      this.mesh.program.uniforms.uPlaneSize.value = [this.bounds.width, this.bounds.height];
      this.mesh.program.uniforms.uImageSize.value = this.imageSize;
    }
    this.update();
  }

  update() {
    this.bounds = getBounds(this.element);
    if (!this.mesh) return;
    const visible = isInView(this.bounds);
    this.mesh.visible = visible;
    if (!visible) return;

    updateMeshFromBounds(this.mesh, this.bounds, this.canvas);

    if (this.mesh.program.uniforms.uPlaneSize) {
      this.mesh.program.uniforms.uPlaneSize.value = [this.bounds.width, this.bounds.height];
      this.mesh.program.uniforms.uImageSize.value = this.imageSize;
    }
  }

  destroy() {
    this.element.removeAttribute("data-gl-media-active");
    this.mesh?.setParent(null);
  }
}
