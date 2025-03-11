import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

//#region Example
export const LabelCheckbox = () => {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked data-testid='apple' value='apple' />} label='Apple' />
      <FormControlLabel control={<Checkbox data-testid='banana' value='banana' />} label='Banana' />
    </FormGroup>
  );
};

export const labelCheckboxExampleScenePart = {
  apple: {
    locator: byDataTestId('apple'),
    driver: CheckboxDriver,
  },
  banana: {
    locator: byDataTestId('banana'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Icon button example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#label
 */
export const labelCheckboxExample: IExampleUnit<typeof labelCheckboxExampleScenePart, JSX.Element> = {
  title: 'Label Checkbox',
  scene: labelCheckboxExampleScenePart,
  ui: <LabelCheckbox />,
};
//#endregion

export const labelCheckboxTestSuite: TestSuiteInfo<typeof labelCheckboxExample.scene> = {
  title: 'Icon & Label',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${labelCheckboxExample.title}`, () => {
      let testEngine: TestEngine<typeof labelCheckboxExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(labelCheckboxExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`apple is checked initially`, async () => {
        const selected = await testEngine.parts.apple.isSelected();
        assertEqual(selected, true);
      });

      test(`banana is not checked initially`, async () => {
        const selected = await testEngine.parts.banana.isSelected();
        assertEqual(selected, false);
      });

      test(`switching apple to unchecked should return false upon completion`, async () => {
        await testEngine.parts.apple.setSelected(false);
        const selected = await testEngine.parts.apple.isSelected();
        assertEqual(selected, false);
      });
    });
  },
};
