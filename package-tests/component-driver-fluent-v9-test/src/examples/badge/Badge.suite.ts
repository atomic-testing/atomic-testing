import { BadgeDriver, CounterBadgeDriver, PresenceBadgeDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { badgeUIExample } from './Badge.examples';

export const badgeExampleScenePart = {
  plain: { locator: byDataTestId('badge-plain'), driver: BadgeDriver },
  counter: { locator: byDataTestId('counter-badge'), driver: CounterBadgeDriver },
  counterOverflow: { locator: byDataTestId('counter-badge-overflow'), driver: CounterBadgeDriver },
  presence: { locator: byDataTestId('presence-badge'), driver: PresenceBadgeDriver },
} satisfies ScenePart;

export const badgeExample: IExampleUnit<typeof badgeExampleScenePart, JSX.Element> = {
  ...badgeUIExample,
  scene: badgeExampleScenePart,
};

export const badgeExampleTestSuite: TestSuiteInfo<typeof badgeExample.scene> = {
  title: 'Fluent Badge',
  url: '/badge',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${badgeExample.title}`, () => {
      const engine = useTestEngine(badgeExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('Badge reads its own text', async () => {
        assertEqual(await engine().parts.plain.getText(), 'New');
      });

      test('CounterBadge reads the raw count and the overflow-clamped count', async () => {
        assertEqual(await engine().parts.counter.getDisplayedCount(), '5');
        assertEqual(await engine().parts.counterOverflow.getDisplayedCount(), '99+');
      });

      test('PresenceBadge reads its status label', async () => {
        assertEqual(await engine().parts.presence.getStatusLabel(), 'busy');
      });
    });
  },
};
