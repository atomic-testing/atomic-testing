/**
 * Stable `data-testid` anchors for the top-level workspace regions. Both the
 * Vitest DOM specs and the Playwright E2E specs locate the app through these, so
 * the same {@link workspaceParts} scene map drives both runners unchanged.
 */
export const AppDataTestId = {
  /** Root element wrapping the whole app — every other anchor is a descendant. */
  root: 'workspace-root',
  /** Astryx `AppShell` (header + side nav + main). */
  shell: 'workspace-shell',
  /** Chat section root (mounted on the `/` route). */
  chatSection: 'chat-section',
  /** Admin settings section root (mounted on the `/admin` route). */
  adminSection: 'admin-section',
  /** Command bar wrapper (⌘K trigger + `CommandPalette`), always mounted in the header. */
  commandBar: 'command-bar',
} as const;
