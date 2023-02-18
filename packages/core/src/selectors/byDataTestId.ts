export function byDataTestId(id: string | string[]): string {
  const ids = Array.isArray(id) ? id : [id];
  return ids.map((id) => `[data-testid="${id}"]`).join(' ');
}
