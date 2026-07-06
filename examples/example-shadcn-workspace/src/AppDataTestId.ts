/**
 * Stable `data-testid` anchors for the top-level workspace regions. Both the
 * Vitest DOM specs and the Playwright E2E specs locate the app through these, so
 * the same {@link workspaceParts} scene map drives both runners unchanged.
 *
 * Every anchor lives on a USAGE SITE (App/feature components) — never inside
 * `src/components/ui/`, which is unmodified `npx shadcn add` output. The shadcn
 * wrappers spread props through to the Radix primitives, so a `data-testid`
 * passed at the call site lands on the real trigger/content element.
 */
export const AppDataTestId = {
  /** Root element wrapping the whole app — every other anchor is a descendant. */
  root: 'workspace-root',
  /** shadcn `TabsList` (Profile / Notifications) — `TabsDriver` finds `role="tab"` children under it. */
  settingsTabs: 'settings-tabs',
} as const;
