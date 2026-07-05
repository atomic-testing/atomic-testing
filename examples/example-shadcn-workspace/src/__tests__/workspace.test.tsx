import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react-19';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import App from '../App';
import { workspaceParts } from '../testing/workspaceParts';

/**
 * DOM (jsdom) run of the workspace scenarios. The engine renders <App /> directly and
 * the `workspaceParts` scene + composed drivers are imported verbatim — the E2E spec in
 * e2e/workspace.spec.ts runs the very same flows against a real browser, differing only
 * in how the engine is constructed.
 *
 * The timezone-Select test is the headline: without vitest.setup.ts's
 * `hasPointerCapture`/`scrollIntoView` polyfills, the very first trigger click on a
 * Radix/shadcn Select THROWS under jsdom and the dropdown never opens.
 */
describe('shadcn workspace settings (DOM)', () => {
  let engine: TestEngine<typeof workspaceParts>;

  beforeEach(() => {
    engine = createTestEngine(<App />, workspaceParts);
  });

  afterEach(async () => {
    await engine.cleanUp();
  });

  test('switches between the Profile and Notifications tabs', async () => {
    const { workspace } = engine.parts;
    expect(await workspace.tabs.getTabLabels()).toEqual(['Profile', 'Notifications']);
    expect(await workspace.tabs.getSelectedLabel()).toBe('Profile');

    expect(await workspace.tabs.selectByLabel('Notifications')).toBe(true);
    expect(await workspace.tabs.getSelectedLabel()).toBe('Notifications');
    expect(await workspace.tabs.getPanelText(1)).toMatch(/weekly digests/i);
  });

  test('opens the timezone Select, enumerates options, and selects by label', async () => {
    const timezone = engine.parts.workspace.profile.timezone;

    // The flagship pain point: this click throws `target.hasPointerCapture is not a
    // function` in unpolyfilled jsdom (radix-ui#1585 territory) — here it opens and STAYS open.
    await timezone.openDropdown();
    expect(await timezone.isDropdownOpen()).toBe(true);
    expect(await timezone.getMenuItemCount()).toBe(5);

    await timezone.selectByLabel('Tokyo');
    expect(await timezone.getSelectedLabel()).toBe('Tokyo');
    expect(await timezone.isDropdownOpen()).toBe(false);
  });

  test('fills the profile form and saves', async () => {
    const { workspace } = engine.parts;
    expect(await workspace.profile.getSaveStatus()).toBeNull();

    await workspace.profile.setValue({ displayName: 'Grace Hopper', timezone: 'London' });
    await workspace.profile.save();

    expect(await workspace.profile.getSaveStatus()).toBe('Saved — Grace Hopper (London)');
    expect(await workspace.profile.getValue()).toEqual({ displayName: 'Grace Hopper', timezone: 'London' });
  });

  test('signs out through the account dropdown menu', async () => {
    const { workspace } = engine.parts;
    expect(await workspace.account.isOpen()).toBe(false);
    expect(await workspace.account.getStatus()).toBe('Signed in as Ada Lovelace');

    await workspace.account.open();
    expect(await workspace.account.isOpen()).toBe(true);
    // Profile, [separator], Sign out — the separator must not inflate the count.
    expect(await workspace.account.getMenuItemCount()).toBe(2);

    await workspace.account.choose('Sign out');
    expect(await workspace.account.isOpen()).toBe(false);
    expect(await workspace.account.getStatus()).toBe('Signed out');
  });

  test('guards workspace deletion behind the confirm dialog', async () => {
    const { workspace } = engine.parts;
    expect(await workspace.danger.getWorkspaceStatus()).toBe('Workspace active');

    await workspace.danger.openDialog();
    expect(await workspace.danger.dialog.isOpen()).toBe(true);
    expect(await workspace.danger.dialog.getTitle()).toBe('Delete workspace?');

    await workspace.danger.cancel();
    expect(await workspace.danger.dialog.isOpen()).toBe(false);
    expect(await workspace.danger.getWorkspaceStatus()).toBe('Workspace active');

    await workspace.danger.openDialog();
    await workspace.danger.confirmDelete();
    expect(await workspace.danger.getWorkspaceStatus()).toBe('Workspace deleted');
  });

  test('closes the delete dialog with Escape', async () => {
    const { workspace } = engine.parts;
    await workspace.danger.openDialog();

    expect(await workspace.danger.dialog.closeByEscape()).toBe(true);
    expect(await workspace.danger.dialog.isOpen()).toBe(false);
    expect(await workspace.danger.getWorkspaceStatus()).toBe('Workspace active');
  });
});
