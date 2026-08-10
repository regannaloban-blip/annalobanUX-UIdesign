import React, { useEffect, useRef, useState } from "react";

const SETTINGS = { intensity: 0.25, radius: 6, prism: 0.012, trail: 0.97 };
const TRAIL_FADE = 0.972 + (SETTINGS.trail - 0.9) * 0.05;
const MAX_STAMPS = 12;

const vertexSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * .5 + .5;
    gl_Position = vec4(aPosition, 0., 1.);
  }
`;

const fragmentSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform float uAspect;
  uniform float uImageAspect;
  uniform float uIntensity;
  uniform float uRadius;
  uniform float uPrism;
  uniform vec4 uStamps[12];
  uniform float uLives[12];

  vec2 coverUv(vec2 uv) {
    if (uAspect > uImageAspect) {
      uv.y = (uv.y - .5) * (uImageAspect / uAspect) + .5;
    } else {
      uv.x = (uv.x - .5) * (uAspect / uImageAspect) + .5;
    }
    return uv;
  }

  void main() {
    vec2 smear = vec2(0.);
    vec2 chroma = vec2(0.);

    for (int i = 0; i < 12; i++) {
      vec4 stamp = uStamps[i];
      float life = uLives[i];
      vec2 metric = vec2((vUv.x - stamp.x) * uAspect, vUv.y - stamp.y);
      vec2 velocityMetric = vec2(stamp.z * uAspect, stamp.w);
      float speed = length(velocityMetric);
      vec2 direction = speed > .00001 ? velocityMetric / speed : vec2(1., 0.);
      float along = dot(metric, direction);
      float across = dot(metric, vec2(-direction.y, direction.x));
      float tailShape = along < 0. ? .12 : 1.6;
      float brush = exp(-(across * across * uRadius * 1.15 + along * along * uRadius * tailShape)) * life;
      smear += stamp.zw * brush * uIntensity * 2.6;
      chroma += direction / vec2(uAspect, 1.) * brush * uPrism * min(speed * 42., 1.);
    }

    vec2 baseUv = clamp(coverUv(vUv - smear), .001, .999);
    float red = texture2D(uImage, clamp(baseUv - chroma, .001, .999)).r;
    float green = texture2D(uImage, baseUv).g;
    float blue = texture2D(uImage, clamp(baseUv + chroma, .001, .999)).b;
    gl_FragColor = vec4(red, green, blue, 1.);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export function FluidImageHover({ src, alt, className = "" }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const container = canvas?.parentElement;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canvas || !image || !container || !canHover) return undefined;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: true });
    if (!gl) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      image: gl.getUniformLocation(program, "uImage"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      imageAspect: gl.getUniformLocation(program, "uImageAspect"),
      intensity: gl.getUniformLocation(program, "uIntensity"),
      radius: gl.getUniformLocation(program, "uRadius"),
      prism: gl.getUniformLocation(program, "uPrism"),
      stamps: gl.getUniformLocation(program, "uStamps[0]"),
      lives: gl.getUniformLocation(program, "uLives[0]"),
    };
    const texture = gl.createTexture();
    const stamps = new Float32Array(MAX_STAMPS * 4);
    const lives = new Float32Array(MAX_STAMPS);
    const pointer = { previousX: 0.5, previousY: 0.5, active: false };
    let visible = false;
    let width = 1;
    let height = 1;
    let frameId = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const uploadTexture = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      setReady(true);
    };

    const updatePointer = (event) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const vx = Math.max(-0.08, Math.min(0.08, x - pointer.previousX));
      const vy = Math.max(-0.08, Math.min(0.08, y - pointer.previousY));
      pointer.previousX = x;
      pointer.previousY = y;
      if (!pointer.active) return;
      stamps.copyWithin(4, 0, (MAX_STAMPS - 1) * 4);
      lives.copyWithin(1, 0, MAX_STAMPS - 1);
      stamps.set([x, y, vx, vy], 0);
      lives[0] = 1;
    };

    const onEnter = (event) => {
      updatePointer(event);
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const visibilityObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !frameId) frameId = window.requestAnimationFrame(render);
          if (!visible && frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
          }
        },
        { rootMargin: "160px 0px" },
      )
      : null;
    visibilityObserver?.observe(container);
    if (!visibilityObserver) visible = true;
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointermove", updatePointer);
    container.addEventListener("pointerleave", onLeave);
    resize();
    if (image.complete) uploadTexture();
    else image.addEventListener("load", uploadTexture, { once: true });

    const render = () => {
      for (let index = 0; index < lives.length; index += 1) lives[index] *= TRAIL_FADE;
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.image, 0);
      gl.uniform1f(uniforms.aspect, width / height);
      gl.uniform1f(uniforms.imageAspect, image.naturalWidth / image.naturalHeight || 1);
      gl.uniform1f(uniforms.intensity, SETTINGS.intensity);
      gl.uniform1f(uniforms.radius, SETTINGS.radius);
      gl.uniform1f(uniforms.prism, SETTINGS.prism);
      gl.uniform4fv(uniforms.stamps, stamps);
      gl.uniform1fv(uniforms.lives, lives);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = visible ? window.requestAnimationFrame(render) : 0;
    };

    if (visible) frameId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      visibilityObserver?.disconnect();
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointermove", updatePointer);
      container.removeEventListener("pointerleave", onLeave);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [src]);

  return (
    <>
      <img ref={imageRef} src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />
      <canvas ref={canvasRef} aria-hidden="true" className={`fluid-image-hover-canvas ${ready ? "is-ready" : ""} ${className}`} />
    </>
  );
}
