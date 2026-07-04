import { createTestEngine } from '@atomic-testing/angular-20';
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

  it('handles setTimeout-driven updates per change detection mode', async () => {
    await engine.parts.incrementLater.click();

    if (getChangeDetectionMode() === 'zone') {
      // zone.js tracks the timeout as a pending macrotask, so whenStable()
      // (the interactor's settle step) already waited for it during click().
      expect(await engine.parts.count.getText()).toBe('1');
    } else {
      // Zoneless change detection does not track bare timeouts — settling
      // resolves before the timeout fires, and tests fall back to polling.
      await expect.poll(() => engine.parts.count.getText(), { timeout: 3000 }).toBe('1');
    }
  });
});
