import { IExampleUIUnit } from '@atomic-testing/core';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { JSX } from 'react';

export const BasicDateRangePicker: React.FunctionComponent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div data-testid='basic-date-range-picker'>
        <DateRangePicker defaultValue={[new Date(2026, 5, 27), new Date(2026, 6, 4)]} />
      </div>
    </LocalizationProvider>
  );
};

/**
 * Basic DateRangePicker (Pro) example from MUI's website, using the default
 * single-input range field.
 * @see https://mui.com/x/react-date-pickers/date-range-picker/
 */
export const basicDateRangePickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic DateRangePicker',
  ui: <BasicDateRangePicker />,
};
