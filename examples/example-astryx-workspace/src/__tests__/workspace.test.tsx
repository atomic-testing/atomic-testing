import type { ISODateString } from '@astryxdesign/core/Calendar';
import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react-19';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import App from '../App';
import { workspaceParts } from '../testing/workspaceParts';

/**
 * DOM (jsdom) run of the workspace scenarios. The engine renders <App /> directly and
 * the `workspaceParts` scene + composed drivers are imported verbatim — the E2E spec in
 * e2e/workspace.spec.ts runs the very same flow against a real browser, differing only
 * in how the engine is constructed.
 */
describe('Astryx workspace (DOM)', () => {
  let engine: TestEngine<typeof workspaceParts>;

  beforeEach(() => {
    // Reset the BrowserRouter back to the chat route between tests.
    window.history.pushState({}, '', '/');
    engine = createTestEngine(<App />, workspaceParts);
  });

  afterEach(async () => {
    await engine.cleanUp();
  });

  test('sends a message and gets a reply with a tool-call group', async () => {
    const { workspace } = engine.parts;
    expect(await workspace.chat.canSend()).toBe(false);

    const before = await workspace.chat.getMessageCount();
    await workspace.chat.send('plan a trip');

    expect(await workspace.chat.getMessageCount()).toBe(before + 2);
    expect(await workspace.chat.getToolCallCount()).toBeGreaterThanOrEqual(1);
    expect(await workspace.chat.getLastAssistantText()).toMatch(/plan a trip/i);
  });

  test('switches the model', async () => {
    const { workspace } = engine.parts;
    await workspace.chat.selectModel('Claude Opus');
    expect(await workspace.chat.getSelectedModel()).toBe('Claude Opus');
  });

  test('opens settings from the command palette', async () => {
    const { workspace } = engine.parts;
    await workspace.commandBar.open();
    expect(await workspace.commandBar.isOpen()).toBe(true);

    await workspace.commandBar.run('Open settings');
    // Selecting the command routes asynchronously — poll until the section settles.
    await expect.poll(() => workspace.getCurrentSection()).toBe('admin');
  });

  test('saves admin settings and clears the unsaved banner', async () => {
    const { workspace } = engine.parts;
    await workspace.gotoAdmin();

    await workspace.admin.setValue({
      orgName: 'Globex',
      plan: 'Pro',
      channels: ['Email'],
      beta: true,
      renewal: '2026-07-15' as ISODateString,
    });
    expect(await workspace.admin.hasUnsavedBanner()).toBe(true);

    await workspace.admin.save();
    expect(await workspace.admin.getToastMessage()).toMatch(/saved/i);
    expect(await workspace.admin.hasUnsavedBanner()).toBe(false);
  });

  test('guards workspace deletion behind the alert dialog', async () => {
    const { workspace } = engine.parts;
    await workspace.gotoAdmin();

    await workspace.admin.openDeleteDialog();
    expect(await workspace.admin.deleteDialog.isOpen()).toBe(true);
    expect(await workspace.admin.deleteDialog.getActionLabel()).toBe('Delete');

    await workspace.admin.deleteDialog.clickCancel();
    expect(await workspace.admin.deleteDialog.isOpen()).toBe(false);

    await workspace.admin.openDeleteDialog();
    await workspace.admin.deleteDialog.clickAction();
    expect(await workspace.admin.deleteDialog.isOpen()).toBe(false);
  });
});
