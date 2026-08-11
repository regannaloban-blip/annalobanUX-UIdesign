import React, { useEffect, useRef } from "react";
import WebGLFluid from "webgl-fluid";

const vertexSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    value += noise(p) * 0.52;
    p = p * 2.03 + 11.8;
    value += noise(p) * 0.25;
    p = p * 2.01 + 7.3;
    value += noise(p) * 0.15;
    p = p * 2.07 + 3.1;
    value += noise(p) * 0.08;
    return value;
  }

  float flameField(vec2 p, float time) {
    vec2 drift = vec2(time * 0.264, -time * 0.132);
    p *= vec2(0.54, 1.08);
    p.x += (fbm(p * 0.62 + drift) - 0.5) * 1.25;
    vec2 warp = vec2(
      fbm(p * 0.66 + drift),
      fbm(p * 0.66 - drift * 0.7 + 9.4)
    ) - 0.5;
    float broad = fbm(p * 0.62 + warp * 1.25 + drift * 0.55);
    float detail = fbm(p * 1.12 - warp * 0.72 - drift);
    return smoothstep(0.45, 0.76, broad + detail * 0.19);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    float smoke = flameField(p + vec2(0.18, -0.14), uTime);
    float bottomMask = smoothstep(0.0, 0.95, 0.5 - p.y);
    float base = smoke * (0.34 + 0.34 * smoothstep(0.42, 0.8, smoke)) * bottomMask * 0.4;
    vec3 red = vec3(0.62, 0.003, 0.0) * base;
    red += vec3(0.19, 0.0, 0.0) * base * 0.32;
    gl_FragColor = vec4(red, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

export function PortfolioFluidBackground({ desktop, enabled, reduced }) {
  const backgroundRef = useRef(null);
  const pointerRef = useRef(null);

  useEffect(() => {
    if (!enabled || reduced || !backgroundRef.current || !pointerRef.current) return undefined;

    const background = backgroundRef.current;
    const pointer = pointerRef.current;
    const gl = background.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }

    const position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const locations = {
      position: gl.getAttribLocation(program, "aPosition"),
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
    };

    const shouldRunAcrossPage = () => desktop || window.scrollY < window.innerHeight;
    let backgroundActive = shouldRunAcrossPage();
    let frame = 0;
    let lastRender = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      background.width = Math.round(background.clientWidth * dpr);
      background.height = Math.round(background.clientHeight * dpr);
      gl.viewport(0, 0, background.width, background.height);
      backgroundActive = shouldRunAcrossPage();
      startBackgroundRender();
    };

    const updateScrollState = () => {
      const nextBackgroundActive = shouldRunAcrossPage();
      if (nextBackgroundActive === backgroundActive) return;
      backgroundActive = nextBackgroundActive;
      startBackgroundRender();
    };

    const renderBackground = (time) => {
      if (!backgroundActive || document.hidden) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        frame = 0;
        return;
      }

      if (time - lastRender < 66) {
        frame = requestAnimationFrame(renderBackground);
        return;
      }

      lastRender = time;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, position);
      gl.enableVertexAttribArray(locations.position);
      gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(locations.resolution, background.width, background.height);
      gl.uniform1f(locations.time, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(renderBackground);
    };

    function startBackgroundRender() {
      if (!frame) frame = requestAnimationFrame(renderBackground);
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let fluidReady = false;
    let disposed = false;

    const setupFluid = () => {
      if (fluidReady || disposed) return;

      WebGLFluid(pointer, {
        TRIGGER: "hover",
        IMMEDIATE: false,
        AUTO: false,
        SIM_RESOLUTION: coarsePointer ? 128 : 192,
        DYE_RESOLUTION: coarsePointer ? 768 : 1024,
        DENSITY_DISSIPATION: coarsePointer ? 0.985 : 0.93,
        VELOCITY_DISSIPATION: coarsePointer ? 0.035 : 0.08,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: coarsePointer ? 16 : 24,
        CURL: 0,
        SPLAT_RADIUS: coarsePointer ? 0.48 : 0.24,
        SPLAT_FORCE: coarsePointer ? 8200 : 2800,
        SPLAT_COUNT: 1,
        SPLAT_COLOR: { r: coarsePointer ? 0.52 : 0.34, g: 0, b: 0 },
        SHADING: false,
        COLORFUL: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: true,
        BLOOM: false,
        SUNRAYS: false,
      });
      fluidReady = true;
    };

    const forwardPointer = (event) => {
      if (!event.isTrusted) return;
      if (!desktop && window.scrollY >= window.innerHeight) return;
      setupFluid();
      pointer.dispatchEvent(new MouseEvent("mousemove", {
        bubbles: true,
        clientX: event.clientX,
        clientY: event.clientY,
      }));
    };

    const startPointer = (event) => {
      if (!event.isTrusted) return;
      setupFluid();
      pointer.dispatchEvent(new MouseEvent("mousedown", {
        bubbles: true,
        clientX: event.clientX,
        clientY: event.clientY,
      }));
    };

    let lastTouchPoint = null;

    const dispatchTouchSplat = (point, offsetX = 0, offsetY = 0) => {
      pointer.dispatchEvent(new MouseEvent("mousemove", {
        bubbles: true,
        clientX: point.clientX + offsetX,
        clientY: point.clientY + offsetY,
      }));
    };

    const startTouchStroke = (point) => {
      pointer.dispatchEvent(new MouseEvent("mousedown", {
        bubbles: true,
        clientX: point.clientX,
        clientY: point.clientY,
      }));
    };

    const drawTouchTail = (point, previousPoint = null) => {
      const dx = previousPoint ? point.clientX - previousPoint.clientX : 72;
      const dy = previousPoint ? point.clientY - previousPoint.clientY : 18;
      const length = Math.hypot(dx, dy);
      const fallbackDirection = window.innerWidth / 2 > point.clientX ? 1 : -1;
      const unitX = length > 0.1 ? dx / length : fallbackDirection;
      const unitY = length > 0.1 ? dy / length : -0.16;
      const tailLength = Math.max(96, Math.min(220, length * 2.4));
      const steps = 6;

      for (let index = 0; index <= steps; index += 1) {
        const progress = index / steps;
        const offsetX = unitX * tailLength * progress;
        const offsetY = unitY * tailLength * progress;
        window.setTimeout(() => dispatchTouchSplat(point, offsetX, offsetY), index * 18);
      }
    };

    const moveTouchPointer = (event) => {
      const touch = event.touches[0] || event.changedTouches[0];
      if (!touch) return;

      setupFluid();
      startTouchStroke(touch);
      drawTouchTail(touch, lastTouchPoint);
      lastTouchPoint = { clientX: touch.clientX, clientY: touch.clientY };
    };

    const pulseTapPointer = (event) => {
      const touch = event.changedTouches[0] || event.touches[0];
      if (!touch) return;

      setupFluid();
      lastTouchPoint = { clientX: touch.clientX, clientY: touch.clientY };
      startTouchStroke(touch);
      drawTouchTail(touch);
      window.setTimeout(() => dispatchTouchSplat(touch, -42, 34), 34);
      window.setTimeout(() => dispatchTouchSplat(touch, 52, -38), 72);
      window.setTimeout(() => dispatchTouchSplat(touch, 138, 18), 118);
    };

    const resetTouchPointer = () => {
      lastTouchPoint = null;
    };

    const stopNativeTouchFluid = (event) => {
      event.stopImmediatePropagation();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("mousemove", forwardPointer, { passive: true });
    window.addEventListener("mousedown", startPointer, { passive: true });
    pointer.addEventListener("touchstart", stopNativeTouchFluid, { capture: true });
    pointer.addEventListener("touchmove", stopNativeTouchFluid, { capture: true });
    window.addEventListener("touchstart", pulseTapPointer, { passive: true });
    window.addEventListener("touchmove", moveTouchPointer, { passive: true });
    window.addEventListener("touchend", resetTouchPointer, { passive: true });
    window.addEventListener("touchcancel", resetTouchPointer, { passive: true });
    startBackgroundRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("mousemove", forwardPointer);
      window.removeEventListener("mousedown", startPointer);
      pointer.removeEventListener("touchstart", stopNativeTouchFluid, { capture: true });
      pointer.removeEventListener("touchmove", stopNativeTouchFluid, { capture: true });
      window.removeEventListener("touchstart", pulseTapPointer);
      window.removeEventListener("touchmove", moveTouchPointer);
      window.removeEventListener("touchend", resetTouchPointer);
      window.removeEventListener("touchcancel", resetTouchPointer);
      gl.deleteBuffer(position);
      gl.deleteProgram(program);
    };
  }, [desktop, enabled, reduced]);

  if (!enabled || reduced) return null;

  return (
    <>
      <canvas ref={backgroundRef} className="portfolio-fluid-background" aria-hidden="true" />
      <canvas ref={pointerRef} className="portfolio-fluid-pointer" aria-hidden="true" />
    </>
  );
}
