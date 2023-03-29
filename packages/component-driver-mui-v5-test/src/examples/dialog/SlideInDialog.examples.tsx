import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Based on Transitions example from MUI dialog
 * @see https://mui.com/material-ui/react-dialog/#transitions
 */
export const SlideInExample = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button data-testid="slidein-open-trigger" variant="outlined" onClick={handleClickOpen}>
        Open slide in dialog
      </Button>
      <Dialog
        data-testid="slidein-dialog"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="slidein-dialog-title"
        aria-describedby="slidein-dialog-description"
      >
        <DialogTitle id="slidein-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="slidein-dialog-description">
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

export const slideinExampleScenePart = {
  openTrigger: {
    locator: byDataTestId('slidein-open-trigger'),
    driver: ButtonDriver,
  },
  dialog: {
    locator: byDataTestId('slidein-dialog'),
    driver: DialogDriver<typeof dialogContentPart>,
    option: {
      content: dialogContentPart,
    },
  },
} satisfies ScenePart;

export const slideinDialogExample: IExampleUnit<typeof slideinExampleScenePart, JSX.Element> = {
  title: 'SlideIn dialog',
  scene: slideinExampleScenePart,
  ui: <SlideInExample />,
};

export const slideinDialogTestSuite: TestSuiteInfo<typeof slideinDialogExample.scene> = {
  title: 'SlideIn dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${slideinDialogExample.title}`, () => {
      let testEngine: TestEngine<typeof slideinDialogExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(slideinDialogExample.scene, { page });
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
