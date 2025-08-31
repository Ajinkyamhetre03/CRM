// components/Tech3DIcon.jsx
import { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

// Floating 3D Box Component
const FloatingBox = () => (
  <Float speed={2} rotationIntensity={1} floatIntensity={2}>
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3B82F6" />
    </mesh>
  </Float>
);

const Tech3DIcon = () => (
  <div className="h-32 w-32">
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <FloatingBox />
      </Suspense>
    </Canvas>
  </div>
);

export default Tech3DIcon;
