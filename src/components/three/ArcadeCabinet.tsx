"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { CabinetConfig } from "@/lib/cabinets";
import { CabinetScreen } from "./CabinetScreen";

interface ArcadeCabinetProps {
  config: CabinetConfig;
  isActive: boolean;
  onClick: () => void;
}

const BODY_WIDTH = 1.2;
const BODY_DEPTH = 0.8;
const BODY_HEIGHT = 2.2;
const SCREEN_WIDTH = 0.9;
const SCREEN_HEIGHT = 0.7;
const MARQUEE_HEIGHT = 0.3;

export function ArcadeCabinet({ config, isActive, onClick }: ArcadeCabinetProps) {
  const screenRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  const cabinetColor = useMemo(() => new THREE.Color("#1a1a2e"), []);
  const trimColor = useMemo(() => new THREE.Color("#16213e"), []);
  const accentColor = useMemo(() => new THREE.Color(config.color), [config.color]);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const flicker = 0.8 + Math.sin(clock.elapsedTime * 3 + Math.random() * 0.5) * 0.2;
      glowRef.current.intensity = isActive ? flicker * 1.5 : flicker * 0.6;
    }
  });

  const cabinetShape = useMemo(() => {
    const shape = new THREE.Shape();
    const halfW = BODY_WIDTH / 2;
    const taperOffset = 0.08;
    shape.moveTo(-halfW + taperOffset, 0);
    shape.lineTo(halfW - taperOffset, 0);
    shape.lineTo(halfW, BODY_HEIGHT);
    shape.lineTo(-halfW, BODY_HEIGHT);
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: BODY_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    }),
    []
  );

  return (
    <group onClick={onClick}>
      <mesh position={[0, -BODY_HEIGHT / 2, -BODY_DEPTH / 2]}>
        <extrudeGeometry args={[cabinetShape, extrudeSettings]} />
        <meshStandardMaterial color={cabinetColor} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Side trim strips */}
      <mesh position={[-BODY_WIDTH / 2 - 0.01, 0, 0]}>
        <boxGeometry args={[0.03, BODY_HEIGHT, BODY_DEPTH * 0.9]} />
        <meshStandardMaterial color={trimColor} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[BODY_WIDTH / 2 + 0.01, 0, 0]}>
        <boxGeometry args={[0.03, BODY_HEIGHT, BODY_DEPTH * 0.9]} />
        <meshStandardMaterial color={trimColor} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Marquee (top) */}
      <mesh position={[0, BODY_HEIGHT / 2 - MARQUEE_HEIGHT / 2 - 0.05, BODY_DEPTH / 2 + 0.01]}>
        <planeGeometry args={[SCREEN_WIDTH + 0.1, MARQUEE_HEIGHT]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={isActive ? 1.2 : 0.4}
          roughness={0.1}
        />
      </mesh>
      <Text
        position={[0, BODY_HEIGHT / 2 - MARQUEE_HEIGHT / 2 - 0.05, BODY_DEPTH / 2 + 0.02]}
        fontSize={0.08}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/PressStart2P-Regular.ttf"
        maxWidth={SCREEN_WIDTH}
      >
        {config.title}
      </Text>

      {/* Screen */}
      <mesh
        ref={screenRef}
        position={[0, 0.15, BODY_DEPTH / 2 + 0.01]}
      >
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshStandardMaterial
          color="#000811"
          emissive={accentColor}
          emissiveIntensity={isActive ? 0.15 : 0.05}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Screen border */}
      <mesh position={[0, 0.15, BODY_DEPTH / 2 + 0.005]}>
        <planeGeometry args={[SCREEN_WIDTH + 0.06, SCREEN_HEIGHT + 0.06]} />
        <meshStandardMaterial color={trimColor} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Screen attract mode content */}
      <CabinetScreen config={config} isActive={isActive} />

      {/* Control panel (angled) */}
      <mesh
        position={[0, -0.45, BODY_DEPTH / 2 + 0.08]}
        rotation={[-0.4, 0, 0]}
      >
        <boxGeometry args={[SCREEN_WIDTH + 0.1, 0.35, 0.08]} />
        <meshStandardMaterial color={trimColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Joystick */}
      <group position={[-0.15, -0.32, BODY_DEPTH / 2 + 0.16]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.025, 0.12, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#ff0000" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>

      {/* Buttons */}
      {[0.08, 0.18, 0.28].map((xOff, i) => (
        <mesh
          key={i}
          position={[xOff, -0.33, BODY_DEPTH / 2 + 0.16]}
          rotation={[-0.4, 0, 0]}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial
            color={["#ff0000", "#00ff00", "#0088ff"][i]}
            emissive={new THREE.Color(["#ff0000", "#00ff00", "#0088ff"][i])}
            emissiveIntensity={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Cabinet screen glow light */}
      <pointLight
        ref={glowRef}
        position={[0, 0.15, BODY_DEPTH / 2 + 0.5]}
        color={config.color}
        intensity={0.8}
        distance={3}
        decay={2}
      />
    </group>
  );
}
