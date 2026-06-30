import type { ISODateString } from '@astryxdesign/core/Calendar';

/**
 * The admin workspace settings, as a driver-facing value object. Field values are
 * deliberately the same strings a human reads on screen (segment/option labels, day
 * ISO date) so `AdminSettingsDriver.setValue`/`getValue` read like the UI.
 */
export interface SettingsModel {
  orgName: string;
  /** Segment value — see {@link PLAN_OPTIONS}. */
  plan: string;
  /** Checked channel labels — see {@link CHANNEL_OPTIONS}. */
  channels: string[];
  /** Radio value — see {@link DENSITY_OPTIONS}. */
  density: string;
  beta: boolean;
  /** Selector option (value === label) — see {@link MODEL_OPTIONS}. */
  model: string;
  renewal: ISODateString;
}

export const PLAN_OPTIONS = [
  { value: 'Free', label: 'Free' },
  { value: 'Pro', label: 'Pro' },
] as const;

export const CHANNEL_OPTIONS = [
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'Push', label: 'Push' },
] as const;

export const DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
] as const;

/** Shared by the chat model picker and the admin "default model" Selector. */
export const MODEL_OPTIONS = [
  { value: 'Claude Sonnet', label: 'Claude Sonnet' },
  { value: 'Claude Opus', label: 'Claude Opus' },
  { value: 'Claude Haiku', label: 'Claude Haiku' },
] as const;

/** The saved baseline — matches the values drawn in the issue's admin mock. */
export const defaultSettings: SettingsModel = {
  orgName: 'Acme Inc',
  plan: 'Free',
  channels: [],
  density: 'comfortable',
  beta: false,
  model: 'Claude Sonnet',
  renewal: '2026-07-01' as ISODateString,
};

/** Structural equality, used to derive the unsaved-changes (dirty) state. */
export function settingsEqual(a: SettingsModel, b: SettingsModel): boolean {
  return (
    a.orgName === b.orgName &&
    a.plan === b.plan &&
    a.density === b.density &&
    a.beta === b.beta &&
    a.model === b.model &&
    a.renewal === b.renewal &&
    a.channels.length === b.channels.length &&
    a.channels.every((c) => b.channels.includes(c))
  );
}
