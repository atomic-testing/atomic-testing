import { RatingDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { Divider, Rating, Stack, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';

//#region Label checkbox
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
 * Basic TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#basic-textfield
 */
export const basicRatingExample: IExampleUnit<typeof basicRatingExampleScenePart, JSX.Element> = {
  title: 'Basic TextField',
  scene: basicRatingExampleScenePart,
  ui: <BasicRating />,
};
//#endregion

export const ratingExamples = [basicRatingExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
