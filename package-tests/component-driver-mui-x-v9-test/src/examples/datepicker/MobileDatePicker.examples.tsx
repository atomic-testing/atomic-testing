import { IExampleUIUnit } from '@atomic-testing/core';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import React, { JSX } from 'react';

export const BasicMobileDatePicker: React.FunctionComponent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div data-testid='basic-mobile-date-picker'>
        <MobileDatePicker defaultValue={new Date(2026, 5, 27)} />
      </div>
      {/* Second instance with a different value to prove locator disambiguation. */}
      <div data-testid='second-mobile-date-picker'>
        <MobileDatePicker defaultValue={new Date(2020, 0, 15)} />
      </div>
    </LocalizationProvider>
  );
};

/**
 * Basic MobileDatePicker example from MUI's website
 * @see https://mui.com/x/react-date-pickers/date-picker/
 */
export const basicMobileDatePickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic MobileDatePicker',
  ui: <BasicMobileDatePicker />,
};
