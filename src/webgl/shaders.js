export const planeVertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const textureFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform float uAlpha;

  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(tMap, vUv);
    gl_FragColor = vec4(color.rgb, color.a * uAlpha);
  }
`;

export const mediaFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform vec2 uPlaneSize;
  uniform vec2 uImageSize;
  uniform float uAlpha;

  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
    vec2 ratio = vec2(
      min((plane.x / plane.y) / (image.x / image.y), 1.0),
      min((plane.y / plane.x) / (image.y / image.x), 1.0)
    );
    return uv * ratio + (1.0 - ratio) * 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, max(uPlaneSize, vec2(1.0)), max(uImageSize, vec2(1.0)));
    vec4 color = texture2D(tMap, uv);
    gl_FragColor = vec4(color.rgb, color.a * uAlpha);
  }
`;

export const fullscreenVertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const clearFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float value;

  varying vec2 vUv;

  void main() {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

export const splatFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;

  varying vec2 vUv;

  void main() {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

export const advectionFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;

  varying vec2 vUv;

  void main() {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  }
`;

export const divergenceFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform vec2 texelSize;

  varying vec2 vUv;

  void main() {
    float l = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
    float r = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
    float b = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
    float t = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
    float div = 0.5 * (r - l + t - b);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

export const curlFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform vec2 texelSize;

  varying vec2 vUv;

  void main() {
    float l = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
    float r = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
    float b = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
    float t = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
    float vorticity = r - l - t + b;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

export const vorticityFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 texelSize;
  uniform float curl;
  uniform float dt;

  varying vec2 vUv;

  void main() {
    float l = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
    float r = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
    float b = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
    float t = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
    float c = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(t) - abs(b), abs(r) - abs(l));
    force /= length(force) + 0.0001;
    force *= curl * c;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const pressureFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 texelSize;

  varying vec2 vUv;

  void main() {
    float l = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float r = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float b = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    float t = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (l + r + b + t - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

export const gradientSubtractFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;

  varying vec2 vUv;

  void main() {
    float l = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float r = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float b = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    float t = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(r - l, t - b) * 0.5;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const compositeFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform sampler2D tFluid;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec3 fluid = texture2D(tFluid, vUv).rgb;
    vec2 uv = vUv;
    vec2 distortedUv = vUv - fluid.rg * 0.001;
    vec4 scene = texture2D(tMap, distortedUv);
    vec3 chroma = fluid * 0.003;
    scene.g = texture2D(tMap, vec2(uv.x - chroma.x, uv.y + chroma.y)).g;
    scene.b = texture2D(tMap, vec2(uv.x - chroma.x, uv.y + chroma.y)).b;
    float colorAmount = clamp(length(fluid) * 0.018, 0.0, 0.45);
    scene.rgb += vec3(0.9, 0.0, 0.025) * colorAmount;
    gl_FragColor = scene;
  }
`;
