import React from 'react';

import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { AlertDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

//#region Label alert
export const BasicAlert: React.FunctionComponent = () => {
  return (
    <Stack direction='column' gap={1}>
      <Alert severity='error' data-testid='error-alert'>
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong data-testid='code'>code: red</strong>
      </Alert>
      <Alert severity='warning' data-testid='warning-alert'>
        <AlertTitle>Warning</AlertTitle>
        This is a warning alert — <strong data-testid='code'>code: yellow</strong>
      </Alert>
      <Alert severity='info' data-testid='info-alert'>
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity='success' data-testid='success-alert'>
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    </Stack>
  );
};

const contentPart = {
  code: {
    locator: byDataTestId('code'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const basicAlertExampleScenePart = {
  error: {
    locator: byDataTestId('error-alert'),
    driver: AlertDriver<typeof contentPart>,
    option: {
      content: contentPart,
    },
  },
  warning: {
    locator: byDataTestId('warning-alert'),
    driver: AlertDriver<typeof contentPart>,
    option: {
      content: contentPart,
    },
  },
  info: {
    locator: byDataTestId('info-alert'),
    driver: AlertDriver,
  },
  success: {
    locator: byDataTestId('success-alert'),
    driver: AlertDriver,
  },
} satisfies ScenePart;

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-alert#description
 */
export const basicAlertExample: IExampleUnit<typeof basicAlertExampleScenePart, JSX.Element> = {
  title: 'Basic Alert',
  scene: basicAlertExampleScenePart,
  ui: <BasicAlert />,
};
//#endregion

export const basicAlertTestSuite: TestSuiteInfo<typeof basicAlertExampleScenePart> = {
  title: 'Basic Alert',
  url: '/alert',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicAlertExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicAlertExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    //#region Error
    test(`Error alert's code should be "code: red"`, async () => {
      const val = await testEngine.parts.error.content.code.getText();
      assertEqual(val, 'code: red');
    });

    test(`Error alert's severity should be error`, async () => {
      const val = await testEngine.parts.error.getSeverity();
      assertEqual(val, 'error');
    });

    test(`Error alert's title should be Error`, async () => {
      const val = await testEngine.parts.error.getTitle();
      assertEqual(val, 'Error');
    });

    test(`Error alert's message should contain the correct text`, async () => {
      const val = await testEngine.parts.error.getMessage();
      assertEqual(val?.includes('an error alert'), true);
    });
    //#endregion

    //#region Warning
    test(`Warning alert's code should be "code: yellow"`, async () => {
      const val = await testEngine.parts.warning.content.code.getText();
      assertEqual(val, 'code: yellow');
    });

    test(`Warning alert's severity should be warning`, async () => {
      const val = await testEngine.parts.warning.getSeverity();
      assertEqual(val, 'warning');
    });

    test(`Warning alert's title should be Warning`, async () => {
      const val = await testEngine.parts.warning.getTitle();
      assertEqual(val, 'Warning');
    });

    test(`Warning alert's message should contain the correct text`, async () => {
      const val = await testEngine.parts.warning.getMessage();
      assertEqual(val?.includes('a warning alert'), true);
    });
    //#endregion

    //#region Info
    test(`Info alert's severity should be info`, async () => {
      const val = await testEngine.parts.info.getSeverity();
      assertEqual(val, 'info');
    });
    //#endregion

    //#region Success
    test(`Success alert's severity should be success`, async () => {
      const val = await testEngine.parts.success.getSeverity();
      assertEqual(val, 'success');
    });
    //#endregion
  },
};
