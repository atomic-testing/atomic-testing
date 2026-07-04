/** `data-testid` anchors for the header's account dropdown menu (usage-site only — see AppDataTestId). */
export const WorkspaceHeaderDataTestId = {
  /** Header element wrapping the title, session status, and account menu. */
  root: 'workspace-header',
  /** The "Account" `Button` used as `DropdownMenuTrigger` (via `asChild`). */
  accountTrigger: 'account-trigger',
  /** `DropdownMenuContent` — portalled to `document.body`; the driver re-roots to `role="menu"`. */
  accountMenu: 'account-menu',
  /** Visible session-status line the menu items update ("Signed in as …" / "Signed out"). */
  accountStatus: 'account-status',
} as const;
