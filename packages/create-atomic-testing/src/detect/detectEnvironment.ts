import type { ProjectSnapshot } from '../types';
import { mergedDeps } from './deps';

/** TypeScript is in play if it's a dependency or a tsconfig is present. */
export function detectTypeScript(snapshot: ProjectSnapshot): boolean {
  return mergedDeps(snapshot.packageJson)['typescript'] != null || snapshot.hasTsConfig;
}

/** A monorepo is signalled by a workspace marker file or a `workspaces` field. */
export function detectMonorepo(snapshot: ProjectSnapshot): boolean {
  if (snapshot.workspaceMarkers.length > 0) return true;
  const ws = snapshot.packageJson?.workspaces;
  if (Array.isArray(ws)) return ws.length > 0;
  if (ws && typeof ws === 'object') return (ws.packages?.length ?? 0) > 0;
  return false;
}
