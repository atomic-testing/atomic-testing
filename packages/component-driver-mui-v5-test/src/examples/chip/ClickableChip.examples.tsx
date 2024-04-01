import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ChipDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import React from 'react';

const names: string[] = ['Jack', 'Lucy', 'Maria'];

//#region Chip
export const ClickableChip: React.FunctionComponent = () => {
  const [selected, setSelected] = React.useState<string | null>(null);
  return (
    <Stack direction={'column'} gap={1}>
      <Stack direction={'row'} gap={0.5}>
        {names.map((name) => (
          <Chip key={name} label={name} onClick={() => setSelected(name)} data-testid={`clickable-${name}`} />
        ))}
      </Stack>
      <Stack direction={'row'} gap={0.5}>
        <span>Selected:</span>
        <span data-testid={'selected'}>{selected}</span>
      </Stack>
    </Stack>
  );
};

export const clickableChipExampleScenePart = {
  jackChip: {
    locator: byDataTestId('clickable-Jack'),
    driver: ChipDriver,
  },
  lucyChip: {
    locator: byDataTestId('clickable-Lucy'),
    driver: ChipDriver,
  },
  mariaChip: {
    locator: byDataTestId('clickable-Maria'),
    driver: ChipDriver,
  },
  selectedDisplay: {
    locator: byDataTestId('selected'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Clickable Alert example from MUI's website
 * @see https://mui.com/material-ui/react-chip#description
 */
export const clickableChipExample: IExampleUnit<typeof clickableChipExampleScenePart, JSX.Element> = {
  title: 'Clickable Chip',
  scene: clickableChipExampleScenePart,
  ui: <ClickableChip />,
};
//#endregion

export const clickableChipTestSuite: TestSuiteInfo<typeof clickableChipExampleScenePart> = {
  title: 'Clickable Chip',
  url: '/chip',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof clickableChipExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(clickableChipExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Click on Jack should display selected as Jack', async () => {
      await testEngine.parts.jackChip.click();
      const selected = await testEngine.parts.selectedDisplay.getText();
      assertEqual(selected, 'Jack');
    });

    test('Click on Maria should display selected as Maria', async () => {
      await testEngine.parts.mariaChip.click();
      const selected = await testEngine.parts.selectedDisplay.getText();
      assertEqual(selected, 'Maria');
    });
  },
};
