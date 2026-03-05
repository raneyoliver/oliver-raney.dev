"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { CabinetConfig } from "@/lib/cabinets";
import { AboutContent } from "@/components/content/AboutContent";
import { ProjectsContent } from "@/components/content/ProjectsContent";
import { ResumeContent } from "@/components/content/ResumeContent";
import { ContactContent } from "@/components/content/ContactContent";
import { BlogContent } from "@/components/content/BlogContent";
import { SkillsContent } from "@/components/content/SkillsContent";

interface CabinetScreenProps {
  config: CabinetConfig;
  isActive: boolean;
}

const CABINET_PX_WIDTH = 360;
const CABINET_PX_HEIGHT = 280;

const SCREEN_POS: [number, number, number] = [0, 0.64, -.11];
const SCREEN_TILT = -0.254;
const SW = 1.005;
const SH = 1.096;

const MARQUEE_POS: [number, number, number] = [0, 1.22, 0.094];
const MARQUEE_TILT = -0.203;
const MW = 1;
const MH = 0.245;

const FONT = "/fonts/PressStart2P-Regular.ttf";

const CONTROLS_POS: [number, number, number] = [0, 0.057, .05];
const CONTROLS_TILT = -1.404;
const CW = 1;
const CH = 0.9;

// Drei Html transform mode uses factor = 400 / (distanceFactor || 10) = 40.
// A CSS pixel maps to (groupScale / factor) world units.
// For W pixels to span SW world units: scale = SW * factor / W
const DREI_FACTOR = 40;
const HTML_PX_W = 360;
const HTML_PX_H = Math.round(HTML_PX_W * SH / SW);
const HTML_SCALE = (SW * DREI_FACTOR) / HTML_PX_W;

function ScreenBackdrop({ color, isActive }: { color: string; isActive: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.08 + Math.sin(clock.elapsedTime * 2) * 0.04;
      mat.opacity = isActive ? pulse * 2.5 : pulse;
    }
  });

  return (
    <group>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, -0.003]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function MarqueeBackdrop({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[MW, MH]} />
        <meshBasicMaterial color="#050008" />
      </mesh>
      <mesh position={[0, 0, -0.003]}>
        <planeGeometry args={[MW, MH]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function ControlsBackdrop({ color }: { color: string }) {
  const texture = useTexture("/control.webp");
  return (
    <group>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[CW, CH]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.003]}>
        <planeGeometry args={[CW, CH]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function ScreenContent({ config }: { config: CabinetConfig }) {
  const contentMap: Record<string, React.ReactNode> = {
    about: <AboutContent color={config.color} />,
    projects: <ProjectsContent color={config.color} />,
    resume: <ResumeContent color={config.color} />,
    contact: <ContactContent color={config.color} />,
    blog: <BlogContent color={config.color} />,
    skills: <SkillsContent color={config.color} />,
  };

  return (
    <Html
      transform
      position={[0, -0.16, 0]}
      scale={HTML_SCALE}
      center
      occlude
      zIndexRange={[0, 0]}
    >
      <div
        style={{
          position: "relative",
          width: CABINET_PX_WIDTH,
          height: CABINET_PX_HEIGHT,
          overflow: "hidden",
          background: "#0a0014",
          color: "#ededed",
          padding: "12px",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      >
        {contentMap[config.id]}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
            zIndex: 10,
          }}
        />
      </div>
    </Html>
  );
}

export function CabinetScreen({ config, isActive }: CabinetScreenProps) {
  return (
    <group>
      <group position={SCREEN_POS} rotation={[SCREEN_TILT, 0, 0]}>
        <ScreenBackdrop color={config.color} isActive={isActive} />
        <ScreenContent config={config} />
      </group>

      <group position={MARQUEE_POS} rotation={[MARQUEE_TILT, 0, 0]}>
        <MarqueeBackdrop color={config.color} />
        <Text
          position={[0, 0, 0]}
          fontSize={0.045}
          color={config.color}
          font={FONT}
          anchorX="center"
          anchorY="middle"
          maxWidth={MW * 0.9}
        >
          {config.title}
        </Text>
      </group>

      <group position={CONTROLS_POS} rotation={[CONTROLS_TILT, 0, 0]}>
        <ControlsBackdrop color={config.color} />
      </group>
    </group>
  );
}
