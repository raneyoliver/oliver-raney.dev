"use client";

export function NeonLighting() {
  return (
    <>
      <ambientLight intensity={1.4} color="#e0d0ff" />
      <hemisphereLight
        args={["#aa66ee", "#1a0033", 1.0]}
        position={[0, 10, 0]}
      />
      <directionalLight
        position={[0, 5, 6]}
        intensity={1.5}
        color="#ffffff"
      />
      <directionalLight
        position={[3, 3, 3]}
        intensity={0.5}
        color="#ddccff"
      />
      <directionalLight
        position={[-3, 3, 3]}
        intensity={0.5}
        color="#ddccff"
      />
      <pointLight position={[0, 6, 0]} intensity={2.0} color="#FF00FF" distance={25} decay={2} />
      <pointLight position={[0, 0, 0]} intensity={0.6} color="#00FFFF" distance={10} decay={2} />
    </>
  );
}
