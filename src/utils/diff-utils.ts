// utils/diff.util.ts
export function getChangedFields(
  previous: Record<string, any>,
  updated: Record<string, any>,
): { from: Record<string, any>; to: Record<string, any> } {
  const from: Record<string, any> = {};
  const to: Record<string, any> = {};

  for (const key of Object.keys(updated)) {
    if (previous[key] !== updated[key]) {
      from[key] = previous[key];
      to[key] = updated[key];
    }
  }

  return { from, to };
}
