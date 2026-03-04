"use client";

export function NeonLighting() {
  return (
    <>
      <ambientLight intensity={0.15} color="#1a0033" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#FF00FF" distance={15} decay={2} />
      <pointLight position={[0, -2, 0]} intensity={0.3} color="#00FFFF" distance={10} decay={2} />
    </>
  );
}
