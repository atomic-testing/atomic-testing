import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { selectTextFieldExampleData } from './SelectTextField.examples';

//#region Readonly and disabled TextField
const ExampleLayout = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 1rem;
`;
export const ReadonlyAndDisabledTextField = () => {
  return (
    <ExampleLayout>
      <TextField disabled data-testid="text-disabled" label="Disabled" defaultValue="Hello World" />
      <TextField
        data-testid="text-readonly"
        label="Read Only"
        defaultValue="Hello World"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        disabled
        data-testid="multiline-disabled"
        label="Disabled"
        multiline
        rows={3}
        defaultValue="Hello World"
      />
      <TextField
        data-testid="multiline-readonly"
        label="Read Only"
        multiline
        rows={3}
        defaultValue="Hello World"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField disabled data-testid="select-disabled" label="Disabled" select defaultValue="60">
        {selectTextFieldExampleData.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        data-testid="select-readonly"
        label="Read Only"
        select
        defaultValue="20"
        InputProps={{
          readOnly: true,
        }}
      >
        {selectTextFieldExampleData.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        disabled
        data-testid="native-select-disabled"
        label="Native Disabled"
        select
        defaultValue="60"
        SelectProps={{ native: true }}
      >
        {selectTextFieldExampleData.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
      <TextField
        data-testid="native-select-readonly"
        label="Native Read Only"
        select
        defaultValue="20"
        SelectProps={{ native: true, readOnly: true }}
      >
        {selectTextFieldExampleData.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    </ExampleLayout>
  );
};

export const readonlyAndDisabledTextFieldExampleScenePart = {
  textDisabled: {
    locator: byDataTestId('text-disabled'),
    driver: TextFieldDriver,
  },
  textReadonly: {
    locator: byDataTestId('text-readonly'),
    driver: TextFieldDriver,
  },
  multilineDisabled: {
    locator: byDataTestId('multiline-disabled'),
    driver: TextFieldDriver,
  },
  multilineReadonly: {
    locator: byDataTestId('multiline-readonly'),
    driver: TextFieldDriver,
  },
  selectDisabled: {
    locator: byDataTestId('select-disabled'),
    driver: TextFieldDriver,
  },
  selectReadonly: {
    locator: byDataTestId('select-readonly'),
    driver: TextFieldDriver,
  },
  nativeSelectDisabled: {
    locator: byDataTestId('native-select-disabled'),
    driver: TextFieldDriver,
  },
  nativeSelectReadonly: {
    locator: byDataTestId('native-select-readonly'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

export const readonlyAndDisabledTextFieldExample: IExampleUnit<
  typeof readonlyAndDisabledTextFieldExampleScenePart,
  JSX.Element
> = {
  title: 'Readonly & Disabled TextField',
  scene: readonlyAndDisabledTextFieldExampleScenePart,
  ui: <ReadonlyAndDisabledTextField />,
};
//#endregion

export const readonlyAndDisabledTextFieldTestSuite: TestSuiteInfo<typeof readonlyAndDisabledTextFieldExample.scene> = {
  title: 'Readonly & Disabled TextField',
  url: '/textfield',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${readonlyAndDisabledTextFieldExample.title}`, () => {
      let testEngine: TestEngine<typeof readonlyAndDisabledTextFieldExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(readonlyAndDisabledTextFieldExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Readonly TextField should be readonly`, async () => {
        const isReadOnly = await testEngine.parts.textReadonly.isReadonly();
        assertEqual(isReadOnly, true);
      });

      test(`Readonly TextField value should be Hello World`, async () => {
        const value = await testEngine.parts.textReadonly.getValue();
        assertEqual(value, 'Hello World');
      });

      test(`Disabled TextField should be disabled`, async () => {
        const isDisabled = await testEngine.parts.textDisabled.isDisabled();
        assertEqual(isDisabled, true);
      });

      test(`Disabled TextField value should be Hello World`, async () => {
        const value = await testEngine.parts.textDisabled.getValue();
        assertEqual(value, 'Hello World');
      });

      test(`Readonly Multi-TextField should be readonly`, async () => {
        const isReadOnly = await testEngine.parts.multilineReadonly.isReadonly();
        assertEqual(isReadOnly, true);
      });

      test(`Readonly Multi-TextField value should be Hello World`, async () => {
        const value = await testEngine.parts.multilineReadonly.getValue();
        assertEqual(value, 'Hello World');
      });

      test(`Disabled Multi-TextField should be disabled`, async () => {
        const isDisabled = await testEngine.parts.multilineDisabled.isDisabled();
        assertEqual(isDisabled, true);
      });

      test(`Disabled Multi-TextField value should be Hello World`, async () => {
        const value = await testEngine.parts.multilineDisabled.getValue();
        assertEqual(value, 'Hello World');
      });

      test(`Readonly Select TextField should be readonly`, async () => {
        const isReadOnly = await testEngine.parts.selectReadonly.isReadonly();
        assertEqual(isReadOnly, true);
      });

      test(`Readonly Select TextField value should be 20`, async () => {
        const value = await testEngine.parts.selectReadonly.getValue();
        assertEqual(value, '20');
      });

      test(`Disabled Select TextField should be disabled`, async () => {
        const isDisabled = await testEngine.parts.selectDisabled.isDisabled();
        assertEqual(isDisabled, true);
      });

      test(`Disabled Select TextField value should be 60`, async () => {
        const value = await testEngine.parts.selectDisabled.getValue();
        assertEqual(value, '60');
      });

      test(`Readonly Native Select TextField should be readonly`, async () => {
        const isReadOnly = await testEngine.parts.nativeSelectReadonly.isReadonly();
        assertEqual(isReadOnly, true);
      });

      test(`Readonly Native Select TextField value should be 20`, async () => {
        const value = await testEngine.parts.nativeSelectReadonly.getValue();
        assertEqual(value, '20');
      });

      test(`Disabled Native Select TextField should be disabled`, async () => {
        const isDisabled = await testEngine.parts.nativeSelectDisabled.isDisabled();
        assertEqual(isDisabled, true);
      });

      test(`Disabled Native Select TextField value should be 60`, async () => {
        const value = await testEngine.parts.nativeSelectDisabled.getValue();
        assertEqual(value, '60');
      });
    });
  },
};
