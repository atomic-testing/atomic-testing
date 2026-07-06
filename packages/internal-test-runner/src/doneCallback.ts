/**
 * Extract the Jest-style `done` callback from a lifecycle hook's first
 * argument, if that is what it is.
 *
 * The runners disagree about what a hook receives: Jest passes a bare `done`
 * function, Playwright passes a fixture object — and Vitest passes a
 * `TestContext` that is ALSO callable (invoking it throws "done() callback is
 * deprecated"). A plain `typeof === 'function'` check therefore misfires under
 * Vitest; a function only counts as `done` when it lacks the Vitest context's
 * `task` property.
 */
export function getDoneCallback(candidate: unknown): (() => void) | undefined {
  return typeof candidate === 'function' && !('task' in candidate) ? (candidate as () => void) : undefined;
}
