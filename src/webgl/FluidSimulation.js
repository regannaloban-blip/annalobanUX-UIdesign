import { Mesh, Program, RenderTarget, Triangle } from "ogl";
import {
  advectionFragment,
  clearFragment,
  curlFragment,
  divergenceFragment,
  fullscreenVertex,
  gradientSubtractFragment,
  pressureFragment,
  splatFragment,
  vorticityFragment,
} from "./shaders.js";

const VELOCITY_RESOLUTION = 128;
const DENSITY_RESOLUTION = 512;
const PRESSURE_ITERATIONS = 3;
const DENSITY_DISSIPATION = 0.93;
const VELOCITY_DISSIPATION = 0.9;
const PRESSURE_DISSIPATION = 0.8;
const CURL = 20;
const SPLAT_RADIUS = 0.3 / 100;

function supportRenderTextureFormat(gl, internalFormat, format, type) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.deleteTexture(texture);
  gl.deleteFramebuffer(fbo);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

function getSupportedFormat(gl, internalFormat, format, type) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    if (internalFormat === gl.R16F) return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
    if (internalFormat === gl.RG16F) return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
    return null;
  }
  return { internalFormat, format };
}

function createDoubleTarget(gl, options) {
  const target = {
    read: new RenderTarget(gl, options),
    write: new RenderTarget(gl, options),
    swap() {
      const temp = target.read;
      target.read = target.write;
      target.write = temp;
    },
  };
  return target;
}

function createTarget(gl, options) {
  return new RenderTarget(gl, options);
}

export class FluidSimulation {
  constructor(gl) {
    this.gl = gl;
    this.triangle = new Triangle(gl);
    this.splats = [];
    this.createTargets();
    this.createPrograms();
    this.initializeTargets();
  }

  createTargets() {
    this.ext = this.gl.renderer.isWebgl2
      ? this.gl.getExtension("EXT_color_buffer_float")
      : this.gl.getExtension("OES_texture_half_float");
    this.linearExt = this.gl.renderer.isWebgl2
      ? this.gl.getExtension("OES_texture_float_linear")
      : this.gl.getExtension("OES_texture_half_float_linear");

    const halfFloatType = this.gl.renderer.isWebgl2 ? this.gl.HALF_FLOAT : this.ext?.HALF_FLOAT_OES;
    const halfFloatTestFormat = this.gl.renderer.isWebgl2
      ? { internalFormat: this.gl.RGBA16F, format: this.gl.RGBA }
      : { internalFormat: this.gl.RGBA, format: this.gl.RGBA };
    const canUseHalfFloat = halfFloatType
      ? supportRenderTextureFormat(
          this.gl,
          halfFloatTestFormat.internalFormat,
          halfFloatTestFormat.format,
          halfFloatType,
        )
      : false;
    const type = canUseHalfFloat ? halfFloatType : this.gl.UNSIGNED_BYTE;
    const support = this.gl.renderer.isWebgl2 && this.ext && canUseHalfFloat;
    const rgba = support ? getSupportedFormat(this.gl, this.gl.RGBA16F, this.gl.RGBA, type) : null;
    const rg = support ? getSupportedFormat(this.gl, this.gl.RG16F, this.gl.RG, type) : null;
    const r = support ? getSupportedFormat(this.gl, this.gl.R16F, this.gl.RED, type) : null;
    const fallback = { internalFormat: this.gl.RGBA, format: this.gl.RGBA };
    const filter = this.linearExt ? this.gl.LINEAR : this.gl.NEAREST;

    const linear = {
      minFilter: filter,
      magFilter: filter,
      depth: false,
    };
    const nearest = {
      minFilter: this.gl.NEAREST,
      magFilter: this.gl.NEAREST,
      depth: false,
    };

    this.density = createDoubleTarget(this.gl, {
      width: DENSITY_RESOLUTION,
      height: DENSITY_RESOLUTION,
      type,
      ...(rgba || fallback),
      ...linear,
    });
    this.velocity = createDoubleTarget(this.gl, {
      width: VELOCITY_RESOLUTION,
      height: VELOCITY_RESOLUTION,
      type,
      ...(rg || rgba || fallback),
      ...linear,
    });
    this.pressure = createDoubleTarget(this.gl, {
      width: VELOCITY_RESOLUTION,
      height: VELOCITY_RESOLUTION,
      type,
      ...(r || rgba || fallback),
      ...nearest,
    });
    this.divergence = createTarget(this.gl, {
      width: VELOCITY_RESOLUTION,
      height: VELOCITY_RESOLUTION,
      type,
      ...(r || rgba || fallback),
      ...nearest,
    });
    this.curl = createTarget(this.gl, {
      width: VELOCITY_RESOLUTION,
      height: VELOCITY_RESOLUTION,
      type,
      ...(r || rgba || fallback),
      ...nearest,
    });
  }

  createMesh(fragment, uniforms) {
    return new Mesh(this.gl, {
      geometry: this.triangle,
      program: new Program(this.gl, {
        vertex: fullscreenVertex,
        fragment,
        uniforms,
        depthTest: false,
        depthWrite: false,
      }),
    });
  }

