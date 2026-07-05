/** `data-testid` anchors for the Profile tab's form and danger zone (usage-site only — see AppDataTestId). */
export const ProfileSettingsDataTestId = {
  /** Wrapper around the display-name/timezone/save form — `ProfileFormDriver`'s root. */
  form: 'profile-form',
  /** shadcn `Input` for the display name. */
  displayNameInput: 'display-name-input',
  /** shadcn `SelectTrigger` for the timezone — `SelectDriver`'s root (its listbox is portalled). */
  timezoneSelect: 'timezone-select',
  /** Save `Button`. */
  saveButton: 'save-button',
  /** Save-confirmation line, rendered only after a save. */
  saveStatus: 'save-status',
  /** Wrapper around the delete-workspace action — `DangerZoneDriver`'s root. */
  dangerZone: 'danger-zone',
  /** "Delete workspace" `Button` used as `DialogTrigger` (via `asChild`). */
  deleteTrigger: 'delete-workspace-trigger',
  /** `DialogContent` of the confirm dialog — portalled; the driver re-roots to `role="dialog"`. */
  deleteDialog: 'delete-workspace-dialog',
  /** Cancel `Button` inside the dialog footer. */
  deleteCancel: 'delete-cancel',
  /** Confirm ("Delete workspace") `Button` inside the dialog footer. */
  deleteConfirm: 'delete-confirm',
  /** Visible workspace state line ("Workspace active" / "Workspace deleted"). */
  workspaceStatus: 'workspace-status',
} as const;
