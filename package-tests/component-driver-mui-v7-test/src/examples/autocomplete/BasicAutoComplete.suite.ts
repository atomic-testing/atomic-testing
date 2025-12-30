import { JSX } from 'react';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { AutoCompleteDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicAutoCompleteUIExample } from './BasicAutoComplete.examples';

export const basicAutoCompleteExampleScenePart = {
  select: {
    locator: byDataTestId('basic-auto-complete'),
    driver: AutoCompleteDriver,
  },
  selectedLabel: {
    locator: byDataTestId('selected-label'),
    driver: HTMLElementDriver,
  },

  portalSelect: {
    locator: byDataTestId('portal-auto-complete'),
    driver: AutoCompleteDriver,
  },
  portalSelectedLabel: {
    locator: byDataTestId('portal-selected-label'),
    driver: HTMLElementDriver,
  },

  readonlySelect: {
    locator: byDataTestId('readonly-auto-complete'),
    driver: AutoCompleteDriver,
  },

  disabledSelect: {
    locator: byDataTestId('disabled-auto-complete'),
    driver: AutoCompleteDriver,
  },
} satisfies ScenePart;

export const basicAutoCompleteExample: IExampleUnit<typeof basicAutoCompleteExampleScenePart, JSX.Element> = {
  ...basicAutoCompleteUIExample,
  scene: basicAutoCompleteExampleScenePart,
};

export const basicAutoCompleteTestSuite: TestSuiteInfo<typeof basicAutoCompleteExample.scene> = {
  title: 'Basic AutoComplete',
  url: '/autocomplete',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(basicAutoCompleteExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Selected label should be empty initially', async () => {
      const text = await engine().parts.selectedLabel.getText();
      assertEqual(text, '');
    });

    test('Select can choose an option', async () => {
      await engine().parts.select.setValue('The Shawshank Redemption');
      const text = await engine().parts.selectedLabel.getText();
      assertEqual(text, 'The Shawshank Redemption');
    });

    test('Portal select can choose an option', async () => {
      await engine().parts.portalSelect.setValue('The Godfather');
      const text = await engine().parts.portalSelectedLabel.getText();
      assertEqual(text, 'The Godfather');
    });

    test('Readonly select should not be interactive', async () => {
      const isReadonly = await engine().parts.readonlySelect.isReadonly();
      assertTrue(isReadonly);
    });

    test('Disabled select should be disabled', async () => {
      const isDisabled = await engine().parts.disabledSelect.isDisabled();
      assertTrue(isDisabled);
    });
  },
};
