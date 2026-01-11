import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { LSystemRenderer } from './LSystemRenderer';
import type { LineSegment } from '../types/lsystem';

interface Canvas3DProps {
  segments: LineSegment[];
  color: string;
}

export function Canvas3D({ segments, color }: Canvas3DProps) {
  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <color attach="background" args={['#0f0f1a']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <LSystemRenderer segments={segments} color={color} />

      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <gridHelper args={[20, 20, '#333', '#222']} />
    </Canvas>
  );
}
