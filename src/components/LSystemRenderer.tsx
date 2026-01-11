import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import type { LineSegment } from '../types/lsystem';

interface LSystemRendererProps {
  segments: LineSegment[];
  color: string;
}

export function LSystemRenderer({ segments, color }: LSystemRendererProps) {
  const { points, center } = useMemo(() => {
    if (segments.length === 0) {
      return { points: [], center: new Vector3(0, 0, 0) };
    }

    // Calculate bounding box to center the geometry
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;

    for (const seg of segments) {
      minX = Math.min(minX, seg.start.x, seg.end.x);
      minY = Math.min(minY, seg.start.y, seg.end.y);
      minZ = Math.min(minZ, seg.start.z, seg.end.z);
      maxX = Math.max(maxX, seg.start.x, seg.end.x);
      maxY = Math.max(maxY, seg.start.y, seg.end.y);
      maxZ = Math.max(maxZ, seg.start.z, seg.end.z);
    }

    const centerVec = new Vector3(
      (minX + maxX) / 2,
      (minY + maxY) / 2,
      (minZ + maxZ) / 2
    );

    return { points: segments, center: centerVec };
  }, [segments]);

  if (points.length === 0) {
    return null;
  }

  return (
    <group position={[-center.x, -center.y, -center.z]}>
      {points.map((segment, index) => (
        <Line
          key={index}
          points={[segment.start, segment.end]}
          color={color}
          lineWidth={2}
        />
      ))}
    </group>
  );
}
