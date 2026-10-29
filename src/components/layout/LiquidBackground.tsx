import { useEffect, useRef } from "react";

const READY_EVENT = "6b:shader-ready";

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 1; i++) {
    value += amplitude * noise(p);
    p = mat2(1.62, -1.18, 1.18, 1.62) * p + vec2(13.7, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 resolution = max(u_resolution, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / resolution;
  float aspect = resolution.x / max(resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.48;

  // Large, slow domain-warped fields create a soft liquid surface without grain or hard edges.
  float warpA = fbm(p * 0.74 + vec2(t * 0.56, -t * 0.29));
  float warpB = fbm(p * 0.68 + vec2(-t * 0.24, t * 0.42));
  vec2 flow = p + (vec2(warpA, warpB) - 0.5) * 0.88;

  float fieldA = fbm(flow * 1.06 + vec2(t * 0.22, -t * 0.15));
  float fieldB = fbm(flow * 1.34 + vec2(-t * 0.19, t * 0.18));
  float blendField = fieldA * 0.58 + fieldB * 0.42;

  float rose = smoothstep(0.32, 0.73, fieldA) * (1.0 - smoothstep(0.67, 0.88, fieldB));
  float sage = smoothstep(0.43, 0.78, fieldB);
  float champagne = smoothstep(0.56, 0.83, blendField) * 0.32;
  float liquidRim = 1.0 - smoothstep(0.012, 0.105, abs(fieldA - fieldB - 0.018 * sin(flow.x * 1.15 + flow.y * 0.82 + t * 0.5)));
  float sheen = exp(-abs(fieldA - fieldB) * 12.0) * smoothstep(0.32, 0.76, blendField);
  float vignette = 1.0 - smoothstep(0.24, 1.5, length((uv - 0.5) * vec2(aspect * 0.72, 1.0)));

  vec3 color = vec3(0.008, 0.009, 0.012);
  color = mix(color, vec3(0.105, 0.042, 0.060), rose * 0.78);
  color = mix(color, vec3(0.035, 0.082, 0.070), sage * 0.63);
  color = mix(color, vec3(0.135, 0.098, 0.065), champagne * 0.5);
  color += vec3(0.095, 0.072, 0.059) * liquidRim * 0.075;
  color += vec3(0.055, 0.026, 0.033) * sheen * 0.19;
  color *= mix(0.72, 1.0, vignette);

  gl_FragColor = vec4(clamp(color, vec3(0.004), vec3(0.23)), 1.0);
}
`;

function announceReady() {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  document.documentElement.dataset["shaderReady"] = "true";
  window.dispatchEvent(new Event(READY_EVENT));
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  const fragmentSource = FRAGMENT_SHADER.replace(
    "precision highp float;",
    precision && precision.precision > 0 ? "precision highp float;" : "precision mediump float;",
  );
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      announceReady();
      return;
    }

    document.documentElement.dataset["shaderReady"] = "false";
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = media.matches;
    let visible = document.visibilityState === "visible";
    let frame = 0;
    let lastDraw = 0;
    let startAt = performance.now();
    let scrollPaused = false;
    let scrollResumeTimer = 0;
    let disposed = false;
    let readyAnnounced = false;
    let readyMarked = false;
    let readyTimer = 0;
    let announceTimer = 0;
    let fallbackTimer = 0;
    let observer: ResizeObserver | null = null;
    let program: WebGLProgram | null = null;
    let gl: WebGLRenderingContext | null = null;
    let resolutionLocation: WebGLUniformLocation | null = null;
    let timeLocation: WebGLUniformLocation | null = null;

    const markReady = () => {
      if (disposed || readyMarked) return;
      readyMarked = true;
      readyTimer = window.setTimeout(() => {
        if (disposed) return;
        canvas.classList.add("is-ready");
        if (!readyAnnounced) {
          readyAnnounced = true;
          announceTimer = window.setTimeout(announceReady, 180);
        }
      }, 24);
    };

    const fallback = () => {
      fallbackTimer = window.setTimeout(() => {
        if (!disposed) canvas.classList.add("is-fallback-only");
      }, 0);
      markReady();
    };

    const cleanupFallback = () => {
      disposed = true;
      window.clearTimeout(readyTimer);
      window.clearTimeout(announceTimer);
      window.clearTimeout(fallbackTimer);
    };

    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      });
    } catch {
      fallback();
      return cleanupFallback;
    }

    if (!gl) {
      fallback();
      return cleanupFallback;
    }

    program = createProgram(gl);
    if (!program) {
      fallback();
      return cleanupFallback;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      fallback();
      return cleanupFallback;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    timeLocation = gl.getUniformLocation(program, "u_time");
    gl.clearColor(0.004, 0.004, 0.004, 1);

    const draw = (now: number) => {
      if (!gl || !program || disposed) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      if (timeLocation) gl.uniform1f(timeLocation, reducedMotion ? 0 : (now - startAt) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      markReady();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const pixelBudget = 300_000;
      const scale = Math.min(
        window.devicePixelRatio || 1,
        1,
        Math.sqrt(pixelBudget / (width * height)),
      );
      const drawingWidth = Math.max(1, Math.round(width * scale));
      const drawingHeight = Math.max(1, Math.round(height * scale));
      if (canvas.width !== drawingWidth || canvas.height !== drawingHeight) {
        canvas.width = drawingWidth;
        canvas.height = drawingHeight;
      }
      draw(performance.now());
    };

    const tick = (now: number) => {
      frame = 0;
      if (disposed || reducedMotion || !visible) return;
      const frameInterval = scrollPaused ? 1000 / 12 : 1000 / 30;
      if (now - lastDraw >= frameInterval) {
        draw(now);
        lastDraw = now;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const start = () => {
      stop();
      if (!reducedMotion && visible && !disposed) frame = window.requestAnimationFrame(tick);
    };

    // Freeze the shader clock during scrolling and compensate for paused time on resume.
    const onScroll = () => {
      if (!scrollPaused) {
        scrollPaused = true;
        document.documentElement.classList.add("is-scrolling");
      }

      window.clearTimeout(scrollResumeTimer);
      scrollResumeTimer = window.setTimeout(() => {
        if (!scrollPaused || disposed) return;

        scrollPaused = false;
        scrollResumeTimer = 0;
        document.documentElement.classList.remove("is-scrolling");
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const onMotionPreference = () => {
      reducedMotion = media.matches;
      if (reducedMotion) {
        stop();
        draw(0);
      } else {
        startAt = performance.now();
        start();
      }
    };
    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible";
      if (visible) {
        startAt = performance.now();
        draw(startAt);
        start();
      } else {
        stop();
      }
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      fallback();
    };

    observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    media.addEventListener?.("change", onMotionPreference);
    canvas.addEventListener("webglcontextlost", onContextLost);

    resize();
    if (reducedMotion) draw(0);
    else start();

    return () => {
      disposed = true;
      stop();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollResumeTimer);
      document.documentElement.classList.remove("is-scrolling");
      window.clearTimeout(readyTimer);
      window.clearTimeout(announceTimer);
      window.clearTimeout(fallbackTimer);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      media.removeEventListener?.("change", onMotionPreference);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (buffer) gl?.deleteBuffer(buffer);
      if (program) gl?.deleteProgram(program);
    };
  }, []);

  return (
    <div className="liquid-bg" aria-hidden="true">
      <div className="liquid-base" />
      <canvas ref={canvasRef} className="liquid-shader-canvas" aria-hidden="true" />
      <div className="liquid-shader-tint" />
      <div className="liquid-shader-vignette" />
      <div className="liquid-flow-fallback" />
    </div>
  );
}
