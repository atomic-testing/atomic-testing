import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { useState } from 'react';

import { createTestEngine } from '../src/createTestEngine';

/**
 * Smoke test proving react-legacy's React 16/17 path actually works end to end:
 * it renders with `ReactDOM.render` and routes a mutative interaction through
 * `LegacyReactInteractor` (which wraps actions in `act` from
 * `react-dom/test-utils`). This is the guard that keeps #959's "real 16/17 path"
 * honest — react-legacy resolves React 17 here, not React 18/19.
 */
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span data-testid='count'>{count}</span>
      <button data-testid='increment' onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

const counterScenePart = {
  count: { locator: byDataTestId('count'), driver: HTMLElementDriver },
  increment: { locator: byDataTestId('increment'), driver: HTMLButtonDriver },
} satisfies ScenePart;

describe('react-legacy createTestEngine', () => {
  it('renders a React 17 component and applies state updates through act', async () => {
    const engine = createTestEngine(<Counter />, counterScenePart);
    try {
      expect(await engine.parts.count.getText()).toBe('0');

      await engine.parts.increment.click();
      expect(await engine.parts.count.getText()).toBe('1');

      await engine.parts.increment.click();
      expect(await engine.parts.count.getText()).toBe('2');
    } finally {
      await engine.cleanUp();
    }
  });

  // Guards LegacyReactInteractor.waitUntil's closure-capture: React <=17's
  // `act` resolves its async overload with NO value, so a naive
  // `return await act(...)` would silently yield undefined here and break every
  // consumer that reads waitUntil's result (ComponentDriver.waitUntil,
  // interactorWaitUtil, MUI DialogDriver). The smoke test above would still pass,
  // so this case is what actually catches a regression of that line.
  it('waitUntil returns the probed value (not undefined) on React 17', async () => {
    const engine = createTestEngine(<Counter />, counterScenePart);
    try {
      const value = await engine.interactor.waitUntil({
        probeFn: () => 'ready',
        terminateCondition: 'ready',
        timeoutMs: 1000,
      });
      expect(value).toBe('ready');
    } finally {
      await engine.cleanUp();
    }
  });
});
