import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Box, TextField } from '@mui/material';

//#region Multiline TextField
export const MultilineTextField = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField data-testid="multiline" label="Multiline" multiline rows={4} defaultValue="Default Value" />
    </Box>
  );
};

export const multilineTextFieldExampleScenePart = {
  multiline: {
    locator: byDataTestId('multiline'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Multiline TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#multiline
 */
export const multilineTextFieldExample: IExampleUnit<typeof multilineTextFieldExampleScenePart, JSX.Element> = {
  title: 'Multiline TextField',
  scene: multilineTextFieldExampleScenePart,
  ui: <MultilineTextField />,
};
//#endregion

export const multilineTextFieldTestSuite: TestSuiteInfo<typeof multilineTextFieldExample.scene> = {
  title: 'Multiline TextField',
  url: '/textfield',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${multilineTextFieldExample.title}`, () => {
      let testEngine: TestEngine<typeof multilineTextFieldExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(multilineTextFieldExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Label should be Multiline`, async () => {
        const label = await testEngine.parts.multiline.getLabel();
        assertEqual(label, 'Multiline');
      });

      test(`Helper text should be undefined`, async () => {
        const helperText = await testEngine.parts.multiline.getHelperText();
        assertEqual(helperText, undefined);
      });

      test(`Value should be "Default Value" as assigned`, async () => {
        const value = await testEngine.parts.multiline.getValue();
        assertEqual(value, 'Default Value');
      });

      test(`Alter value should change the value`, async () => {
        await testEngine.parts.multiline.setValue('Hello World');
        const value = await testEngine.parts.multiline.getValue();
        assertEqual(value, 'Hello World');
      });
    });
  },
};
