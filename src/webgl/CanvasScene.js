import Lenis from "lenis";
import { Camera, Post, Renderer, Transform } from "ogl";
import { BackgroundPlane } from "./BackgroundPlane.js";
import { FluidSimulation } from "./FluidSimulation.js";
import { MediaPlane } from "./MediaPlane.js";
import { compositeFragment } from "./shaders.js";

const KONAMI = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];
const KEY_MAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  b: "b",
  B: "b",
  a: "a",
  A: "a",
};

function isDesktop() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || "";
  const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(ua);
  return !mobile;
}

export class CanvasScene {
  constructor({ canvas, onReady, onFallback }) {
    this.canvas = canvas;
    this.onReady = onReady;
    this.onFallback = onFallback;
    this.pointer = { x: -9999, y: -9999, px: -9999, py: -9999 };
    this.viewport = { x: window.innerWidth, y: window.innerHeight };
    this.sizes = { x: 1, y: 1 };
    this.planes = [];
    this.konamiIndex = 0;
    this.isKonami = false;
    this.running = false;

    if (!isDesktop()) {
      this.onFallback?.("desktop-only");
      return;
    }

    this.init().catch((error) => {
      console.error("WebGL scene failed:", error);
      this.destroy();
      this.onFallback?.(error);
    });
  }

  async init() {
    await document.fonts.ready;
    await this.waitForImages();

    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);

    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 1;
    this.scene = new Transform();
    this.post = new Post(this.gl, { depth: false });
    this.fluid = new FluidSimulation(this.gl);
    this.compositePass = this.post.addPass({
      fragment: compositeFragment,
      uniforms: {
        tFluid: { value: this.fluid.texture },
        uTime: { value: 0 },
      },
    });

    this.lenis = new Lenis({
      infinite: true,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    this.createPlanes();
    this.bindEvents();
    this.resize();

    this.running = true;
    this.canvas.style.opacity = "1";
    this.onReady?.();
    this.rafId = requestAnimationFrame(this.loop);
  }

  waitForImages() {
    const images = [...document.querySelectorAll("main img")];
    return Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }),
    );
  }

  createPlanes() {
    this.destroyPlanes();
    const mediaPlanes = [...document.querySelectorAll("main [data-gl-media]")].map(
      (element) => new MediaPlane({ gl: this.gl, scene: this.scene, element, canvas: this }),
    );
    const backgroundPlanes = [...document.querySelectorAll("main [data-gl-background]")].map(
      (element) => new BackgroundPlane({ gl: this.gl, scene: this.scene, element, canvas: this }),
    );
    this.planes = [...backgroundPlanes, ...mediaPlanes];
  }

  destroyPlanes() {
    this.planes?.forEach((plane) => plane.destroy());
    this.planes = [];
  }

  bindEvents() {
    this.resizeHandler = this.debounce(() => this.resize(), 200);
    this.moveHandler = (event) => this.updateMouse(event);
    this.keyHandler = (event) => this.updateKonami(event);
    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("mousemove", this.moveHandler);
    window.addEventListener("touchstart", this.moveHandler, { passive: true });
    window.addEventListener("touchmove", this.moveHandler, { passive: true });
    document.addEventListener("keydown", this.keyHandler);
  }

  debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }

  updateMouse(event) {
    const point = event.changedTouches?.[0] || event.touches?.[0] || event;
    const x = point.clientX ?? point.pageX;
    const y = point.clientY ?? point.pageY;
    if (x === undefined || y === undefined) return;

    if (this.pointer.px < -1000) {
      this.pointer.px = x;
      this.pointer.py = y;
    }
    const dx = x - this.pointer.px;
    const dy = y - this.pointer.py;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.px = x;
    this.pointer.py = y;

    if (Math.abs(dx) || Math.abs(dy)) {
      const width = Math.max(this.viewport.x || window.innerWidth, 1);
      const height = Math.max(this.viewport.y || window.innerHeight, 1);
      this.fluid?.addSplat(
        x / width,
        1 - y / height,
        dx * 5,
        dy * -5,
      );
    }
  }

  updateKonami(event) {
    const key = KEY_MAP[event.key];
    if (!key) return;
    if (key === KONAMI[this.konamiIndex]) {
      this.konamiIndex += 1;
      if (this.konamiIndex === KONAMI.length) {
        this.isKonami = !this.isKonami;
        this.konamiIndex = 0;
      }
      return;
    }
    this.konamiIndex = 0;
  }

  resize() {
    if (!this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.viewport = { x: width, y: height };
    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });
    const fov = this.camera.fov * (Math.PI / 180);
    this.sizes.y = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.sizes.x = this.sizes.y * this.camera.aspect;
    this.post?.resize();
    this.planes.forEach((plane) => plane.resize());
  }

  loop = (time) => {
    if (!this.running) return;
    this.lenis?.raf(time);
    this.fluid?.step(time);
    this.planes.forEach((plane) => plane.update());
    this.compositePass.uniforms.tFluid.value = this.fluid.texture;
    this.compositePass.uniforms.uTime.value = time * 0.001;
    this.post.render({ scene: this.scene, camera: this.camera, sort: true, frustumCull: false });
    this.rafId = requestAnimationFrame(this.loop);
  };

  destroy() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.destroyPlanes();
    this.lenis?.destroy();
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("mousemove", this.moveHandler);
    window.removeEventListener("touchstart", this.moveHandler);
    window.removeEventListener("touchmove", this.moveHandler);
    document.removeEventListener("keydown", this.keyHandler);
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
