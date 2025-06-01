import React, { useCallback } from 'react';

import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { AutoCompleteDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { top100Films } from './data';

//#region Label AutoComplete
export const BasicAutoComplete: React.FunctionComponent = () => {
  const [selectedValue, setSelectedValue] = React.useState<{ label: string; year: number } | null>(null);
  const [portalEnabledSelectedValue, setPortalEnabledSelectedValue] = React.useState<{
    label: string;
    year: number;
  } | null>(null);

  const onChange = useCallback((_evt, value) => {
    setSelectedValue(value);
  }, []);

  const portalEnabledOnChange = useCallback((_evt, value) => {
    setPortalEnabledSelectedValue(value);
  }, []);
  return (
    <Stack direction='column' gap={'20px'}>
      <Stack direction='column'>
        <Stack direction='row'>
          <span>Portal disabled: </span>
          <span data-testid='selected-label'>{selectedValue?.label}</span>
        </Stack>
        <Autocomplete
          data-testid='basic-auto-complete'
          disablePortal
          options={top100Films}
          onChange={onChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>

      <Stack direction='column'>
        <Stack direction='row'>
          <span>Portal enabled: </span>
          <span data-testid='portal-selected-label'>{portalEnabledSelectedValue?.label}</span>
        </Stack>
        <Autocomplete
          data-testid='portal-auto-complete'
          options={top100Films}
          onChange={portalEnabledOnChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>

      <Stack direction='column'>
        <Stack direction='row'>
          <span>Readonly: </span>
        </Stack>
        <Autocomplete
          data-testid='readonly-auto-complete'
          readOnly
          options={top100Films}
          onChange={onChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>

      <Stack direction='column'>
        <Stack direction='row'>
          <span>Disabled: </span>
        </Stack>
        <Autocomplete
          data-testid='disabled-auto-complete'
          disabled
          options={top100Films}
          onChange={onChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>
    </Stack>
  );
};

export const basicAutoCompleteExampleScenePart = {
  select: {
    locator: byDataTestId('basic-auto-complete'),
    driver: AutoCompleteDriver,
  },
  selectedLabel: {
    locator: byDataTestId('selected-label'),
    driver: HTMLElementDriver,
  },

  portalSelect: {
    locator: byDataTestId('portal-auto-complete'),
    driver: AutoCompleteDriver,
  },
  portalSelectedLabel: {
    locator: byDataTestId('portal-selected-label'),
    driver: HTMLElementDriver,
  },

  readonlySelect: {
    locator: byDataTestId('readonly-auto-complete'),
    driver: AutoCompleteDriver,
  },

  disabledSelect: {
    locator: byDataTestId('disabled-auto-complete'),
    driver: AutoCompleteDriver,
  },
} satisfies ScenePart;

/**
 * Basic AutoComplete example from MUI's website
 * @see https://mui.com/material-ui/react-autocomplete/#combo-box
 */
export const basicAutoCompleteExample: IExampleUnit<typeof basicAutoCompleteExampleScenePart, JSX.Element> = {
  title: 'Basic AutoComplete',
  scene: basicAutoCompleteExampleScenePart,
  ui: <BasicAutoComplete />,
};
//#endregion

export const basicAutoCompleteTestSuite: TestSuiteInfo<typeof basicAutoCompleteExampleScenePart> = {
  title: 'Basic AutoComplete',
  url: '/AutoComplete',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicAutoCompleteExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicAutoCompleteExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    describe('AutoComplete with portal disabled', () => {
      test('should select a value', async () => {
        await testEngine.parts.select.setValue('The Godfather');
        const selected = await testEngine.parts.selectedLabel.getText();
        assertEqual(selected, 'The Godfather');
      });

      test('isDisabled should be false', async () => {
        const isDisabled = await testEngine.parts.select.isDisabled();
        assertEqual(isDisabled, false);
      });

      test('isReadOnly should be false', async () => {
        const isReadOnly = await testEngine.parts.select.isReadonly();
        assertEqual(isReadOnly, false);
      });
    });

    describe('AutoComplete with portal enabled', () => {
      test('should select a value correctly', async () => {
        await testEngine.parts.portalSelect.setValue('The Godfather');
        const selected = await testEngine.parts.portalSelectedLabel.getText();
        assertEqual(selected, 'The Godfather');
      });

      test('isDisabled should be false', async () => {
        const isDisabled = await testEngine.parts.portalSelect.isDisabled();
        assertEqual(isDisabled, false);
      });

      test('isReadOnly should be false', async () => {
        const isReadOnly = await testEngine.parts.portalSelect.isReadonly();
        assertEqual(isReadOnly, false);
      });
    });

    test('Readonly Auto complete should be readonly', async () => {
      const isReadOnly = await testEngine.parts.readonlySelect.isReadonly();
      assertEqual(isReadOnly, true);
    });

    test('Disabled Auto complete should be disabled', async () => {
      const isDisabled = await testEngine.parts.disabledSelect.isDisabled();
      assertEqual(isDisabled, true);
    });
  },
};