  createPrograms() {
    this.clearProgram = this.createMesh(clearFragment, {
      uTexture: { value: null },
      value: { value: PRESSURE_DISSIPATION },
    });
    this.splatProgram = this.createMesh(splatFragment, {
      uTarget: { value: null },
      aspectRatio: { value: 1 },
      color: { value: [1, 0, 0] },
      point: { value: [0.5, 0.5] },
      radius: { value: SPLAT_RADIUS },
    });
    this.advectionProgram = this.createMesh(advectionFragment, {
      uVelocity: { value: null },
      uSource: { value: null },
      texelSize: { value: [1 / VELOCITY_RESOLUTION, 1 / VELOCITY_RESOLUTION] },
      dt: { value: 0.016 },
      dissipation: { value: 1 },
    });
    this.divergenceProgram = this.createMesh(divergenceFragment, {
      uVelocity: { value: null },
      texelSize: { value: [1 / VELOCITY_RESOLUTION, 1 / VELOCITY_RESOLUTION] },
    });
    this.curlProgram = this.createMesh(curlFragment, {
      uVelocity: { value: null },
      texelSize: { value: [1 / VELOCITY_RESOLUTION, 1 / VELOCITY_RESOLUTION] },
    });
    this.vorticityProgram = this.createMesh(vorticityFragment, {
      uVelocity: { value: null },
      uCurl: { value: null },
      texelSize: { value: [1 / VELOCITY_RESOLUTION, 1 / VELOCITY_RESOLUTION] },
      curl: { value: CURL },
      dt: { value: 0.016 },
    });
    this.pressureProgram = this.createMesh(pressureFragment, {
      uPressure: { value: null },
      uDivergence: { value: null },
      texelSize: { value: [1 / VELOCITY_RESOLUTION, 1 / VELOCITY_RESOLUTION] },
    });
    this.gradientSubtractProgram = this.createMesh(gradientSubtractFragment, {
      uPressure: { value: null },
      uVelocity: { value: null },
      texelSize: { value: [1 / VELOCITY_RESOLUTION, 1 / VELOCITY_RESOLUTION] },
    });
  }

  initializeTargets() {
    const previousClearColor = this.gl.getParameter(this.gl.COLOR_CLEAR_VALUE);
    this.gl.clearColor(0, 0, 0, 0);
    [
      this.density.read,
      this.density.write,
      this.velocity.read,
      this.velocity.write,
      this.pressure.read,
      this.pressure.write,
      this.divergence,
      this.curl,
    ].forEach((target) => {
      this.gl.renderer.bindFramebuffer(target);
      this.gl.renderer.setViewport(target.width, target.height);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    });
    this.gl.renderer.bindFramebuffer();
    this.gl.clearColor(
      previousClearColor[0],
      previousClearColor[1],
      previousClearColor[2],
      previousClearColor[3],
    );
  }

  renderMesh(mesh, target) {
    this.gl.renderer.render({
      scene: mesh,
      target,
      clear: true,
      sort: false,
      update: false,
    });
  }

  addSplat(x, y, dx, dy) {
    this.splats.push({ x, y, dx, dy });
  }

  splat({ x, y, dx, dy }) {
    const aspectRatio = this.gl.renderer.width / this.gl.renderer.height;
    this.splatProgram.program.uniforms.aspectRatio.value = aspectRatio;
    this.splatProgram.program.uniforms.point.value = [x, y];

    this.splatProgram.program.uniforms.uTarget.value = this.velocity.read.texture;
    this.splatProgram.program.uniforms.color.value = [dx, dy, 1];
    this.renderMesh(this.splatProgram, this.velocity.write);
    this.velocity.swap();

    this.splatProgram.program.uniforms.uTarget.value = this.density.read.texture;
    this.splatProgram.program.uniforms.color.value = [dx, dy, 1];
    this.renderMesh(this.splatProgram, this.density.write);
    this.density.swap();
  }

  step(time) {
    while (this.splats.length) {
      this.splat(this.splats.shift());
    }

    this.curlProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.renderMesh(this.curlProgram, this.curl);

    this.vorticityProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.vorticityProgram.program.uniforms.uCurl.value = this.curl.texture;
    this.vorticityProgram.program.uniforms.dt.value = 0.016;
    this.renderMesh(this.vorticityProgram, this.velocity.write);
    this.velocity.swap();

    this.divergenceProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.renderMesh(this.divergenceProgram, this.divergence);

    this.clearProgram.program.uniforms.uTexture.value = this.pressure.read.texture;
    this.clearProgram.program.uniforms.value.value = PRESSURE_DISSIPATION;
    this.renderMesh(this.clearProgram, this.pressure.write);
    this.pressure.swap();

    this.pressureProgram.program.uniforms.uDivergence.value = this.divergence.texture;
    for (let i = 0; i < PRESSURE_ITERATIONS; i += 1) {
      this.pressureProgram.program.uniforms.uPressure.value = this.pressure.read.texture;
      this.renderMesh(this.pressureProgram, this.pressure.write);
      this.pressure.swap();
    }

    this.gradientSubtractProgram.program.uniforms.uPressure.value = this.pressure.read.texture;
    this.gradientSubtractProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.renderMesh(this.gradientSubtractProgram, this.velocity.write);
    this.velocity.swap();

    this.advectionProgram.program.uniforms.dt.value = 0.016;
    this.advectionProgram.program.uniforms.texelSize.value = [
      1 / VELOCITY_RESOLUTION,
      1 / VELOCITY_RESOLUTION,
    ];
    this.advectionProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionProgram.program.uniforms.uSource.value = this.velocity.read.texture;
    this.advectionProgram.program.uniforms.dissipation.value = VELOCITY_DISSIPATION;
    this.renderMesh(this.advectionProgram, this.velocity.write);
    this.velocity.swap();

    this.advectionProgram.program.uniforms.texelSize.value = [
      1 / VELOCITY_RESOLUTION,
      1 / VELOCITY_RESOLUTION,
    ];
    this.advectionProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionProgram.program.uniforms.uSource.value = this.density.read.texture;
    this.advectionProgram.program.uniforms.dissipation.value = DENSITY_DISSIPATION;
    this.renderMesh(this.advectionProgram, this.density.write);
    this.density.swap();
  }

  get texture() {
    return this.density.read.texture;
  }
}
