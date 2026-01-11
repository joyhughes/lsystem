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

export function interpretLSystem(
  lstring: string,
  angle: number,
  stepLength: number
): LineSegment[] {
  const segments: LineSegment[] = [];
  const stack: TurtleState[] = [];

  let state: TurtleState = {
    position: new Vector3(0, 0, 0),
    heading: new Vector3(0, 1, 0), // Y-up
    up: new Vector3(0, 0, -1),
    right: new Vector3(1, 0, 0),
  };

  for (const char of lstring) {
    switch (char) {
      case 'F': {
        // Move forward and draw
        const start = state.position.clone();
        state.position = state.position
          .clone()
          .add(state.heading.clone().multiplyScalar(stepLength));
        segments.push({ start, end: state.position.clone() });
        break;
      }
      case 'f': {
        // Move forward without drawing
        state.position = state.position
          .clone()
          .add(state.heading.clone().multiplyScalar(stepLength));
        break;
      }
      case '+': {
        // Yaw left (turn left around up axis)
        state.heading = rotateVector(state.heading, state.up, angle);
        state.right = rotateVector(state.right, state.up, angle);
        break;
      }
      case '-': {
        // Yaw right (turn right around up axis)
        state.heading = rotateVector(state.heading, state.up, -angle);
        state.right = rotateVector(state.right, state.up, -angle);
        break;
      }
      case '^': {
        // Pitch up (rotate around right axis)
        state.heading = rotateVector(state.heading, state.right, angle);
        state.up = rotateVector(state.up, state.right, angle);
        break;
      }
      case '&': {
        // Pitch down (rotate around right axis)
        state.heading = rotateVector(state.heading, state.right, -angle);
        state.up = rotateVector(state.up, state.right, -angle);
        break;
      }
      case '\\': {
        // Roll left (rotate around heading axis)
        state.up = rotateVector(state.up, state.heading, angle);
        state.right = rotateVector(state.right, state.heading, angle);
        break;
      }
      case '/': {
        // Roll right (rotate around heading axis)
        state.up = rotateVector(state.up, state.heading, -angle);
        state.right = rotateVector(state.right, state.heading, -angle);
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
