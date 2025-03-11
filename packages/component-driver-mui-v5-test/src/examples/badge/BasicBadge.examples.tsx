import React from 'react';

import { BadgeDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';

//#region Badge
export const BasicBadge: React.FunctionComponent = () => {
  return (
    <Badge badgeContent={12} color='primary' data-testid='basic-badge'>
      <MailIcon color='action' />
    </Badge>
  );
};

export const basicBadgeExampleScenePart = {
  basicBadge: {
    locator: byDataTestId('basic-badge'),
    driver: BadgeDriver,
  },
} satisfies ScenePart;

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-badge#description
 */
export const basicBadgeExample: IExampleUnit<typeof basicBadgeExampleScenePart, JSX.Element> = {
  title: 'Basic Badge',
  scene: basicBadgeExampleScenePart,
  ui: <BasicBadge />,
};
//#endregion

export const basicBadgeTestSuite: TestSuiteInfo<typeof basicBadgeExampleScenePart> = {
  title: 'Basic Badge',
  url: '/badge',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicBadgeExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicBadgeExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Badge should display 12', async () => {
      const badgeContent = await testEngine.parts.basicBadge.getContent();
      assertEqual(badgeContent, '12');
    });
  },
};
