import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-mui-v6';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

/**
 * Based on Alert dialog example from MUI
 * @see https://mui.com/material-ui/react-dialog/#alerts
 */
export const AlertExample = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button data-testid="alert-open-trigger" variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        data-testid="alert-dialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no
            apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-testid="disagree-button" onClick={handleClose}>
            Disagree
          </Button>
          <Button data-testid="agree-button" onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const dialogContentPart = {
  disagree: {
    locator: byDataTestId('disagree-button'),
    driver: ButtonDriver,
  },
  agree: {
    locator: byDataTestId('agree-button'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const alertExampleScenePart = {
  openTrigger: {
    locator: byDataTestId('alert-open-trigger'),
    driver: ButtonDriver,
  },
  dialog: {
    locator: byDataTestId('alert-dialog'),
    driver: DialogDriver<typeof dialogContentPart>,
    option: {
      content: dialogContentPart,
    },
  },
} satisfies ScenePart;

export const alertDialogExample: IExampleUnit<typeof alertExampleScenePart, JSX.Element> = {
  title: 'Alert dialog',
  scene: alertExampleScenePart,
  ui: <AlertExample />,
};

export const alertDialogTestSuite: TestSuiteInfo<typeof alertDialogExample.scene> = {
  title: 'Alert dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${alertDialogExample.title}`, () => {
      let testEngine: TestEngine<typeof alertDialogExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(alertDialogExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Initially dialog isOpen is false', async () => {
        const val = await testEngine.parts.dialog.isOpen();
        assertEqual(val, false);
      });

      test('agree button should not exist', async () => {
        const val = await testEngine.parts.dialog.content.agree.exists();
        assertEqual(val, false);
      });

      describe('When dialog is open', () => {
        beforeEach(async () => {
          await testEngine.parts.openTrigger.click();
          await testEngine.parts.dialog.waitForOpen();
        });

        test('isOpen turns true', async () => {
          const val = await testEngine.parts.dialog.isOpen();
          assertEqual(val, true);
        });

        test('title should return dialog title content', async () => {
          const val = await testEngine.parts.dialog.getTitle();
          assertEqual(val, "Use Google's location service?");
        });

        test('agree button should exist', async () => {
          const val = await testEngine.parts.dialog.content.agree.exists();
          assertEqual(val, true);
        });

        describe('When agree button is clicked', () => {
          beforeEach(async () => {
            await testEngine.parts.dialog.content.agree.click();
            await testEngine.parts.dialog.waitForClose();
          });

          test('isOpen turns false', async () => {
            const val = await testEngine.parts.dialog.isOpen();
            assertEqual(val, false);
          });
        });
      });
    });
  },
};
