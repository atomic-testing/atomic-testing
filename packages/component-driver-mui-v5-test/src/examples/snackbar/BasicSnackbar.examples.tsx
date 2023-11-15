import { ButtonDriver, SnackbarDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

//#region Snackbar
export const BasicSnackbar: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton data-testid="close-button" size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Button data-testid="snack-opener" onClick={handleClick}>
        Open simple snackbar
      </Button>
      <Snackbar
        data-testid="basic-snackbar"
        open={open}
        autoHideDuration={6000000}
        onClose={handleClose}
        message="Note archived"
        action={action}
      />
    </div>
  );
};

export const basicSnackbarExampleScenePart = {
  basicSnackbar: {
    locator: byDataTestId('basic-snackbar'),
    driver: SnackbarDriver,
  },
  snackOpener: {
    locator: byDataTestId('snack-opener'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

/**
 * Basic Snackbar example from MUI's website
 * @see https://mui.com/material-ui/react-snackbar#description
 */
export const basicSnackbarExample: IExampleUnit<typeof basicSnackbarExampleScenePart, JSX.Element> = {
  title: 'Basic Snackbar',
  scene: basicSnackbarExampleScenePart,
  ui: <BasicSnackbar />,
};
//#endregion

export const basicSnackbarTestSuite: TestSuiteInfo<typeof basicSnackbarExampleScenePart> = {
  title: 'Basic Snackbar',
  url: '/snackbar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicSnackbarExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicSnackbarExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Snackbar should not exists to begin with', async () => {
      const exists = await testEngine.parts.basicSnackbar.exists();
      assertEqual(exists, false);
    });

    describe('Opening the snackbar', () => {
      beforeEach(async () => {
        await testEngine.parts.snackOpener.click();
      });

      test('Snackbar should exist', async () => {
        const exists = await testEngine.parts.basicSnackbar.exists();
        assertEqual(exists, true);
      });

      test('Snackbar should have the correct message', async () => {
        const message = await testEngine.parts.basicSnackbar.getLabel();
        assertEqual(message, 'Note archived');
      });

      test('Closing the snackbar should dismisses the snackbar', async () => {
        const closeButton = await testEngine.parts.basicSnackbar.getActionComponent(
          byDataTestId('close-button'),
          ButtonDriver,
        );

        await closeButton?.click();
        await testEngine.parts.basicSnackbar.waitUntil({
          condition: 'detached',
        });
        const exists = await testEngine.parts.basicSnackbar.exists();
        assertEqual(exists, false);
      });
    });
  },
};
