"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { CabinetConfig } from "@/lib/cabinets";

interface CabinetScreenProps {
  config: CabinetConfig;
  isActive: boolean;
}

// Screen surface: position, dimensions, and tilt (radians, negative = top tilts backward)
const SCREEN_POS: [number, number, number] = [0, 0.64, -.11];
const SCREEN_TILT = -0.254;
const SW = 1.01;
const SH = 1.096;

// Marquee surface: position, dimensions, and tilt
const MARQUEE_POS: [number, number, number] = [0, 1.22, 0.094];
const MARQUEE_TILT = -0.203;
const MW = 1;
const MH = 0.245;

const FONT = "/fonts/PressStart2P-Regular.ttf";

// Controls surface: position, dimensions, and tilt
const CONTROLS_POS: [number, number, number] =  [0, 0.64, -.11];
const CONTROLS_TILT = -0.254;
const CW = 1.01;
const CH = 1.096;

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

function Blink({ children, position, fontSize, color, rate = 3 }: {
  children: string; position: [number, number, number]; fontSize: number; color: string; rate?: number;
}) {
  const ref = useRef<THREE.Object3D>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.visible = Math.sin(clock.elapsedTime * rate) > 0; });
  return <Text ref={ref} position={position} fontSize={fontSize} color={color} font={FONT} anchorX="center" anchorY="middle" maxWidth={SW * 0.9}>{children}</Text>;
}

function Enter({ active }: { active: boolean }) {
  if (!active) return null;
  return <Blink position={[0, -SH * 0.42, 0]} fontSize={0.022} color="#ffffff" rate={2}>PRESS ENTER</Blink>;
}

function AboutScreen({ color, active }: { color: string; active: boolean }) {
  return (
    <group>
      <Text position={[0, 0.08, 0]} fontSize={0.035} color={color} font={FONT} anchorX="center" anchorY="middle">PLAYER 1</Text>
      <Blink position={[0, 0.01, 0]} fontSize={0.045} color={color}>READY</Blink>
      <Enter active={active} />
    </group>
  );
}

function ProjectsScreen({ color, active }: { color: string; active: boolean }) {
  const grp = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (grp.current && active) {
      grp.current.children.forEach((c, i) => {
        if (c instanceof THREE.Mesh) c.scale.setY(0.7 + Math.sin(clock.elapsedTime * 2 + i * 0.8) * 0.3);
      });
    }
  });
  const bars = [0.08, 0.12, 0.06, 0.10, 0.09];
  return (
    <group>
      <Text position={[0, 0.10, 0]} fontSize={0.032} color={color} font={FONT} anchorX="center" anchorY="middle">PORTFOLIO</Text>
      <group ref={grp}>
        {bars.map((h, i) => (
          <mesh key={i} position={[-0.12 + i * 0.06, -0.02 + h / 2, 0]}>
            <boxGeometry args={[0.04, h, 0.001]} />
            <meshBasicMaterial color={color} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
      <Enter active={active} />
    </group>
  );
}

function ResumeScreen({ color, active }: { color: string; active: boolean }) {
  const cur = useRef<THREE.Object3D>(null);
  useFrame(({ clock }) => { if (cur.current) cur.current.visible = Math.sin(clock.elapsedTime * 4) > 0; });
  return (
    <group>
      <Text position={[0, 0.06, 0]} fontSize={0.022} color={color} font={FONT} anchorX="center" anchorY="middle" maxWidth={SW * 0.9} lineHeight={2.2}>
        {"> LOADING XP...\n> SKILLS: ████░░\n> LVL: MAX"}
      </Text>
      <Text ref={cur} position={[0.14, -0.05, 0]} fontSize={0.028} color={color} font={FONT} anchorX="center" anchorY="middle">_</Text>
      <Enter active={active} />
    </group>
  );
}

function ContactScreen({ color, active }: { color: string; active: boolean }) {
  return (
    <group>
      <Text position={[0, 0.06, 0]} fontSize={0.065} color={color} font={FONT} anchorX="center" anchorY="middle">@</Text>
      <Blink position={[0, -0.04, 0]} fontSize={0.032} color={color}>SEND MSG</Blink>
      <Enter active={active} />
    </group>
  );
}

function BlogScreen({ color, active }: { color: string; active: boolean }) {
  const txt = useRef<THREE.Object3D>(null);
  useFrame(({ clock }) => {
    if (txt.current) { const t = (clock.elapsedTime * 0.03) % 1; txt.current.position.y = 0.12 - t * 0.28; }
  });
  return (
    <group>
      <Text ref={txt} position={[0, 0.06, 0]} fontSize={0.020} color={color} font={FONT} anchorX="center" anchorY="middle" maxWidth={SW * 0.9} lineHeight={2.0}>
        {"> NEW POST\n> THOUGHTS.EXE\n> BLOG ACTIVE\n> STATUS: WRITING"}
      </Text>
      <Enter active={active} />
    </group>
  );
}

function SkillsScreen({ color, active }: { color: string; active: boolean }) {
  const skills = ["REACT", "THREE", "TS"];
  const widths = [0.30, 0.26, 0.22];
  return (
    <group>
      {skills.map((skill, i) => (
        <group key={skill}>
          <Text position={[-0.16, 0.10 - i * 0.08, 0]} fontSize={0.018} color={color} font={FONT} anchorX="left" anchorY="middle">{skill}</Text>
          <mesh position={[-0.16 + widths[i] / 2, 0.06 - i * 0.08, 0]}>
            <planeGeometry args={[widths[i], 0.025]} />
            <meshBasicMaterial color={color} transparent opacity={0.75} />
          </mesh>
        </group>
      ))}
      <Enter active={active} />
    </group>
  );
}

export function CabinetScreen({ config, isActive }: CabinetScreenProps) {
  return (
    <group>
      {/* Screen overlay - positioned and tilted to match the cabinet's CRT surface */}
      <group position={SCREEN_POS} rotation={[SCREEN_TILT, 0, 0]}>
        <ScreenBackdrop color={config.color} isActive={isActive} />
        {config.id === "about" && <AboutScreen color={config.color} active={isActive} />}
        {config.id === "projects" && <ProjectsScreen color={config.color} active={isActive} />}
        {config.id === "resume" && <ResumeScreen color={config.color} active={isActive} />}
        {config.id === "contact" && <ContactScreen color={config.color} active={isActive} />}
        {config.id === "blog" && <BlogScreen color={config.color} active={isActive} />}
        {config.id === "skills" && <SkillsScreen color={config.color} active={isActive} />}
      </group>

      {/* Marquee overlay - positioned and tilted to match the cabinet's marquee panel */}
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
    </group>
  );
}
