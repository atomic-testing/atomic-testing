import { RatingDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Divider, Rating, Stack, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';

//#region Label rating
export const BasicRating: React.FunctionComponent = () => {
  const [basicValue, setBasicValue] = useState<number | null>(2);
  const [initiallyEmptyValue, setInitiallyEmptyValue] = useState<number | null>(null);

  const basicValueChange = useCallback((_: React.SyntheticEvent, value: number | null) => {
    setBasicValue(value);
  }, []);

  const initiallyEmptyValueChange = useCallback((_: React.SyntheticEvent, value: number | null) => {
    setInitiallyEmptyValue(value);
  }, []);

  return (
    <Stack direction="column">
      <Typography>Basic</Typography>
      <Rating data-testid="basic" precision={0.5} value={basicValue} onChange={basicValueChange} />

      <Divider />

      <Typography>Readonly</Typography>
      <Rating data-testid="readonly" aria-label="SSS" precision={0.5} value={2.5} readOnly />

      <Divider />

      <Typography>Disabled</Typography>
      <Rating data-testid="disabled" value={basicValue} disabled />

      <Divider />

      <Typography>Initially Empty</Typography>
      <Rating data-testid="empty" value={initiallyEmptyValue} onChange={initiallyEmptyValueChange} />
    </Stack>
  );
};

export const basicRatingExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: RatingDriver,
  },
  readonly: {
    locator: byDataTestId('readonly'),
    driver: RatingDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: RatingDriver,
  },
  initiallyEmpty: {
    locator: byDataTestId('empty'),
    driver: RatingDriver,
  },
} satisfies ScenePart;

/**
 * Basic Rating example from MUI's website
 * @see https://mui.com/material-ui/react-rating
 */
export const basicRatingExample: IExampleUnit<typeof basicRatingExampleScenePart, JSX.Element> = {
  title: 'Basic Rating',
  scene: basicRatingExampleScenePart,
  ui: <BasicRating />,
};
//#endregion

export const ratingTestSuite: TestSuiteInfo<typeof basicRatingExampleScenePart> = {
  title: 'Basic Rating',
  url: '/rating',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicRatingExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicRatingExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test(`Basic rating's Value should be 2`, async () => {
      const value = await testEngine.parts.basic.getValue();
      assertEqual(value, 2);
    });

    test(`Disabled rating's value should be 2`, async () => {
      const value = await testEngine.parts.disabled.getValue();
      assertEqual(value, 2);
    });

    describe('Setting rating value to a valid new value', () => {
      const targetValue = 3;
      let success: boolean;
      beforeEach(async () => {
        success = await testEngine.parts.basic.setValue(targetValue);
      });

      test(`Success should be true`, async () => {
        assertEqual(success, true);
      });

      test(`The component's value should be set to the new value`, async () => {
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, targetValue);
      });
    });

    // TODO: Test is skipped because of Playwright's issue with setting a fraction value
    // @see https://github.com/atomic-testing/atomic-testing/issues/86
    describe.skip('Setting rating value to a valid new fraction value', () => {
      const targetValue = 3;
      let success: boolean;
      beforeEach(async () => {
        success = await testEngine.parts.basic.setValue(targetValue);
      });

      test(`Success of setting fraction value should be true`, async () => {
        assertEqual(success, true);
      });

      test(`The component's value should be set to the new fraction value`, async () => {
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, targetValue);
      });
    });

    describe('Setting rating value to an invalid new value', () => {
      const targetValue = 6;
      let success: boolean;
      beforeEach(async () => {
        success = await testEngine.parts.basic.setValue(targetValue);
      });

      test(`Success should be false`, async () => {
        assertEqual(success, false);
      });

      test(`The component's value should remain to be the same old value`, async () => {
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, 2);
      });
    });

    describe('Setting rating value to null', () => {
      const targetValue = null;
      let success: boolean;
      beforeEach(async () => {
        success = await testEngine.parts.basic.setValue(targetValue);
      });

      test(`Setting to null success should be true`, async () => {
        assertEqual(success, true);
      });

      // TODO: https://github.com/atomic-testing/atomic-testing/issues/68
      test.skip(`The component's value should remain to be null`, async () => {
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, null);
      });
    });
  },
};
