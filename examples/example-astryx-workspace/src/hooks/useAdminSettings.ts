import { useMemo, useState } from 'react';

import { defaultSettings, SettingsModel, settingsEqual } from '../models/SettingsModel';

export interface AdminSettingsController {
  draft: SettingsModel;
  /** True when the draft diverges from the last saved baseline. */
  dirty: boolean;
  /** Shown briefly after a successful save. */
  savedToast: boolean;
  update: (patch: Partial<SettingsModel>) => void;
  save: () => void;
  dismissToast: () => void;
  /** Resets the draft to the saved baseline (used by the delete-confirm flow). */
  reset: () => void;
}

/**
 * Owns the settings form state: an editable `draft` over a saved baseline. The
 * unsaved-changes banner, the Save button, and the toast all derive from here so the
 * component stays a thin view.
 */
export function useAdminSettings(): AdminSettingsController {
  const [saved, setSaved] = useState<SettingsModel>(defaultSettings);
  const [draft, setDraft] = useState<SettingsModel>(defaultSettings);
  const [savedToast, setSavedToast] = useState(false);

  return useMemo<AdminSettingsController>(
    () => ({
      draft,
      dirty: !settingsEqual(draft, saved),
      savedToast,
      update: (patch) => setDraft((current) => ({ ...current, ...patch })),
      save: () => {
        setSaved(draft);
        setSavedToast(true);
      },
      dismissToast: () => setSavedToast(false),
      reset: () => setDraft(saved),
    }),
    [draft, saved, savedToast],
  );
}
