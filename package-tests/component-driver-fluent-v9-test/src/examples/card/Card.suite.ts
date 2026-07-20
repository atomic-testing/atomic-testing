import { CardDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { cardUIExample } from './Card.examples';

export const cardExampleScenePart = {
  plain: { locator: byDataTestId('card-plain'), driver: CardDriver },
  selectable: { locator: byDataTestId('card-selectable'), driver: CardDriver },
  disabled: { locator: byDataTestId('card-disabled'), driver: CardDriver },
} satisfies ScenePart;

export const cardExample: IExampleUnit<typeof cardExampleScenePart, JSX.Element> = {
  ...cardUIExample,
  scene: cardExampleScenePart,
};

export const cardExampleTestSuite: TestSuiteInfo<typeof cardExample.scene> = {
  title: 'Fluent Card',
  url: '/card',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${cardExample.title}`, () => {
      const engine = useTestEngine(cardExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads header/preview/footer, and is not selectable by default', async () => {
        assertEqual(await engine().parts.plain.getHeaderTitle(), 'Header text');
        assertEqual(await engine().parts.plain.getHeaderDescription(), 'Description text');
        assertEqual(await engine().parts.plain.getFooterText(), 'Footer text');
        assertTrue(await engine().parts.plain.hasPreview());
        assertFalse(await engine().parts.plain.isSelectable());
        assertFalse(await engine().parts.plain.isDisabled());
      });

      test('a selectable card toggles selection when clicked', async () => {
        assertTrue(await engine().parts.selectable.isSelectable());
        assertFalse(await engine().parts.selectable.isSelected());
        await engine().parts.selectable.setSelected(true);
        assertTrue(await engine().parts.selectable.isSelected());
        await engine().parts.selectable.setSelected(false);
        assertFalse(await engine().parts.selectable.isSelected());
      });

      test('a disabled card reports disabled and ignores selection attempts', async () => {
        assertTrue(await engine().parts.disabled.isDisabled());
        await engine().parts.disabled.setSelected(true);
        assertFalse(await engine().parts.disabled.isSelected());
      });
    });
  },
};
