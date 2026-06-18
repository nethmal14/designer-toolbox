import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

export interface ShaderPreset {
  name: string;
  description: string;
  fragment: string;
}

export const SHADER_PRESETS: ShaderPreset[] = [
  {
    name: "Plasma",
    description: "Classic sine-wave color plasma",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float v = 0.0;
        vec2 c = uv * 4.0 - 2.0;
        v += sin(c.x + u_time);
        v += sin(c.y + u_time * 0.7);
        v += sin(c.x + c.y + u_time * 0.5);
        c += 2.0 * vec2(sin(u_time * 0.3), cos(u_time * 0.5));
        v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + u_time);
        vec3 col = vec3(
          0.5 + 0.5 * sin(v * 3.14159),
          0.3 + 0.5 * sin(v * 3.14159 + 2.094),
          0.5 + 0.5 * sin(v * 3.14159 + 4.188)
        );
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  {
    name: "Aurora",
    description: "Flowing Northern Lights",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float aurora = 0.0;
        for(int i = 0; i < 5; i++) {
          float fi = float(i);
          float wave = sin(uv.x * 3.0 + u_time * 0.5 + fi * 1.3) * 0.15;
          float band = smoothstep(0.0, 0.15, uv.y - 0.3 + wave + fi * 0.07) *
                       smoothstep(0.0, 0.15, 0.75 - uv.y + wave - fi * 0.07);
          aurora += band * (0.7 - fi * 0.1);
        }
        vec3 sky = mix(vec3(0.01, 0.01, 0.06), vec3(0.05, 0.1, 0.2), uv.y);
        vec3 auroraColor = vec3(
          0.05 + sin(u_time * 0.3) * 0.05,
          0.7 + sin(u_time * 0.2) * 0.15,
          0.4 + cos(u_time * 0.4) * 0.3
        );
        vec3 col = mix(sky, auroraColor, aurora * 0.85);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  {
    name: "Ocean",
    description: "Animated ocean waves and horizon",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float wave1 = sin(uv.x * 8.0 + u_time) * 0.04;
        float wave2 = sin(uv.x * 5.0 - u_time * 0.8) * 0.03;
        float wave3 = sin(uv.x * 13.0 + u_time * 1.3) * 0.015;
        float horizon = 0.48 + wave1 + wave2 + wave3;
        float sky = smoothstep(horizon, horizon + 0.008, uv.y);
        vec3 skyColor = mix(vec3(0.55, 0.75, 1.0), vec3(0.15, 0.35, 0.8), uv.y * 0.8);
        vec3 oceanColor = mix(vec3(0.0, 0.08, 0.28), vec3(0.0, 0.25, 0.55), uv.y / max(horizon, 0.01));
        float foam = smoothstep(horizon - 0.008, horizon, uv.y) * smoothstep(horizon + 0.008, horizon, uv.y);
        vec3 col = mix(oceanColor, skyColor, sky);
        col += vec3(foam * 0.6);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  {
    name: "Voronoi",
    description: "Animated cellular noise",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453123);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution * 5.0;
        vec2 i = floor(uv);
        vec2 f = fract(uv);
        float minDist = 1.0;
        vec2 minPoint = vec2(0.0);
        for(int y = -1; y <= 1; y++) {
          for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = hash2(i + neighbor);
            point = 0.5 + 0.5 * sin(u_time * 0.5 + 6.28318 * point);
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            if(dist < minDist) { minDist = dist; minPoint = point; }
          }
        }
        vec3 col = vec3(0.05 + minDist * 0.4, 0.02 + minPoint.x * 0.25, 0.15 + minPoint.y * 0.45);
        col += vec3(0.1, 0.0, 0.3) * (1.0 - minDist);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  {
    name: "Lava Lamp",
    description: "Organic metaball blobs",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      float ball(vec2 uv, vec2 pos, float r) {
        vec2 d = uv - pos;
        return r / dot(d, d);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float t = u_time * 0.3;
        float m = 0.0;
        m += ball(uv, vec2(0.5 + sin(t) * 0.28, 0.5 + cos(t * 0.7) * 0.28), 0.012);
        m += ball(uv, vec2(0.5 + cos(t * 0.8) * 0.22, 0.5 + sin(t * 1.2) * 0.24), 0.009);
        m += ball(uv, vec2(0.5 + sin(t * 1.5) * 0.18, 0.5 + cos(t * 1.1) * 0.22), 0.010);
        m += ball(uv, vec2(0.5 + cos(t * 0.6) * 0.28, 0.5 + sin(t * 0.9) * 0.26), 0.008);
        float blob = smoothstep(0.75, 1.05, m);
        vec3 blobColor = vec3(0.85, 0.25, 0.08) + vec3(0.1, 0.0, 0.35) * sin(t + uv.x * 3.0);
        vec3 bgColor = vec3(0.04, 0.01, 0.08);
        vec3 col = mix(bgColor, blobColor, blob);
        col += vec3(0.6, 0.2, 0.0) * pow(blob, 3.0) * 0.4;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  {
    name: "Electric",
    description: "Fractal noise electricity",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for(int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
        return v;
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 p = uv * 3.0;
        float n1 = fbm(p + u_time * 0.2);
        float n2 = fbm(p + n1 + u_time * 0.1);
        float e = fbm(p + n2 + u_time * 0.15);
        vec3 col = mix(vec3(0.0, 0.0, 0.12), vec3(0.25, 0.05, 0.75), e);
        col += vec3(0.0, 0.3, 1.0) * pow(e, 2.5) * 1.8;
        col += vec3(1.0, 1.0, 1.0) * pow(e, 6.0) * 0.5;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  {
    name: "Matrix",
    description: "Digital rain effect",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 grid = floor(uv * vec2(40.0, 24.0));
        float speed = 1.5 + rand(grid.xx) * 2.0;
        float offset = rand(grid.xx + 0.5) * 10.0;
        float drop = mod(u_time * speed + offset, 12.0);
        float inDrop = smoothstep(drop - 2.0, drop - 0.1, grid.y / 24.0 * 12.0);
        inDrop *= smoothstep(drop + 0.5, drop, grid.y / 24.0 * 12.0);
        float head = smoothstep(drop - 0.5, drop, grid.y / 24.0 * 12.0) *
                     smoothstep(drop + 0.1, drop, grid.y / 24.0 * 12.0);
        vec3 col = vec3(0.0, inDrop * 0.6, inDrop * 0.2);
        col += vec3(0.6, 1.0, 0.7) * head;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  {
    name: "Nebula",
    description: "Deep space nebula clouds",
    fragment: `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v=0.0; float a=0.5;
        for(int i=0;i<6;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
        return v;
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 p = uv * 2.5;
        float t = u_time * 0.08;
        float n = fbm(p + fbm(p + fbm(p + t)));
        vec3 col = mix(vec3(0.0, 0.0, 0.05), vec3(0.4, 0.1, 0.6), n);
        col = mix(col, vec3(0.0, 0.5, 0.8), pow(n, 2.0));
        col = mix(col, vec3(1.0, 0.9, 0.5), pow(n, 5.0));
        col += vec3(0.0, 0.0, 0.1) * (1.0 - uv.y);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
];

interface ShaderCanvasProps {
  fragment: string;
  className?: string;
}

export function ShaderCanvas({ fragment, className }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;
    glRef.current = gl;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    programRef.current = prog;
    gl.useProgram(prog);

    const posLoc = gl.getAttribLocation(prog, "a_position");
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    startTimeRef.current = Date.now();

    const render = () => {
      const timeLoc = gl.getUniformLocation(prog, "u_time");
      const resLoc = gl.getUniformLocation(prog, "u_resolution");
      gl.uniform1f(timeLoc, (Date.now() - startTimeRef.current) / 1000);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteProgram(prog);
    };
  }, [fragment]);

  return <canvas ref={canvasRef} className={className} style={{ display: "block", width: "100%", height: "100%" }} />;
}
