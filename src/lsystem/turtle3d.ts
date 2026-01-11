import { Vector3, Quaternion } from 'three';
import type { LineSegment, TurtleState } from '../types/lsystem';

function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function cloneTurtleState(state: TurtleState): TurtleState {
  return {
    position: state.position.clone(),
    heading: state.heading.clone(),
    up: state.up.clone(),
    right: state.right.clone(),
  };
}

function rotateVector(vec: Vector3, axis: Vector3, angleDeg: number): Vector3 {
  const quaternion = new Quaternion();
  quaternion.setFromAxisAngle(axis.clone().normalize(), degToRad(angleDeg));
  return vec.clone().applyQuaternion(quaternion);
}

// Simple seeded PRNG (mulberry32)
function createRng(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface TurtleParams {
  angle: number;
  stepLength: number;
  lengthRandomness: number;
  angleRandomness: number;
  seed: number;
}

export function interpretLSystem(
  lstring: string,
  params: TurtleParams
): LineSegment[] {
  const { angle, stepLength, lengthRandomness, angleRandomness, seed } = params;
  const random = createRng(seed);
  const segments: LineSegment[] = [];
  const stack: TurtleState[] = [];

  let state: TurtleState = {
    position: new Vector3(0, 0, 0),
    heading: new Vector3(0, 1, 0), // Y-up
    up: new Vector3(0, 0, -1),
    right: new Vector3(1, 0, 0),
  };

  // Helper to get randomized values
  const getLength = () => {
    const variation = (random() - 0.5) * 2 * lengthRandomness;
    return stepLength * (1 + variation);
  };

  const getAngle = (baseAngle: number) => {
    const variation = (random() - 0.5) * 2 * angleRandomness;
    return baseAngle * (1 + variation);
  };

  for (const char of lstring) {
    switch (char) {
      case 'F': {
        // Move forward and draw
        const start = state.position.clone();
        const len = getLength();
        state.position = state.position
          .clone()
          .add(state.heading.clone().multiplyScalar(len));
        segments.push({ start, end: state.position.clone() });
        break;
      }
      case 'f': {
        // Move forward without drawing
        const len = getLength();
        state.position = state.position
          .clone()
          .add(state.heading.clone().multiplyScalar(len));
        break;
      }
      case '+': {
        // Yaw left (turn left around up axis)
        const a = getAngle(angle);
        state.heading = rotateVector(state.heading, state.up, a);
        state.right = rotateVector(state.right, state.up, a);
        break;
      }
      case '-': {
        // Yaw right (turn right around up axis)
        const a = getAngle(angle);
        state.heading = rotateVector(state.heading, state.up, -a);
        state.right = rotateVector(state.right, state.up, -a);
        break;
      }
      case '^': {
        // Pitch up (rotate around right axis)
        const a = getAngle(angle);
        state.heading = rotateVector(state.heading, state.right, a);
        state.up = rotateVector(state.up, state.right, a);
        break;
      }
      case '&': {
        // Pitch down (rotate around right axis)
        const a = getAngle(angle);
        state.heading = rotateVector(state.heading, state.right, -a);
        state.up = rotateVector(state.up, state.right, -a);
        break;
      }
      case '\\': {
        // Roll left (rotate around heading axis)
        const a = getAngle(angle);
        state.up = rotateVector(state.up, state.heading, a);
        state.right = rotateVector(state.right, state.heading, a);
        break;
      }
      case '/': {
        // Roll right (rotate around heading axis)
        const a = getAngle(angle);
        state.up = rotateVector(state.up, state.heading, -a);
        state.right = rotateVector(state.right, state.heading, -a);
        break;
      }
      case '[': {
        // Push state
        stack.push(cloneTurtleState(state));
        break;
      }
      case ']': {
        // Pop state
        const popped = stack.pop();
        if (popped) {
          state = popped;
        }
        break;
      }
      default:
        // Ignore unknown characters
        break;
    }
  }

  return segments;
}
