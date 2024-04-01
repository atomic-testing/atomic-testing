import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import AlarmIcon from '@mui/icons-material/Alarm';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import React from 'react';

//#region Icon and label
export const IconAndLabelExample = () => {
  const [target, setTarget] = React.useState('');
  return (
    <Stack direction="row" spacing={10}>
      <IconButton
        color="secondary"
        aria-label="add an alarm"
        data-testid="icon-button"
        onClick={() => setTarget('icon-button')}
      >
        <AlarmIcon />
      </IconButton>
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        data-testid="icon-label-button"
        onClick={() => setTarget('icon-label-button')}
      >
        Send
      </Button>
      <div data-testid="target">{target}</div>
    </Stack>
  );
};

export const iconAndLabelExampleScenePart = {
  iconButton: {
    locator: byDataTestId('icon-button'),
    driver: ButtonDriver,
  },
  iconLabelButton: {
    locator: byDataTestId('icon-label-button'),
    driver: ButtonDriver,
  },
  target: {
    locator: byDataTestId('target'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Icon button example from MUI's website
 * @see https://mui.com/material-ui/react-button/#icon-button
 */
export const iconAndLabelExample: IExampleUnit<typeof iconAndLabelExampleScenePart, JSX.Element> = {
  title: 'Icon & Label',
  scene: iconAndLabelExampleScenePart,
  ui: <IconAndLabelExample />,
};
//#endregion

export const iconAndLabelButtonTestSuite: TestSuiteInfo<typeof iconAndLabelExampleScenePart> = {
  title: 'Icon & Label',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${iconAndLabelExample.title}`, () => {
      let testEngine: TestEngine<typeof iconAndLabelExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(iconAndLabelExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Target should be empty initially`, async () => {
        const text = await testEngine.parts.target.getText();
        assertEqual(text, '');
      });

      test(`Click on icon-button should display icon-button`, async () => {
        await testEngine.parts.iconButton.click();
        const text = await testEngine.parts.target.getText();
        assertEqual(text, 'icon-button');
      });

      test(`Click on icon-label-button should display icon-label-button`, async () => {
        await testEngine.parts.iconLabelButton.click();
        const text = await testEngine.parts.target.getText();
        assertEqual(text, 'icon-label-button');
      });
    });
  },
};
