import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import heroPoster from "@/assets/hero-poster.jpg";
import type { PortfolioData } from "@/components/portfolio-builder/types";

// Try a real cinematic autoplaying video; fallback to poster texture on error.
// MDN-hosted CORS-friendly sample; falls back gracefully if blocked.
const CINEMATIC_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uMouse;     // 0..1
  uniform vec2 uMouseVel;  // -1..1
  uniform float uTime;
  uniform float uAspectMedia;  // media aspect
  uniform float uAspectView;   // viewport aspect

  // classic Ashima simplex noise
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;
    vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }

  void main(){
    // cover-fit uv
    vec2 uv = vUv;
    float ra = uAspectView / uAspectMedia;
    if (ra > 1.0) {
      uv.y = (uv.y - 0.5) / ra + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * ra + 0.5;
    }

    vec2 m = uMouse;
    vec2 d = uv - m;
    float dist = length(d);

    // liquid ripples radiating from mouse
    float ripple = sin(dist * 40.0 - uTime * 3.0) * exp(-dist * 6.0) * 0.02;
    // ambient slow drift
    float n = snoise(uv * 3.0 + uTime * 0.15) * 0.008;
    vec2 offset = normalize(d + 0.0001) * ripple + vec2(n, -n);
    // velocity streak
    offset += uMouseVel * exp(-dist * 4.0) * 0.03;

    vec2 suv = uv + offset;

    // chromatic split near mouse
    float ca = exp(-dist * 5.0) * 0.006;
    float r = texture2D(uTex, suv + vec2(ca, 0.0)).r;
    float g = texture2D(uTex, suv).g;
    float b = texture2D(uTex, suv - vec2(ca, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // filmic contrast + vignette
    col = pow(col, vec3(1.05));
    float vig = smoothstep(1.1, 0.35, distance(vUv, vec2(0.5)));
    col *= vig;
    // subtle grain
    float grain = (fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function LiquidPlane({ tex, mediaAspect }: { tex: THREE.Texture; mediaAspect: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const lastMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const vel = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVel: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uAspectMedia: { value: mediaAspect },
      uAspectView: { value: size.width / size.height },
    }),
    [tex, mediaAspect, size.width, size.height],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseTarget.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    mouse.current.lerp(mouseTarget.current, Math.min(1, delta * 6));
    vel.current.set(
      (mouse.current.x - lastMouse.current.x) * 12,
      (mouse.current.y - lastMouse.current.y) * 12,
    );
    lastMouse.current.copy(mouse.current);
    if (matRef.current) {
      matRef.current.uniforms.uMouse.value.copy(mouse.current);
      matRef.current.uniforms.uMouseVel.value.lerp(vel.current, 0.2);
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uAspectView.value = size.width / size.height;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  );
}

function useHeroTexture() {
  const [state, setState] = useState<{ tex: THREE.Texture; aspect: number } | null>(null);

  useEffect(() => {
    let disposed = false;
    // Try video first
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.src = CINEMATIC_VIDEO;

    const useImage = () => {
      new THREE.TextureLoader().load(heroPoster, (t) => {
        if (disposed) return;
        t.colorSpace = THREE.SRGBColorSpace;
        const img = t.image as HTMLImageElement;
        setState({ tex: t, aspect: img.width / img.height });
      });
    };

    const onReady = () => {
      if (disposed) return;
      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setState({ tex, aspect: video.videoWidth / video.videoHeight || 16 / 9 });
    };

    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", useImage, { once: true });
    video.play().catch(() => {
      // still try loadeddata; if it never fires, image fallback via timeout
      setTimeout(() => {
        if (!disposed && !state) useImage();
      }, 2500);
    });

    return () => {
      disposed = true;
      video.pause();
      video.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

export function Hero({ data }: { data?: PortfolioData }) {
  const state = useHeroTexture();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#080808]">
      <div className="absolute inset-0">
        {state ? (
          <Canvas
            orthographic
            camera={{ position: [0, 0, 1], zoom: 1 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
          >
            <color attach="background" args={["#080808"]} />
            <LiquidPlane tex={state.tex} mediaAspect={state.aspect} />
          </Canvas>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url(${heroPoster})` }}
          />
        )}
      </div>

      {/* content overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-12 pb-32">
        <div className="mono mb-6 text-[11px] tracking-[0.4em] text-white/50">
          <span className="text-white/80">SCENE 01</span> — REEL 2026
        </div>
        <h1 className="max-w-5xl font-display text-6xl font-light leading-[0.95] tracking-tight text-white md:text-[9rem]">
          Light,
          <br />
          <span className="italic text-white/70">shadow,</span>
          <br />
          motion.
        </h1>
        <div className="mt-10 flex max-w-3xl items-end justify-between gap-8">
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            {data?.personalInfo?.role ?? "A cinematographer's"} field notebook — moving pictures, stills, and the space between
            frames. Move your cursor to disturb the surface.
          </p>
          <div className="mono text-[11px] tracking-[0.3em] text-white/40">
            SCROLL <span className="ml-2 text-white/80">↓</span>
          </div>
        </div>
      </div>

      {/* vignette + grain */}
      <div className="vignette pointer-events-none absolute inset-0 z-[6]" />
      <div className="grain pointer-events-none absolute inset-0 z-[7]" />
    </section>
  );
}
