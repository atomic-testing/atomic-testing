import { SelectDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';

//#region Example
export const NativeSelectExample = () => (
  <FormControl fullWidth>
    <InputLabel variant="standard" htmlFor="uncontrolled-native">
      Age
    </InputLabel>
    <NativeSelect
      data-testid="native-select"
      defaultValue={30}
      inputProps={{
        name: 'age',
        id: 'uncontrolled-native',
      }}
    >
      <option value={10}>Ten</option>
      <option value={20}>Twenty</option>
      <option value={30}>Thirty</option>
    </NativeSelect>
  </FormControl>
);

export const nativeSelectExampleScenePart = {
  select: {
    locator: byDataTestId('native-select'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

/**
 * Native select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#native-select
 */
export const nativeSelectExample: IExampleUnit<typeof nativeSelectExampleScenePart, JSX.Element> = {
  title: 'Native Select',
  scene: nativeSelectExampleScenePart,
  ui: <NativeSelectExample />,
};
//#endregion

export const nativeSelectTestSuite: TestSuiteInfo<typeof nativeSelectExample.scene> = {
  title: 'Native select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${nativeSelectExample.title}`, () => {
      let testEngine: TestEngine<typeof nativeSelectExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(nativeSelectExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`setValue of native select`, async () => {
        const targetValue = '30';
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
