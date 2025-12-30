import React, { useCallback } from 'react';
import { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { top100Films } from './data';

//#region Label AutoComplete
export const BasicAutoComplete: React.FunctionComponent = () => {
  const [selectedValue, setSelectedValue] = React.useState<{ label: string; year: number } | null>(null);
  const [portalEnabledSelectedValue, setPortalEnabledSelectedValue] = React.useState<{
    label: string;
    year: number;
  } | null>(null);

  const onChange = useCallback((_evt, value) => {
    setSelectedValue(value);
  }, []);

  const portalEnabledOnChange = useCallback((_evt, value) => {
    setPortalEnabledSelectedValue(value);
  }, []);
  return (
    <Stack direction='column' gap={'20px'}>
      <Stack direction='column'>
        <Stack direction='row'>
          <span>Portal disabled: </span>
          <span data-testid='selected-label'>{selectedValue?.label}</span>
        </Stack>
        <Autocomplete
          data-testid='basic-auto-complete'
          disablePortal
          options={top100Films}
          onChange={onChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>

      <Stack direction='column'>
        <Stack direction='row'>
          <span>Portal enabled: </span>
          <span data-testid='portal-selected-label'>{portalEnabledSelectedValue?.label}</span>
        </Stack>
        <Autocomplete
          data-testid='portal-auto-complete'
          options={top100Films}
          onChange={portalEnabledOnChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>

      <Stack direction='column'>
        <Stack direction='row'>
          <span>Readonly: </span>
        </Stack>
        <Autocomplete
          data-testid='readonly-auto-complete'
          readOnly
          options={top100Films}
          onChange={onChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>

      <Stack direction='column'>
        <Stack direction='row'>
          <span>Disabled: </span>
        </Stack>
        <Autocomplete
          data-testid='disabled-auto-complete'
          disabled
          options={top100Films}
          onChange={onChange}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Movie' />}
        />
      </Stack>
    </Stack>
  );
};

/**
 * Basic AutoComplete example from MUI's website
 * @see https://mui.com/material-ui/react-autocomplete/#combo-box
 */
export const basicAutoCompleteUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic AutoComplete',
  ui: <BasicAutoComplete />,
};
//#endregion
