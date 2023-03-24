export function escapeName(name: string): string {
  return encodeURIComponent(name);
}

export function escapeValue(value: string): string {
  return encodeURIComponent(value);
}

export function escapeCssClassName(name: string): string {
  return name;
}
