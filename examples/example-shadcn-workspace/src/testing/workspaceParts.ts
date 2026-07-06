import { byDataTestId, ScenePart } from '@atomic-testing/core';

import { AppDataTestId } from '../AppDataTestId';
import { WorkspaceDriver } from './WorkspaceDriver';

/**
 * The single scene map shared by the DOM and E2E specs. Both resolve the whole
 * app through one `WorkspaceDriver`, anchored on the root testid — this is the
 * dedup story: the parts + composed drivers are imported by both runners
 * unchanged; only the engine (React vs. Playwright) differs.
 */
export const workspaceParts = {
  workspace: { locator: byDataTestId(AppDataTestId.root), driver: WorkspaceDriver },
} satisfies ScenePart;
