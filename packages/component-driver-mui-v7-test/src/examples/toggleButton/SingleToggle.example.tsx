import React from 'react';

import { ToggleButtonDriver } from '@atomic-testing/component-driver-mui-v6';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import ToggleButton from '@mui/material/ToggleButton';

//#region Single toggle
export const SingleToggleExample = () => {
  const [selected, setSelected] = React.useState(false);

  const handleChange = () => {
    setSelected(!selected);
  };
  return (
    <ToggleButton data-testid='single-toggle' value='single' selected={selected} onChange={handleChange}>
      Toggle me
    </ToggleButton>
  );
};

export const singleToggleExampleScenePart = {
  singleToggle: {
    locator: byDataTestId('single-toggle'),
    driver: ToggleButtonDriver,
  },
} satisfies ScenePart;

/**
 * Editor Toolbar Example from MUI Website
 */
export const singleToggleExample: IExampleUnit<typeof singleToggleExampleScenePart, JSX.Element> = {
  title: 'Single Toggle Button',
  scene: singleToggleExampleScenePart,
  ui: <SingleToggleExample />,
};
//#endregion

export const singleToggleButtonTestSuite: TestSuiteInfo<typeof singleToggleExampleScenePart> = {
  title: 'Single Toggle Button',
  url: '/toggle-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${singleToggleExample.title}`, () => {
      let testEngine: TestEngine<typeof singleToggleExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(singleToggleExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Initially selected state should be false', async () => {
        const selected = await testEngine.parts.singleToggle.isSelected();
        assertEqual(selected, false);
      });

      test('Click on the button would set selected state to true', async () => {
        await testEngine.parts.singleToggle.click();
        const selected = await testEngine.parts.singleToggle.isSelected();
        assertEqual(selected, true);
      });

      test('Set the selected state would yield the correct selected state', async () => {
        await testEngine.parts.singleToggle.setSelected(true);
        const selected = await testEngine.parts.singleToggle.isSelected();
        assertEqual(selected, true);
      });
    });
  },
};
