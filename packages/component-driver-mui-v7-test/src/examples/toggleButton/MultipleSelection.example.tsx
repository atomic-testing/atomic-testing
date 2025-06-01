import React from 'react';

import { ToggleButtonGroupDriver } from '@atomic-testing/component-driver-mui-v6';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//#region Regular Selection
export const RegularSelectionExample = () => {
  const [formats, setFormats] = React.useState(() => [] as string[]);

  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setFormats(newFormats);
  };

  return (
    <ToggleButtonGroup data-testid='formatting' value={formats} onChange={handleFormat} aria-label='text formatting'>
      <ToggleButton value='bold' aria-label='bold'>
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton value='italic' aria-label='italic'>
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton value='underlined' aria-label='underlined'>
        <FormatUnderlinedIcon />
      </ToggleButton>
      <ToggleButton value='color' aria-label='color' disabled>
        <FormatColorFillIcon />
        <ArrowDropDownIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export const regularSelectionExampleScenePart = {
  formatting: {
    locator: byDataTestId('formatting'),
    driver: ToggleButtonGroupDriver,
  },
} satisfies ScenePart;

/**
 * Multiple selection example from MUI Website
 * @see https://mui.com/material-ui/react-toggle-button/#customization
 */
export const regularSelectionExample: IExampleUnit<typeof regularSelectionExampleScenePart, JSX.Element> = {
  title: 'Multiple Selection',
  scene: regularSelectionExampleScenePart,
  ui: <RegularSelectionExample />,
};
//#endregion

export const regularSelectionButtonTestSuite: TestSuiteInfo<typeof regularSelectionExampleScenePart> = {
  title: 'Multiple Selection',
  url: '/toggle-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${regularSelectionExample.title}`, () => {
      let testEngine: TestEngine<typeof regularSelectionExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(regularSelectionExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Initially there should be no selected value', async () => {
        const value = await testEngine.parts.formatting.getValue();
        assertEqual(value, []);
      });

      test('Selecting a value should update the value', async () => {
        await testEngine.parts.formatting.setValue(['bold', 'italic']);
        const value = await testEngine.parts.formatting.getValue();
        assertEqual(value, ['bold', 'italic']);
      });
    });
  },
};
