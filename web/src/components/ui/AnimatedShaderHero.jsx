import React, { useRef, useEffect, useCallback, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   AnimatedShaderHero + ShaderBackground
   ───────────────────────────────────────────────────────────────────────
   Two exports:
   1. ShaderBackground — fixed WebGL canvas for full-page backgrounds
   2. AnimatedShaderHero — self-contained hero section with content

   Features:
   • Bright sky-blue gradient with soft volumetric clouds
   • Gentle rainbow bands drifting through the clouds
   • Pointer-interactive light bloom
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Default fragment shader: bright cloudscape + rainbow ── */
const defaultShaderSource = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_pointer;

out vec4 fragColor;

/* ── Hash-based noise ── */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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

/* ── Fractal Brownian Motion ── */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

/* ── Soft cloud shape ── */
float cloudShape(vec2 uv, float time) {
  vec2 q = vec2(fbm(uv + vec2(0.0, 0.0) + time * 0.04),
                fbm(uv + vec2(5.2, 1.3) + time * 0.03));
  vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + time * 0.02),
                fbm(uv + 4.0 * q + vec2(8.3, 2.8) + time * 0.025));
  return fbm(uv + 4.0 * r);
}

/* ── Rainbow color from position ── */
vec3 rainbow(float t) {
  return vec3(
    0.5 + 0.35 * sin(6.28318 * (t + 0.0)),
    0.5 + 0.35 * sin(6.28318 * (t + 0.33)),
    0.5 + 0.35 * sin(6.28318 * (t + 0.67))
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 centeredUv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float time = u_time;

  /* ── Sky gradient: bright blue top → warm white bottom ── */
  vec3 skyTop    = vec3(0.53, 0.81, 0.98);   /* sky-400 */
  vec3 skyMid    = vec3(0.69, 0.88, 1.0);    /* light cyan */
  vec3 skyBottom = vec3(1.0,  0.97, 0.93);   /* warm cream */

  float skyT = uv.y;
  vec3 sky = mix(skyBottom, skyMid, smoothstep(0.0, 0.5, skyT));
  sky = mix(sky, skyTop, smoothstep(0.5, 1.0, skyT));

  /* ── Cloud layer 1: large soft shapes ── */
  vec2 cloudUv1 = centeredUv * 2.5 + vec2(time * 0.015, 0.0);
  float c1 = cloudShape(cloudUv1, time);
  c1 = smoothstep(0.35, 0.75, c1);

  /* ── Cloud layer 2: smaller detail clouds ── */
  vec2 cloudUv2 = centeredUv * 4.0 + vec2(time * 0.025, time * 0.008);
  float c2 = cloudShape(cloudUv2 + 3.7, time * 1.1);
  c2 = smoothstep(0.4, 0.8, c2);

  /* ── Cloud layer 3: wispy high-altitude ── */
  vec2 cloudUv3 = centeredUv * 6.0 + vec2(time * 0.035, -time * 0.005);
  float c3 = fbm(cloudUv3 + 7.3);
  c3 = smoothstep(0.5, 0.85, c3) * 0.4;

  /* ── Combine cloud layers ── */
  float clouds = max(max(c1, c2 * 0.7), c3);
  clouds = clamp(clouds, 0.0, 1.0);

  /* ── Rainbow bands drifting through clouds ── */
  float rainbowPhase = centeredUv.x * 0.5 + centeredUv.y * 0.3 + time * 0.02;
  vec3 rainbowColor = rainbow(rainbowPhase);

  /* Pastel-ify the rainbow (mix toward white) */
  rainbowColor = mix(rainbowColor, vec3(1.0), 0.45);

  /* ── Sunlight glow from upper area ── */
  vec2 sunPos = vec2(0.2, 0.35);
  float sunDist = length(centeredUv - sunPos);
  float sunGlow = exp(-sunDist * 2.5) * 0.35;
  vec3 sunColor = vec3(1.0, 0.96, 0.85);

  /* ── Pointer-interactive bloom ── */
  vec2 pointerNorm = u_pointer / u_resolution;
  vec2 pointerCentered = (u_pointer - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float pointerDist = length(centeredUv - pointerCentered);
  float pointerGlow = exp(-pointerDist * 4.0) * 0.2;
  vec3 pointerColor = rainbow(pointerNorm.x + time * 0.05);
  pointerColor = mix(pointerColor, vec3(1.0), 0.5);

  /* ── Compose final color ── */
  vec3 color = sky;

  /* Add sun glow to sky */
  color += sunGlow * sunColor;

  /* Paint clouds: white base + subtle rainbow tint */
  vec3 cloudColor = mix(vec3(1.0), rainbowColor, 0.2);
  color = mix(color, cloudColor, clouds * 0.85);

  /* Add cloud edge rainbow iridescence */
  float cloudEdge = smoothstep(0.3, 0.5, clouds) - smoothstep(0.5, 0.8, clouds);
  color += cloudEdge * rainbowColor * 0.25;

  /* Apply pointer glow */
  color += pointerGlow * pointerColor;

  /* Subtle vignette (very light — keep it bright) */
  float vignette = 1.0 - 0.15 * length(centeredUv * 0.8);
  color *= vignette;

  /* Ensure brightness stays high */
  color = clamp(color, 0.0, 1.0);

  fragColor = vec4(color, 1.0);
}
`;

/* ── Vertex shader (fullscreen quad) ── */
const vertexShaderSource = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

/* ── Shared WebGL hook ── */
const useShaderCanvas = (canvasRef, shaderSource) => {
  const animationRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [webglSupported, setWebglSupported] = useState(true);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, shaderSource);
    if (!vs || !fs) { setWebglSupported(false); return; }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program));
      setWebglSupported(false);
      return;
    }

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime       = gl.getUniformLocation(program, 'u_time');
    const uPointer    = gl.getUniformLocation(program, 'u_pointer');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth  * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();
    const render = () => {
      resize();
      const elapsed = (performance.now() - startTime) / 1000.0;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uPointer, pointerRef.current.x, pointerRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
    };
  }, [canvasRef, shaderSource]);

  useEffect(() => {
    const cleanup = initWebGL();
    return () => { if (cleanup) cleanup(); };
  }, [initWebGL]);

  const handlePointerMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    pointerRef.current = {
      x: (e.clientX - rect.left) * dpr,
      y: (rect.height - (e.clientY - rect.top)) * dpr,
    };
  }, [canvasRef]);

  return { webglSupported, handlePointerMove };
};


/* ═══════════════════════════════════════════════════════════════════════
   ShaderBackground — fixed full-page background canvas
   Wrap your entire page content inside this component.
   ═══════════════════════════════════════════════════════════════════════ */
export const ShaderBackground = ({
  shaderSource = defaultShaderSource,
  className = '',
  children,
}) => {
  const canvasRef = useRef(null);
  const { webglSupported, handlePointerMove } = useShaderCanvas(canvasRef, shaderSource);

  return (
    <div
      className={`shader-bg ${className}`}
      onPointerMove={handlePointerMove}
    >
      <canvas
        ref={canvasRef}
        className="shader-bg__canvas"
        aria-hidden="true"
      />
      {!webglSupported && <div className="shader-bg__fallback" />}

      {/* All page content sits above the shader */}
      <div className="shader-bg__content">
        {children}
      </div>

      <style>{`
        .shader-bg {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(180deg, #bae6fd 0%, #e0f2fe 40%, #fff7ed 100%);
        }

        .shader-bg__canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: block;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(180deg, #87ceeb 0%, #e0f2fe 50%, #fffbeb 100%);
        }

        .shader-bg__fallback {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            #87ceeb 0%,
            #bae6fd 25%,
            #e8d5f5 50%,
            #fce7f3 70%,
            #fef3c7 100%
          );
          animation: shaderFallbackShift 20s ease-in-out infinite alternate;
        }

        @keyframes shaderFallbackShift {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(30deg); }
        }

        .shader-bg__content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════════
   AnimatedShaderHero — self-contained hero section (original export)
   ═══════════════════════════════════════════════════════════════════════ */
const AnimatedShaderHero = ({
  title = 'Meet the Heroes',
  titleAccent = 'of Rhythm Quest',
  subtitle = 'Fourteen brave characters across seven magical lands, each carrying a unique gift for the developing mind.',
  badgeText = '✨ 14 Characters · 7 Lands',
  primaryButtonText = 'Start the Quest',
  primaryButtonHref = '/join',
  secondaryButtonText = 'Explore the Universe',
  secondaryButtonHref = '/universe',
  shaderSource = defaultShaderSource,
  className = '',
  children,
}) => {
  const canvasRef = useRef(null);
  const { webglSupported, handlePointerMove } = useShaderCanvas(canvasRef, shaderSource);

  return (
    <div
      className={`shader-hero ${className}`}
      onPointerMove={handlePointerMove}
    >
      <canvas
        ref={canvasRef}
        className="shader-hero__canvas"
        aria-hidden="true"
      />
      {!webglSupported && <div className="shader-hero__fallback" />}

      <div className="shader-hero__content">
        <div className="shader-hero__inner">
          {badgeText && (
            <div className="shader-hero__badge-wrap">
              <span className="shader-hero__badge">{badgeText}</span>
            </div>
          )}
          <h1 className="shader-hero__title">
            {title}{' '}
            <span className="shader-hero__title-accent">{titleAccent}</span>
          </h1>
          {subtitle && (
            <p className="shader-hero__subtitle">{subtitle}</p>
          )}
          {(primaryButtonText || secondaryButtonText) && (
            <div className="shader-hero__actions">
              {primaryButtonText && (
                <a href={primaryButtonHref} className="shader-hero__btn-primary">
                  {primaryButtonText}
                </a>
              )}
              {secondaryButtonText && (
                <a href={secondaryButtonHref} className="shader-hero__btn-secondary">
                  {secondaryButtonText} →
                </a>
              )}
            </div>
          )}
          {children}
        </div>
      </div>

      <style>{`
        .shader-hero {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: linear-gradient(180deg, #bae6fd 0%, #e0f2fe 40%, #fff7ed 100%);
        }
        .shader-hero__canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          background: linear-gradient(180deg, #87ceeb 0%, #e0f2fe 50%, #fffbeb 100%);
        }
        .shader-hero__fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #87ceeb 0%, #bae6fd 25%, #e8d5f5 50%, #fce7f3 70%, #fef3c7 100%);
          animation: shaderFallbackShift 20s ease-in-out infinite alternate;
        }
        .shader-hero__content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 6rem 1.5rem 4rem;
        }
        .shader-hero__inner {
          max-width: 720px;
          text-align: center;
        }
        .shader-hero__badge-wrap {
          margin-bottom: 1.5rem;
        }
        .shader-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #334155;
          font-family: var(--font-heading, 'Inter', sans-serif);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.4rem 1.1rem;
          border-radius: 999px;
          text-shadow: 0 1px 2px rgba(255,255,255,0.4);
        }
        .shader-hero__title {
          font-family: var(--font-heading, 'Inter', sans-serif);
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 1.25rem;
          color: #1e293b;
          text-shadow: 0 2px 8px rgba(255,255,255,0.5);
        }
        .shader-hero__title-accent {
          background: linear-gradient(135deg, #0ea5e9, #d946ef, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .shader-hero__subtitle {
          font-size: 1.1rem;
          line-height: 1.75;
          color: #475569;
          max-width: 560px;
          margin: 0 auto 2rem;
          text-shadow: 0 1px 4px rgba(255,255,255,0.6);
        }
        .shader-hero__actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .shader-hero__btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 2rem;
          font-family: var(--font-heading, 'Inter', sans-serif);
          font-weight: 700;
          font-size: 0.95rem;
          color: #fff;
          background: linear-gradient(135deg, #38bdf8, #e879f9, #fbbf24);
          border: none;
          border-radius: 999px;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(56,189,248,0.3), 0 2px 8px rgba(232,121,249,0.2);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .shader-hero__btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 24px rgba(56,189,248,0.4), 0 4px 12px rgba(232,121,249,0.3);
        }
        .shader-hero__btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 2rem;
          font-family: var(--font-heading, 'Inter', sans-serif);
          font-weight: 600;
          font-size: 0.95rem;
          color: #334155;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          border-radius: 999px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .shader-hero__btn-secondary:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.6);
        }
        @media (max-width: 768px) {
          .shader-hero__content { padding: 5rem 1rem 3rem; }
          .shader-hero__title { font-size: clamp(1.8rem, 6vw, 2.8rem); }
          .shader-hero__subtitle { font-size: 1rem; }
        }
        @media (max-width: 480px) {
          .shader-hero__actions { flex-direction: column; align-items: center; }
          .shader-hero__btn-primary,
          .shader-hero__btn-secondary { width: 100%; max-width: 280px; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedShaderHero;
