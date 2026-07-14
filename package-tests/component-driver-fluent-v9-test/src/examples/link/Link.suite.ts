import { LinkDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { linkUIExample } from './Link.examples';

export const linkExampleScenePart = {
  one: { locator: byDataTestId('link-one'), driver: LinkDriver },
  two: { locator: byDataTestId('link-two'), driver: LinkDriver },
  disabled: { locator: byDataTestId('link-disabled'), driver: LinkDriver },
} satisfies ScenePart;

export const linkExample: IExampleUnit<typeof linkExampleScenePart, JSX.Element> = {
  ...linkUIExample,
  scene: linkExampleScenePart,
};

export const linkExampleTestSuite: TestSuiteInfo<typeof linkExample.scene> = {
  title: 'Fluent Link',
  url: '/link',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${linkExample.title}`, () => {
      const engine = useTestEngine(linkExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own href/target per instance', async () => {
        assertEqual(await engine().parts.one.getHref(), 'https://example.com/one');
        assertEqual(await engine().parts.one.getTarget(), undefined);
        assertEqual(await engine().parts.two.getHref(), 'https://example.com/two');
        assertEqual(await engine().parts.two.getTarget(), '_blank');
      });

      test('reads disabled state via aria-disabled per instance', async () => {
        assertFalse(await engine().parts.one.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('a disabled link has its href removed, not merely blocked', async () => {
        assertEqual(await engine().parts.disabled.getHref(), undefined);
      });
    });
  },
};
