import React from 'react';

import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

//#region Example
export const IndeterminateCheckbox = () => {
  const [checked, setChecked] = React.useState([true, false]);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        data-testid='child1'
        label='Child 1'
        control={<Checkbox data-testid='child1' checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label='Child 2'
        control={<Checkbox data-testid='child2' checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        label='Parent'
        control={
          <Checkbox
            data-testid='parent'
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      />
      {children}
    </div>
  );
};

export const indeterminateCheckboxExampleScenePart = {
  parent: {
    locator: byDataTestId('parent'),
    driver: CheckboxDriver,
  },
  child1: {
    locator: byDataTestId('child1'),
    driver: CheckboxDriver,
  },
  child2: {
    locator: byDataTestId('child2'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Icon button example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#indeterminate
 */
export const indeterminateCheckboxExample: IExampleUnit<typeof indeterminateCheckboxExampleScenePart, JSX.Element> = {
  title: 'Indeterminate Checkbox',
  scene: indeterminateCheckboxExampleScenePart,
  ui: <IndeterminateCheckbox />,
};
//#endregion

export const indeterminateCheckboxTestSuite: TestSuiteInfo<typeof indeterminateCheckboxExample.scene> = {
  title: 'Indeterminate Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${indeterminateCheckboxExample.title}`, () => {
      let testEngine: TestEngine<typeof indeterminateCheckboxExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(indeterminateCheckboxExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`parent is not checked initially`, async () => {
        const selected = await testEngine.parts.parent.isSelected();
        assertEqual(selected, false);
      });

      test(`parent is indeterminate initially`, async () => {
        const selected = await testEngine.parts.parent.isIndeterminate();
        assertEqual(selected, true);
      });

      describe(`When checking all the children`, () => {
        beforeEach(async () => {
          await testEngine.parts.child1.setSelected(true);
          await testEngine.parts.child2.setSelected(true);
        });

        test(`parent should be checked`, async () => {
          const selected = await testEngine.parts.parent.isSelected();
          assertEqual(selected, true);
        });

        test(`parent should not be indeterminate`, async () => {
          const selected = await testEngine.parts.parent.isIndeterminate();
          assertEqual(selected, false);
        });
      });

      describe(`When unchecking all the children`, () => {
        beforeEach(async () => {
          await testEngine.parts.child1.setSelected(false);
          await testEngine.parts.child2.setSelected(false);
        });

        test(`parent should not be checked`, async () => {
          const selected = await testEngine.parts.parent.isSelected();
          assertEqual(selected, false);
        });

        test(`parent should not be indeterminate`, async () => {
          const selected = await testEngine.parts.parent.isIndeterminate();
          assertEqual(selected, false);
        });
      });

      describe('When checking parent', () => {
        beforeEach(async () => {
          await testEngine.parts.parent.setSelected(true);
        });

        test(`parent should not be indeterminate`, async () => {
          const selected = await testEngine.parts.child1.isIndeterminate();
          assertEqual(selected, false);
        });

        test(`child1 should be checked`, async () => {
          const selected = await testEngine.parts.child1.isSelected();
          assertEqual(selected, true);
        });

        test(`child2 should be checked`, async () => {
          const selected = await testEngine.parts.child2.isSelected();
          assertEqual(selected, true);
        });
      });

      describe('When unchecking parent', () => {
        beforeEach(async () => {
          await testEngine.parts.parent.setSelected(false);
        });

        test(`parent should not be indeterminate`, async () => {
          const selected = await testEngine.parts.child1.isIndeterminate();
          assertEqual(selected, false);
        });

        test(`child1 should not be checked`, async () => {
          const selected = await testEngine.parts.child1.isSelected();
          assertEqual(selected, false);
        });

        test(`child2 should not be checked`, async () => {
          const selected = await testEngine.parts.child2.isSelected();
          assertEqual(selected, false);
        });
      });
    });
  },
};
