import type { DesignSystemId, DetectedDesignSystem, ProjectSnapshot } from '../types';
import { mergedDeps } from './deps';
import { resolveMajor } from './semverMajor';

/**
 * Detect the design system in use. Order matters: shadcn's `components.json`
 * marker is canonical and beats a raw `radix-ui` dep (shadcn *is* Radix under
 * the hood), and MUI-X is flagged as its own id when an `@mui/x-*` package is
 * present. Returns null when none is found — the caller defaults to plain HTML.
 */
export function detectDesignSystem(snapshot: ProjectSnapshot): DetectedDesignSystem | null {
  const deps = mergedDeps(snapshot.packageJson);
  const majorOf = (name: string): number | null => resolveMajor(deps[name]).major;

  if (snapshot.hasComponentsJson) {
    return { id: 'shadcn', major: 1 };
  }

  const muiXKey = Object.keys(deps).find(name => name.startsWith('@mui/x-'));
  if (muiXKey) {
    return { id: 'mui-x', major: majorOf(muiXKey) };
  }

  const checks: ReadonlyArray<readonly [DesignSystemId, string]> = [
    ['mui', '@mui/material'],
    ['angular-material', '@angular/material'],
    ['primevue', 'primevue'],
    ['astryx', '@astryxdesign/core'],
  ];
  for (const [id, marker] of checks) {
    if (deps[marker] != null) return { id, major: majorOf(marker) };
  }

  if (deps['radix-ui'] != null || Object.keys(deps).some(name => name.startsWith('@radix-ui/'))) {
    return { id: 'radix', major: 1 };
  }

  return null;
}
