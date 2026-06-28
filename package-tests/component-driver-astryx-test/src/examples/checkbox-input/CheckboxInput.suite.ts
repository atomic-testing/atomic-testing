import { CheckboxInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, byInputType, IExampleUnit, locatorUtil, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { checkboxInputUIExample } from './CheckboxInput.examples';

export const checkboxInputExampleScenePart = {
  accept: {
    locator: locatorUtil.append(byDataTestId('accept-wrap'), byInputType('checkbox')),
    driver: CheckboxInputDriver,
  },
  subscribe: {
    locator: locatorUtil.append(byDataTestId('subscribe-wrap'), byInputType('checkbox')),
    driver: CheckboxInputDriver,
  },
  all: {
    locator: locatorUtil.append(byDataTestId('all-wrap'), byInputType('checkbox')),
    driver: CheckboxInputDriver,
  },
} satisfies ScenePart;

export const checkboxInputExample: IExampleUnit<typeof checkboxInputExampleScenePart, JSX.Element> = {
  ...checkboxInputUIExample,
  scene: checkboxInputExampleScenePart,
};

export const checkboxInputExampleTestSuite: TestSuiteInfo<typeof checkboxInputExample.scene> = {
  title: 'Astryx CheckboxInput',
  url: '/checkbox-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${checkboxInputExample.title}`, () => {
      const engine = useTestEngine(checkboxInputExample.scene, getTestEngine, { beforeEach, afterEach });

      // isChecked reflects the controlled value.
      test(`isChecked reflects the checked state`, async () => {
        assertTrue(await engine().parts.accept.isChecked());
        assertFalse(await engine().parts.subscribe.isChecked());
      });

      // setSelected/toggle flip the state through the click handler.
      test(`setSelected and toggle flip the state`, async () => {
        await engine().parts.subscribe.setSelected(true);
        assertTrue(await engine().parts.subscribe.isChecked());
        await engine().parts.accept.toggle();
        assertFalse(await engine().parts.accept.isChecked());
      });

      // isIndeterminate reads aria-checked="mixed".
      test(`isIndeterminate reflects the mixed state`, async () => {
        assertTrue(await engine().parts.all.isIndeterminate());
        assertFalse(await engine().parts.accept.isIndeterminate());
      });

      // getLabel resolves the linked <label for>.
      test(`getLabel returns the checkbox label`, async () => {
        assertEqual(await engine().parts.accept.getLabel(), 'Accept terms');
        assertEqual(await engine().parts.subscribe.getLabel(), 'Subscribe');
      });
    });
  },
};
