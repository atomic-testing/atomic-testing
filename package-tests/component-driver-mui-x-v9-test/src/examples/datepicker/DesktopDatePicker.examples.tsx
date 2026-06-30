import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { JSX } from 'react';

export const BasicDesktopDatePicker: React.FunctionComponent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div data-testid='basic-desktop-date-picker'>
        <DesktopDatePicker defaultValue={new Date(2026, 5, 27)} />
      </div>
      {/* Second instance with a different value to prove locator disambiguation. */}
      <div data-testid='second-desktop-date-picker'>
        <DesktopDatePicker defaultValue={new Date(2020, 0, 15)} />
      </div>
    </LocalizationProvider>
  );
};

/**
 * Basic DesktopDatePicker example from MUI's website
 * @see https://mui.com/x/react-date-pickers/date-picker/
 */
export const basicDesktopDatePickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic DesktopDatePicker',
  ui: <BasicDesktopDatePicker />,
};
