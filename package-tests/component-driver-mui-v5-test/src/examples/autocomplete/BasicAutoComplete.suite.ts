import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { AutoCompleteDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicAutoCompleteExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicAutoCompleteExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Selected label should be empty initially', async () => {
      const text = await testEngine.parts.selectedLabel.getText();
      assertEqual(text, '');
    });

    test('Select can choose an option', async () => {
      await testEngine.parts.select.setValue('The Shawshank Redemption');
      const text = await testEngine.parts.selectedLabel.getText();
      assertEqual(text, 'The Shawshank Redemption');
    });

    test('Portal select can choose an option', async () => {
      await testEngine.parts.portalSelect.setValue('The Godfather');
      const text = await testEngine.parts.portalSelectedLabel.getText();
      assertEqual(text, 'The Godfather');
    });

    test('Readonly select should not be interactive', async () => {
      const isReadonly = await testEngine.parts.readonlySelect.isReadonly();
      assertEqual(isReadonly, true);
    });

    test('Disabled select should be disabled', async () => {
      const isDisabled = await testEngine.parts.disabledSelect.isDisabled();
      assertEqual(isDisabled, true);
    });
  },
};
