import { ChipDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Chip from '@mui/material/Chip';
import React from 'react';

//#region Chip
export const BasicChip: React.FunctionComponent = () => {
  return <Chip label="Chirpy" data-testid="basic-chip" />;
};

export const basicChipExampleScenePart = {
  basicChip: {
    locator: byDataTestId('basic-chip'),
    driver: ChipDriver,
  },
} satisfies ScenePart;

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-chip#description
 */
export const basicChipExample: IExampleUnit<typeof basicChipExampleScenePart, JSX.Element> = {
  title: 'Basic Chip',
  scene: basicChipExampleScenePart,
  ui: <BasicChip />,
};
//#endregion

export const basicChipTestSuite: TestSuiteInfo<typeof basicChipExampleScenePart> = {
  title: 'Basic Chip',
  url: '/chip',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicChipExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicChipExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Chip should display Chirpy', async () => {
      const chipContent = await testEngine.parts.basicChip.getLabel();
      assertEqual(chipContent, 'Chirpy');
    });
  },
};
