import { ExclusiveToggleButtonGroupDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';

//#region Exclusive Selection
export const ExclusiveSelectionExample = () => {
  const [alignment, setAlignment] = React.useState<string | null>(null);

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      data-testid="alignment"
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <FormatAlignLeftIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <FormatAlignCenterIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <FormatAlignRightIcon />
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        <FormatAlignJustifyIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export const exclusiveSelectionExampleScenePart = {
  alignment: {
    locator: byDataTestId('alignment'),
    driver: ExclusiveToggleButtonGroupDriver,
  },
} satisfies ScenePart;

/**
 * Editor Toolbar Example from MUI Website
 * @see https://mui.com/material-ui/react-toggle-button/#customization
 */
export const exclusiveSelectionExample: IExampleUnit<typeof exclusiveSelectionExampleScenePart, JSX.Element> = {
  title: 'Exclusive Selection',
  scene: exclusiveSelectionExampleScenePart,
  ui: <ExclusiveSelectionExample />,
};
//#endregion

export const exclusiveSelectionTestSuite: TestSuiteInfo<typeof exclusiveSelectionExampleScenePart> = {
  title: 'Exclusive Selection',
  url: '/toggle-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${exclusiveSelectionExample.title}`, () => {
      let testEngine: TestEngine<typeof exclusiveSelectionExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(exclusiveSelectionExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Initially there should be no selected value', async () => {
        const value = await testEngine.parts.alignment.getValue();
        assertEqual(value, null);
      });

      test('Selecting a value should update the value', async () => {
        await testEngine.parts.alignment.setValue('center');
        const value = await testEngine.parts.alignment.getValue();
        assertEqual(value, 'center');
      });
    });
  },
};
