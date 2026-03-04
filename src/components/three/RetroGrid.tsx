"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function RetroGrid() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#FF00FF") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          uv.y = uv.y + uTime * 0.03;

          float gridX = smoothstep(0.0, 0.03, abs(fract(uv.x * 20.0) - 0.5));
          float gridY = smoothstep(0.0, 0.03, abs(fract(uv.y * 20.0) - 0.5));
          float grid = 1.0 - min(gridX, gridY);

          float fade = smoothstep(0.0, 0.5, vUv.y) * (1.0 - smoothstep(0.5, 1.0, vUv.y));
          float distFade = 1.0 - smoothstep(0.3, 0.5, abs(vUv.x - 0.5));

          float alpha = grid * fade * distFade * 0.4;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    }),
    []
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[30, 30, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        {...shader}
      />
    </mesh>
  );
}
