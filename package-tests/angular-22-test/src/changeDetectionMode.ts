/**
 * Lets the shared test file know which change detection mode the current
 * Vitest project runs under, so it can assert the mode-specific settling
 * semantics (zone.js tracks `setTimeout`; zoneless does not).
 */
export type ChangeDetectionMode = 'zone' | 'zoneless';

let mode: ChangeDetectionMode | undefined;

export function setChangeDetectionMode(value: ChangeDetectionMode): void {
  mode = value;
}

export function getChangeDetectionMode(): ChangeDetectionMode {
  if (mode == null) {
    throw new Error('Change detection mode not set — is the project setup file missing?');
  }
  return mode;
}
