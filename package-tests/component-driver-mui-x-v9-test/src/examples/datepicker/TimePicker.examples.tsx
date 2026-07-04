import { IExampleUIUnit } from '@atomic-testing/core';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { JSX } from 'react';

export const BasicTimePicker: React.FunctionComponent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div data-testid='basic-time-picker'>
        <DesktopTimePicker defaultValue={new Date(2026, 5, 27, 14, 30)} />
      </div>
      {/* Second instance with a different value to prove locator disambiguation. */}
      <div data-testid='second-time-picker'>
        <DesktopTimePicker defaultValue={new Date(2026, 5, 27, 9, 5)} />
      </div>
    </LocalizationProvider>
  );
};

/**
 * Basic desktop TimePicker example from MUI's website
 * @see https://mui.com/x/react-date-pickers/time-picker/
 */
export const basicTimePickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic TimePicker',
  ui: <BasicTimePicker />,
};
