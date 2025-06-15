import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';

export const BasicDateRangePicker: React.FunctionComponent = () => {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);

  return (
    <div data-testid='date-range-picker'>
      <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'Check-in', end: 'Check-out' }}>
        <DateRangePicker
          value={value}
          onChange={newValue => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

/**
 * Date Range Picker example from MUI's website
 * @see https://mui.com/material-ui/react-date-pickers/date-range-picker/
 */
export const basicDateRangePickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Date Range Picker',
  ui: <BasicDateRangePicker />,
};
