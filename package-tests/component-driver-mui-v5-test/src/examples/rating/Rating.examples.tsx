import { IExampleUIUnit } from '@atomic-testing/core';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
    <Stack direction='column'>
      <Typography>Basic</Typography>
      <Rating data-testid='basic' precision={0.5} value={basicValue} onChange={basicValueChange} />

      <Divider />

      <Typography>Readonly</Typography>
      <Rating data-testid='readonly' precision={0.5} value={2.5} readOnly />

      <Divider />

      <Typography>Readonly with custom label</Typography>
      <Rating data-testid='readonly-custom-label' aria-label='Great movie' value={3} readOnly />

      <Divider />

      <Typography>Disabled</Typography>
      <Rating data-testid='disabled' value={basicValue} disabled />

      <Divider />

      <Typography>Initially Empty</Typography>
      <Rating data-testid='empty' value={initiallyEmptyValue} onChange={initiallyEmptyValueChange} />
    </Stack>
  );
};

/**
 * Basic Rating example from MUI's website
 * @see https://mui.com/material-ui/react-rating
 */
export const basicRatingUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Rating',
  ui: <BasicRating />,
};
//#endregion
