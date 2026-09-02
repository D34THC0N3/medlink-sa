"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

type Props = {
  /** scale of the heart relative to viewport */
  scale?: number;
  /** show the orbiting particle field */
  particles?: boolean;
  /** className for sizing the canvas wrapper */
  className?: string;
  /** auto-rotate speed */
  rotateSpeed?: number;
};

/**
 * HeartCanvas — a procedural 3D heart rendered with Three.js.
 * Uses an extruded heart silhouette + a custom fresnel/gradient ShaderMaterial
 * with a heartbeat pulse, a drifting particle field, and mouse parallax.
 *
 * Designed to be resilient: handles resize, WebGL context loss, and
 * prefers-reduced-motion (disables rotation + pulse).
 */
export default function HeartCanvas({
  scale = 1,
  particles = true,
  className,
  rotateSpeed = 0.35,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---- renderer ----
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---- scene + camera ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, 6.2);

    // ---- heart geometry ----
    const heartShape = new THREE.Shape();
    const x = 0,
      y = 0;
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(
      x - 0.6,
      y + 1.1,
      x - 0.3,
      y + 1.54,
      x + 0.5,
      y + 1.9
    );
    heartShape.bezierCurveTo(
      x + 1.2,
      y + 1.54,
      x + 1.6,
      y + 1.1,
      x + 1.6,
      y + 0.7
    );
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 18,
      bevelSize: 0.32,
      bevelThickness: 0.32,
      curveSegments: 48,
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();
    heartGeo.computeVertexNormals();

    // ---- heart shader material ----
    const uniforms = {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uColorCore: { value: new THREE.Color("#1e3a8a") },
      uColorMid: { value: new THREE.Color("#2563eb") },
      uColorRim: { value: new THREE.Color("#67e8f9") },
      uFresnelPower: { value: 2.4 },
    };

    const heartMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPos;
        uniform float uTime;
        uniform float uPulse;
        void main() {
          vec3 pos = position;
          // subtle breathing displacement along normal
          float breathe = uPulse * 0.06;
          pos += normal * breathe;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mv.xyz);
          vPos = pos;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPos;
        uniform float uTime;
        uniform float uPulse;
        uniform vec3 uColorCore;
        uniform vec3 uColorMid;
        uniform vec3 uColorRim;
        uniform float uFresnelPower;
        void main() {
          float fres = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uFresnelPower);
          // depth-based gradient
          float depth = clamp((vPos.z + 1.0) * 0.5, 0.0, 1.0);
          vec3 base = mix(uColorCore, uColorMid, depth);
          base = mix(base, uColorRim, fres);
          // iridescent shimmer along x
          float shimmer = 0.08 * sin(vPos.x * 6.0 + uTime * 1.5);
          base += shimmer * vec3(0.2, 0.5, 0.7);
          // pulse glow boost
          float glow = 0.5 + 0.5 * uPulse;
          vec3 col = base * (0.55 + 0.45 * glow);
          // rim light add
          col += uColorRim * fres * (0.5 + 0.5 * glow);
          float alpha = 0.78 + 0.22 * fres;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const heart = new THREE.Mesh(heartGeo, heartMat);
    // heart points down by default; tilt forward slightly
    heart.rotation.z = Math.PI; // point down (classic heart)
    const s = 0.9 * scale;
    heart.scale.setScalar(s);
    scene.add(heart);

    // ---- inner glow orb (fake subsurface bounce) ----
    const glowGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPulse: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV;
        void main(){
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV;
        uniform float uPulse;
        void main(){
          float f = pow(1.0 - max(dot(vN,vV),0.0), 3.0);
          vec3 c = mix(vec3(0.15,0.4,1.0), vec3(0.4,0.9,1.0), f);
          float a = (0.35 + 0.4*uPulse) * f;
          gl_FragColor = vec4(c, a);
        }
      `,
    });
    const glowOrb = new THREE.Mesh(glowGeo, glowMat);
    glowOrb.scale.setScalar(s * 1.1);
    heart.add(glowOrb);

    // ---- particle field ----
    let points: THREE.Points | null = null;
    if (particles) {
      const count = reduce ? 220 : 700;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const r = 2.4 + Math.random() * 3.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        sizes[i] = Math.random() * 1.6 + 0.4;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      const pMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#7dd3fc") },
        },
        vertexShader: /* glsl */ `
          attribute float aSize;
          uniform float uTime;
          varying float vA;
          void main(){
            vec3 p = position;
            float t = uTime * 0.15;
            p.x += sin(t + position.y * 0.8) * 0.15;
            p.y += cos(t + position.z * 0.6) * 0.15;
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            gl_PointSize = aSize * (200.0 / -mv.z);
            vA = 0.5 + 0.5 * sin(uTime * 0.8 + position.x * 3.0);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vA;
          uniform vec3 uColor;
          void main(){
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float a = smoothstep(0.5, 0.0, d) * vA * 0.7;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      });
      points = new THREE.Points(pGeo, pMat);
      scene.add(points);
    }

    // ---- mouse parallax ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove);

    // ---- resize ----
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ---- context loss ----
    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    // ---- animation loop ----
    const clock = new THREE.Clock();
    let rafId = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      // heartbeat: double-thump envelope, period ~1.1s
      const beat =
        0.5 +
        0.5 *
          (Math.max(
            0,
            Math.sin(t * 5.7) ** 8 * 0.6 +
              Math.sin(t * 5.7 - 0.45) ** 16 * 0.55
          ) -
            0.2);

      uniforms.uTime.value = t;
      uniforms.uPulse.value = reduce ? 0.2 : beat;
      (glowMat.uniforms.uTime as { value: number }).value = t;
      (glowMat.uniforms.uPulse as { value: number }).value = reduce
        ? 0.2
        : beat;
      if (points) {
        (points.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
        if (!reduce) points.rotation.y = t * 0.04;
      }

      // parallax easing
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      scene.rotation.y = mouse.x * 0.35 + (!reduce ? t * rotateSpeed * 0.0 : 0);
      scene.rotation.x = mouse.y * -0.25;
      if (!reduce) heart.rotation.y += 0.004;
      // gentle self-tilt
      heart.rotation.x = Math.sin(t * 0.4) * 0.08 + mouse.y * 0.05;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost
      );
      ro.disconnect();
      renderer.dispose();
      heartGeo.dispose();
      heartMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      if (points) {
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
      }
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [scale, particles, rotateSpeed]);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
