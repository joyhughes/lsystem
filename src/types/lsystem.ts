import { Vector3 } from 'three';

export interface Rule {
  predecessor: string;
  successor: string;
}

export interface LSystemConfig {
  axiom: string;
  rules: Rule[];
  iterations: number;
  angle: number; // degrees
  stepLength: number;
  color: string;
}

export interface TurtleState {
  position: Vector3;
  heading: Vector3;
  up: Vector3;
  right: Vector3;
}

export interface LineSegment {
  start: Vector3;
  end: Vector3;
}

export const DEFAULT_CONFIG: LSystemConfig = {
  axiom: 'A',
  rules: [
    { predecessor: 'A', successor: 'F[+A]F[-A][^A][&A]' },
    { predecessor: 'F', successor: 'FF' },
  ],
  iterations: 4,
  angle: 25,
  stepLength: 0.5,
  color: '#4ade80',
};
