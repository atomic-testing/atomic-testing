import type { TicketConsoleDriver } from '../components/ticketConsole/TicketConsoleDriver';
import { weekRange } from '../data/today';

// A tiny assertion surface so each scenario is written once and run by both Vitest and Playwright,
// which provide their own `expect`. Each test file adapts its `expect` into this shape.
export interface Assert {
  equal<T>(actual: T, expected: T, message?: string): void;
  isTrue(value: boolean, message?: string): void;
  match(actual: string | null | undefined, pattern: RegExp, message?: string): void;
  includes(haystack: string | null | undefined, needle: string, message?: string): void;
}

// Scenario 1 — Triage flow: narrow to "Open, due this week", open the first ticket, reassign it to
// me, save, expect a success toast, and see the grid reflect the new assignee.
export async function triageFlow(console: TicketConsoleDriver, assert: Assert): Promise<void> {
  await console.waitUntilReady();

  await console.filterBar.filterByStatus('Open');
  const week = weekRange();
  await console.filterBar.setDueRange(week.from, week.to);
  await console.grid.waitForLoad();

  const titles = await console.grid.getVisibleTitles();
  assert.equal(titles.length, 3, 'three Open tickets are due this week');
  assert.includes(titles.join('|'), 'Login fails on Safari');

  await console.grid.openRow(0);
  await console.editor.waitForOpen();
  await console.editor.setValue({ assignee: 'Me', priority: 'High' });
  await console.editor.save();
  await console.editor.waitForClose();

  assert.includes(await console.toast.getLabel(), 'saved', 'a save toast appears');
  assert.equal(await console.grid.getAssignee(0), 'Me', 'the grid row shows the new assignee');
}

// Scenario 2 — Empty state: a queue with no tickets shows zero rows.
export async function emptyQueueFlow(console: TicketConsoleDriver, assert: Assert): Promise<void> {
  await console.waitUntilReady();

  await console.teamNav.selectQueue('mobile-triage');
  await console.grid.waitForLoad();

  assert.equal(await console.grid.getRowCount(), 0, 'the empty queue shows no rows');
}

// Scenario 3 — Tab switch: the Overdue view replaces the full list with only overdue tickets.
export async function tabSwitchFlow(console: TicketConsoleDriver, assert: Assert): Promise<void> {
  await console.waitUntilReady();

  assert.equal(await console.grid.getRowCount(), 11, 'the All view shows every seeded ticket');

  await console.tabs.selectByLabel('Overdue');
  await console.grid.waitForLoad();

  assert.equal(await console.grid.getRowCount(), 3, 'the Overdue view shows only overdue, open tickets');
  const titles = await console.grid.getVisibleTitles();
  assert.isTrue(titles.includes('Typo in footer'), 'an overdue ticket is listed');
}

// Scenario 4 — Validation: clearing the required title and saving surfaces a field error and keeps
// the editor open.
export async function validationFlow(console: TicketConsoleDriver, assert: Assert): Promise<void> {
  await console.waitUntilReady();

  await console.grid.openRow(0);
  await console.editor.waitForOpen();

  await console.editor.setValue({ title: '' });
  await console.editor.save();

  assert.match(await console.editor.getError(), /required/i, 'the title error mentions "required"');
  assert.isTrue(await console.editor.isOpen(), 'the editor stays open on a validation error');
}
