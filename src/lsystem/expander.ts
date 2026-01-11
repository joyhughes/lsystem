import type { Rule } from '../types/lsystem';

export function expandLSystem(
  axiom: string,
  rules: Rule[],
  iterations: number
): string {
  let current = axiom;

  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const char of current) {
      const rule = rules.find((r) => r.predecessor === char);
      next += rule ? rule.successor : char;
    }
    current = next;
  }

  return current;
}
