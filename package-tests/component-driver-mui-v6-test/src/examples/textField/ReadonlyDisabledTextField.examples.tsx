import { JSX } from 'react';
import { IExampleUIUnit } from '@atomic-testing/core';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import { selectTextFieldExampleData } from './SelectTextField.examples';

//#region Readonly and disabled TextField
const ExampleLayout = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 1rem;
`;

export const ReadonlyAndDisabledTextField = () => {
  return (
    <ExampleLayout>
      <TextField disabled data-testid='text-disabled' label='Disabled' defaultValue='Hello World' />
      <TextField
        data-testid='text-readonly'
        label='Read Only'
        defaultValue='Hello World'
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        disabled
        data-testid='multiline-disabled'
        label='Disabled'
        multiline
        rows={3}
        defaultValue='Hello World'
      />
      <TextField
        data-testid='multiline-readonly'
        label='Read Only'
        multiline
        rows={3}
        defaultValue='Hello World'
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField disabled data-testid='select-disabled' label='Disabled' select defaultValue='60'>
        {selectTextFieldExampleData.options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        data-testid='select-readonly'
        label='Read Only'
        select
        defaultValue='20'
        InputProps={{
          readOnly: true,
        }}>
        {selectTextFieldExampleData.options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        disabled
        data-testid='native-select-disabled'
        label='Native Disabled'
        select
        defaultValue='60'
        SelectProps={{ native: true }}>
        {selectTextFieldExampleData.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
      <TextField
        data-testid='native-select-readonly'
        label='Native Read Only'
        select
        defaultValue='20'
        SelectProps={{ native: true, readOnly: true }}>
        {selectTextFieldExampleData.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    </ExampleLayout>
  );
};

export const readonlyAndDisabledTextFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Readonly & Disabled TextField',
  ui: <ReadonlyAndDisabledTextField />,
};
//#endregion
