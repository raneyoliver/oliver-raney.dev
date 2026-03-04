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

const SY = 0.37;
const SZ = 0.68;
const SW = 0.54;
const SH = 0.50;
const FONT = "/fonts/PressStart2P-Regular.ttf";

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
      <mesh position={[0, SY, SZ - 0.005]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={glowRef} position={[0, SY, SZ - 0.003]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
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

function Enter({ active, y }: { active: boolean; y?: number }) {
  if (!active) return null;
  return <Blink position={[0, y ?? SY - 0.18, SZ]} fontSize={0.028} color="#ffffff" rate={2}>PRESS ENTER</Blink>;
}

function AboutScreen({ color, active }: { color: string; active: boolean }) {
  return (
    <group>
      <Text position={[0, SY + 0.12, SZ]} fontSize={0.045} color={color} font={FONT} anchorX="center" anchorY="middle">PLAYER 1</Text>
      <Blink position={[0, SY + 0.03, SZ]} fontSize={0.055} color={color}>READY</Blink>
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
  const bars = [0.10, 0.15, 0.08, 0.13, 0.11];
  return (
    <group>
      <Text position={[0, SY + 0.15, SZ]} fontSize={0.04} color={color} font={FONT} anchorX="center" anchorY="middle">PORTFOLIO</Text>
      <group ref={grp}>
        {bars.map((h, i) => (
          <mesh key={i} position={[-0.15 + i * 0.075, SY - 0.02 + h / 2, SZ]}>
            <boxGeometry args={[0.05, h, 0.001]} />
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
      <Text position={[0, SY + 0.08, SZ]} fontSize={0.028} color={color} font={FONT} anchorX="center" anchorY="middle" maxWidth={SW * 0.9} lineHeight={2.2}>
        {"> LOADING XP...\n> SKILLS: ████░░\n> LVL: MAX"}
      </Text>
      <Text ref={cur} position={[0.18, SY - 0.06, SZ]} fontSize={0.035} color={color} font={FONT} anchorX="center" anchorY="middle">_</Text>
      <Enter active={active} />
    </group>
  );
}

function ContactScreen({ color, active }: { color: string; active: boolean }) {
  return (
    <group>
      <Text position={[0, SY + 0.10, SZ]} fontSize={0.08} color={color} font={FONT} anchorX="center" anchorY="middle">@</Text>
      <Blink position={[0, SY - 0.02, SZ]} fontSize={0.04} color={color}>SEND MSG</Blink>
      <Enter active={active} />
    </group>
  );
}

function BlogScreen({ color, active }: { color: string; active: boolean }) {
  const txt = useRef<THREE.Object3D>(null);
  useFrame(({ clock }) => {
    if (txt.current) { const t = (clock.elapsedTime * 0.03) % 1; txt.current.position.y = SY + 0.18 - t * 0.36; }
  });
  return (
    <group>
      <Text ref={txt} position={[0, SY + 0.08, SZ]} fontSize={0.025} color={color} font={FONT} anchorX="center" anchorY="middle" maxWidth={SW * 0.9} lineHeight={2.0}>
        {"> NEW POST\n> THOUGHTS.EXE\n> BLOG ACTIVE\n> STATUS: WRITING"}
      </Text>
      <Enter active={active} />
    </group>
  );
}

function SkillsScreen({ color, active }: { color: string; active: boolean }) {
  const skills = ["REACT", "THREE", "TS"];
  const widths = [0.38, 0.32, 0.28];
  return (
    <group>
      {skills.map((skill, i) => (
        <group key={skill}>
          <Text position={[-0.20, SY + 0.13 - i * 0.10, SZ]} fontSize={0.022} color={color} font={FONT} anchorX="left" anchorY="middle">{skill}</Text>
          <mesh position={[-0.20 + widths[i] / 2, SY + 0.08 - i * 0.10, SZ]}>
            <planeGeometry args={[widths[i], 0.03]} />
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
      <ScreenBackdrop color={config.color} isActive={isActive} />
      {config.id === "about" && <AboutScreen color={config.color} active={isActive} />}
      {config.id === "projects" && <ProjectsScreen color={config.color} active={isActive} />}
      {config.id === "resume" && <ResumeScreen color={config.color} active={isActive} />}
      {config.id === "contact" && <ContactScreen color={config.color} active={isActive} />}
      {config.id === "blog" && <BlogScreen color={config.color} active={isActive} />}
      {config.id === "skills" && <SkillsScreen color={config.color} active={isActive} />}
    </group>
  );
}
