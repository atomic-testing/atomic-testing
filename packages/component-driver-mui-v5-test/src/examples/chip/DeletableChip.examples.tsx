import React, { useCallback } from 'react';

import { ChipDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const names: string[] = ['Jack', 'Lucy', 'Maria'];

//#region Chip
export const DeletableChip: React.FunctionComponent = () => {
  const [choices, setChoices] = React.useState<ReadonlySet<string>>(new Set(names));

  const onDelete = useCallback(
    (name: string) => {
      const newChoices = new Set(choices);
      newChoices.delete(name);
      setChoices(newChoices);
    },
    [choices]
  );

  return (
    <Stack direction={'column'} gap={1}>
      <Stack direction={'row'} gap={0.5}>
        {Array.from(choices).map(name => (
          <Chip key={name} label={name} onDelete={() => onDelete(name)} data-testid={`deletable-${name}`} />
        ))}
      </Stack>
    </Stack>
  );
};

export const deletableChipExampleScenePart = {
  jackChip: {
    locator: byDataTestId('deletable-Jack'),
    driver: ChipDriver,
  },
  lucyChip: {
    locator: byDataTestId('deletable-Lucy'),
    driver: ChipDriver,
  },
  mariaChip: {
    locator: byDataTestId('deletable-Maria'),
    driver: ChipDriver,
  },
} satisfies ScenePart;

/**
 * Deletable Alert example from MUI's website
 * @see https://mui.com/material-ui/react-chip#description
 */
export const deletableChipExample: IExampleUnit<typeof deletableChipExampleScenePart, JSX.Element> = {
  title: 'Deletable Chip',
  scene: deletableChipExampleScenePart,
  ui: <DeletableChip />,
};
//#endregion

export const deletableChipTestSuite: TestSuiteInfo<typeof deletableChipExampleScenePart> = {
  title: 'Deletable Chip',
  url: '/chip',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof deletableChipExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(deletableChipExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    describe('When Lucy is removed', () => {
      beforeEach(async () => {
        await testEngine.parts.lucyChip.clickRemove();
      });

      test('Jack should remain', async () => {
        const shouldExist = await testEngine.parts.jackChip.exists();
        assertEqual(shouldExist, true);
      });

      test('Maria should remain', async () => {
        const shouldExist = await testEngine.parts.mariaChip.exists();
        assertEqual(shouldExist, true);
      });

      test('Lucy should not exist', async () => {
        const shouldExist = await testEngine.parts.lucyChip.exists();
        assertEqual(shouldExist, false);
      });
    });
  },
};
