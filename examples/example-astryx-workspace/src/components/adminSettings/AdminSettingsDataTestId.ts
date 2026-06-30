export const AdminSettingsDataTestId = {
  tabs: 'admin-tabs',
  orgInput: 'org-input',
  channels: 'admin-channels',
  density: 'admin-density',
  betaField: 'admin-beta',
  model: 'admin-model',
  renewal: 'admin-renewal',
  unsavedBanner: 'unsaved-banner',
  save: 'save-button',
  deleteTrigger: 'delete-button',
  deleteDialog: 'delete-dialog',
} as const;

/** Tab values/labels for the settings console. */
export const ADMIN_TABS = [
  { value: 'general', label: 'General' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'appearance', label: 'Appearance' },
] as const;

/** SegmentedControl / Switch accessible labels — anchored by role + label (no testid forwarded). */
export const PLAN_LABEL = 'Plan';
