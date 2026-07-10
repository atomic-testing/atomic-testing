import { IExampleUIUnit } from '@atomic-testing/core';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { JSX } from 'react';

export const BasicDateTimePicker: React.FunctionComponent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div data-testid='basic-datetime-picker'>
        <DesktopDateTimePicker defaultValue={new Date(2026, 5, 27, 14, 30)} />
      </div>
      {/* Second instance with a different value to prove locator disambiguation. */}
      <div data-testid='second-datetime-picker'>
        <DesktopDateTimePicker defaultValue={new Date(2020, 0, 15, 9, 5)} />
      </div>
    </LocalizationProvider>
  );
};

/**
 * Basic desktop DateTimePicker example from MUI's website
 * @see https://mui.com/x/react-date-pickers/date-time-picker/
 */
export const basicDateTimePickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic DateTimePicker',
  ui: <BasicDateTimePicker />,
};
