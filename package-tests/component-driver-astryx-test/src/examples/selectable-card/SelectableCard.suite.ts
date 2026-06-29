import { SelectableCardDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { selectableCardUIExample } from './SelectableCard.examples';

export const selectableCardExampleScenePart = {
  premiumCard: {
    locator: byDataTestId('premium-card'),
    driver: SelectableCardDriver,
  },
  basicCard: {
    locator: byDataTestId('basic-card'),
    driver: SelectableCardDriver,
  },
} satisfies ScenePart;

export const selectableCardExample: IExampleUnit<typeof selectableCardExampleScenePart, JSX.Element> = {
  ...selectableCardUIExample,
  scene: selectableCardExampleScenePart,
};

export const selectableCardExampleTestSuite: TestSuiteInfo<typeof selectableCardExample.scene> = {
  title: 'Astryx SelectableCard',
  url: '/selectable-card',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${selectableCardExample.title}`, () => {
      const engine = useTestEngine(selectableCardExample.scene, getTestEngine, { beforeEach, afterEach });

      // isSelected reads the inner checkbox; getLabel its aria-label.
      test(`isSelected and getLabel read the card state`, async () => {
        assertFalse(await engine().parts.premiumCard.isSelected());
        assertEqual(await engine().parts.premiumCard.getLabel(), 'Premium plan');
      });

      // setSelected/toggle flip the selection via the inner checkbox.
      test(`setSelected and toggle change the selection`, async () => {
        await engine().parts.premiumCard.setSelected(true);
        assertTrue(await engine().parts.premiumCard.isSelected());
        await engine().parts.premiumCard.toggle();
        assertFalse(await engine().parts.premiumCard.isSelected());
      });

      // isDisabled reflects the disabled card.
      test(`isDisabled reflects the disabled state`, async () => {
        assertTrue(await engine().parts.basicCard.isDisabled());
        assertFalse(await engine().parts.premiumCard.isDisabled());
      });
    });
  },
};
