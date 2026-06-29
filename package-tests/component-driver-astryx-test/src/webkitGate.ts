import { TestFrameworkMapper } from '@atomic-testing/internal-test-runner';

/**
 * Capture the Playwright `browserName` for the current test into a getter.
 *
 * Mirrors `useTestEngine`'s beforeEach trick so it works under both runners: a
 * destructured param makes Jest treat the hook as done-callback style, so the raw
 * first argument (Jest's `done`) is invoked to finish the hook. Under Jest there
 * is no `browserName` (getter returns `undefined`); under Playwright it is the
 * project name (`'chromium'` | `'firefox'` | `'webkit'`).
 */
export function useBrowserName(beforeEach: TestFrameworkMapper['beforeEach']): () => string | undefined {
  let name: string | undefined;
  // @ts-ignore - dual Jest (done callback) / Playwright (fixture) hook signature, as in useTestEngine.
  beforeEach(function ({ browserName }: { browserName?: string }) {
    name = browserName;
    if (typeof arguments[0] === 'function') {
      (arguments[0] as () => void)();
    }
  });
  return () => name;
}

/**
 * Astryx overlays (DropdownMenu, MoreMenu, Popover) use the native HTML Popover
 * API with CSS anchor positioning, and Dialog dismisses via Escape on a native
 * `<dialog>`. Playwright's bundled WebKit cannot drive these: opening a
 * native-popover overlay busies WebKit's main thread so every subsequent
 * automation call times out, and pressing Escape on the animating modal `<dialog>`
 * never reaches a stable press target. The *reads* (labels, counts, roles, active
 * state) work on every browser; only these open/close interactions are affected.
 *
 * Interaction tests call this at the top so the assertion runs on chromium and
 * firefox (and in jsdom, where `browserName` is undefined) but is marked skipped
 * on WebKit.
 *
 * @param test The framework test object — Playwright's `skip()` marks the current
 * test skipped; never invoked under Jest.
 * @param browserName From {@link useBrowserName}; `undefined` under jsdom.
 * @returns `true` when the caller should bail out (WebKit), else `false`.
 */
export function skipInteractionOnWebkit(test: TestFrameworkMapper['test'], browserName: string | undefined): boolean {
  if (browserName === 'webkit') {
    // Playwright's `test.skip()` (no-arg) marks the current test skipped; the
    // mapper types `skip` as the describe-style `(name, fn)`, so cast for the call.
    (test.skip as unknown as () => void)();
    return true;
  }
  return false;
}
