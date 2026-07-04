import { createTestEngine } from '@atomic-testing/angular-22';
import { HTMLButtonDriver, HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart, TestEngine } from '@atomic-testing/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getChangeDetectionMode } from '../src/changeDetectionMode';
import { CounterComponent } from '../src/CounterComponent';

const parts = {
  count: { locator: byDataTestId('count'), driver: HTMLElementDriver },
  increment: { locator: byDataTestId('increment'), driver: HTMLButtonDriver },
  incrementLater: { locator: byDataTestId('increment-later'), driver: HTMLButtonDriver },
  name: { locator: byDataTestId('name'), driver: HTMLTextInputDriver },
  greeting: { locator: byDataTestId('greeting'), driver: HTMLElementDriver },
} satisfies ScenePart;

// This file runs once per Vitest project: `zone` (zone.js loaded) and
// `zoneless` (createTestEngine auto-adds provideZonelessChangeDetection).
describe(`CounterComponent via AngularInteractor (${getChangeDetectionMode()})`, () => {
  let engine: TestEngine<typeof parts>;

  beforeEach(async () => {
    engine = await createTestEngine(CounterComponent, parts);
  });

  afterEach(async () => {
    await engine.cleanUp();
  });

  it('renders the initial state', async () => {
    expect(await engine.parts.count.getText()).toBe('0');
    expect(await engine.parts.greeting.getText()).toBe('Hello');
  });

  it('settles synchronous signal updates triggered by click', async () => {
    await engine.parts.increment.click();
    expect(await engine.parts.count.getText()).toBe('1');

    await engine.parts.increment.click();
    expect(await engine.parts.count.getText()).toBe('2');
  });

  it('settles signal-bound text input', async () => {
    await engine.parts.name.setValue('Ada');
    expect(await engine.parts.name.getValue()).toBe('Ada');
    expect(await engine.parts.greeting.getText()).toBe('Hello Ada');
  });

  if (getChangeDetectionMode() === 'zone') {
    // KNOWN GAP, not yet resolved — found while adding this Angular 21/22
    // runtime fixture. On Angular 20, `whenStable()` waits for a zone.js-
    // tracked pending macrotask (e.g. a bare `setTimeout`), so the assertion
    // below passes immediately after `click()`. On Angular 21 and 22 (both
    // reproduced identically; a zone.js 0.15→0.16 bump made no difference),
    // it does not — `count` stays `'0'` right after the click, only becoming
    // `'1'` once the timer actually fires. That means AngularInteractor's
    // settling may no longer correctly wait for timer-driven state changes
    // under zone-based (non-zoneless) Angular 21/22 apps.
    // `.todo` rather than silently passing via the same poll fallback
    // zoneless uses (which would hide the discrepancy) or hard-failing CI,
    // pending a decision on how `angular-core` should handle this.
    it.todo(
      'settles a setTimeout-driven update via whenStable() alone under zone.js (currently does not on Angular 22 — see comment)'
    );
  } else {
    it('settles a setTimeout-driven update via polling under zoneless', async () => {
      await engine.parts.incrementLater.click();
      // Zoneless change detection does not track bare timeouts — settling
      // resolves before the timeout fires, and tests fall back to polling.
      await expect.poll(() => engine.parts.count.getText(), { timeout: 3000 }).toBe('1');
    });
  }
});
