import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';

import { workspaceParts } from '../src/testing/workspaceParts';

/**
 * E2E (real browser) run of the workspace scenarios. The engine is built from the
 * Playwright `page`; the `workspaceParts` scene + composed drivers are the very same
 * imports the Vitest DOM spec uses (src/__tests__/workspace.test.tsx). The flows read
 * identically because the drivers carry the behaviour — only this construction differs.
 */
test('switches between the Profile and Notifications tabs', async ({ page }) => {
  await page.goto('/');
  const { workspace } = createTestEngine(page, workspaceParts).parts;

  expect(await workspace.tabs.getTabLabels()).toEqual(['Profile', 'Notifications']);
  expect(await workspace.tabs.getSelectedLabel()).toBe('Profile');

  expect(await workspace.tabs.selectByLabel('Notifications')).toBe(true);
  expect(await workspace.tabs.getSelectedLabel()).toBe('Notifications');
  expect(await workspace.tabs.getPanelText(1)).toMatch(/weekly digests/i);
});

test('opens the timezone Select, enumerates options, and selects by label', async ({ page }) => {
  await page.goto('/');
  const { workspace } = createTestEngine(page, workspaceParts).parts;
  const timezone = workspace.profile.timezone;

  await timezone.openDropdown();
  expect(await timezone.isDropdownOpen()).toBe(true);
  expect(await timezone.getMenuItemCount()).toBe(5);

  await timezone.selectByLabel('Tokyo');
  expect(await timezone.getSelectedLabel()).toBe('Tokyo');
  expect(await timezone.isDropdownOpen()).toBe(false);
});

test('fills the profile form and saves', async ({ page }) => {
  await page.goto('/');
  const { workspace } = createTestEngine(page, workspaceParts).parts;

  expect(await workspace.profile.getSaveStatus()).toBeNull();

  await workspace.profile.setValue({ displayName: 'Grace Hopper', timezone: 'London' });
  await workspace.profile.save();

  expect(await workspace.profile.getSaveStatus()).toBe('Saved — Grace Hopper (London)');
  expect(await workspace.profile.getValue()).toEqual({ displayName: 'Grace Hopper', timezone: 'London' });
});

test('signs out through the account dropdown menu', async ({ page }) => {
  await page.goto('/');
  const { workspace } = createTestEngine(page, workspaceParts).parts;

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

test('guards workspace deletion behind the confirm dialog', async ({ page }) => {
  await page.goto('/');
  const { workspace } = createTestEngine(page, workspaceParts).parts;

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

test('closes the delete dialog with Escape', async ({ page }) => {
  await page.goto('/');
  const { workspace } = createTestEngine(page, workspaceParts).parts;

  await workspace.danger.openDialog();

  expect(await workspace.danger.dialog.closeByEscape()).toBe(true);
  expect(await workspace.danger.dialog.isOpen()).toBe(false);
  expect(await workspace.danger.getWorkspaceStatus()).toBe('Workspace active');
});
