import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';

export const BasicDatePicker: React.FunctionComponent = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2018-08-18T21:11:54'));

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <div data-testid='desktop-date-picker'>
          <DesktopDatePicker
            label='Date desktop'
            inputFormat='MM/DD/YYYY'
            value={value}
            onChange={handleChange}
            renderInput={params => <TextField {...params} />}
          />
        </div>
        <div data-testid='mobile-date-picker'>
          <MobileDatePicker
            label='Date mobile'
            inputFormat='MM/DD/YYYY'
            value={value}
            onChange={handleChange}
            renderInput={params => <TextField {...params} />}
          />
        </div>
        <div data-testid='time-picker'>
          <TimePicker
            label='Time'
            value={value}
            onChange={handleChange}
            renderInput={params => <TextField {...params} />}
          />
        </div>
        <div data-testid='date-time-picker'>
          <DateTimePicker
            label='Date&Time picker'
            value={value}
            onChange={handleChange}
            renderInput={params => <TextField {...params} />}
          />
        </div>
      </Stack>
    </LocalizationProvider>
  );
};

/**
 * Basic DatePicker example from MUI's website
 * @see https://mui.com/material-ui/react-date-pickers/getting-started/
 */
export const basicDatePickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic DatePicker',
  ui: <BasicDatePicker />,
};
