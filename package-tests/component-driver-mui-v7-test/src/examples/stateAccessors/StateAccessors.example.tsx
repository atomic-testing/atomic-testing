import { IExampleUIUnit } from '@atomic-testing/core';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React from 'react';

const marks = [
  { value: 0, label: '0°C' },
  { value: 20, label: '20°C' },
  { value: 37, label: '37°C' },
];

/**
 * A grid of components in specific states (required, error, loading, disabled, dot/invisible
 * badge, multi-select, marked slider, …) used to exercise the cross-cutting state accessors.
 */
export const StateAccessors: React.FunctionComponent = () => {
  return (
    <Box sx={{ display: 'grid', gap: 2, p: 2 }}>
      <TextField data-testid='required-error-field' label='Email' required error placeholder='you@example.com' />
      <TextField data-testid='plain-field' label='Name' />

      <FormControlLabel control={<Checkbox data-testid='required-checkbox' required />} label='Accept' />
      <FormControlLabel control={<Switch data-testid='required-switch' required />} label='Enable' />

      <Select data-testid='multi-select' multiple value={['1', '2']} required>
        <MenuItem value='1'>One</MenuItem>
        <MenuItem value='2'>Two</MenuItem>
        <MenuItem value='3'>Three</MenuItem>
      </Select>

      <Button data-testid='loading-button' loading>
        Save
      </Button>
      <Button data-testid='disabled-link-button' href='#' disabled>
        Link
      </Button>

      <Chip data-testid='disabled-chip' label='Tag' disabled />

      <Badge data-testid='dot-badge' variant='dot' color='primary'>
        <span>A</span>
      </Badge>
      <Badge data-testid='invisible-badge' badgeContent={4} invisible>
        <span>B</span>
      </Badge>
      <Badge data-testid='visible-badge' badgeContent={4} color='primary'>
        <span>C</span>
      </Badge>

      <Slider
        data-testid='marked-slider'
        defaultValue={20}
        min={0}
        max={100}
        step={10}
        marks={marks}
        valueLabelDisplay='auto'
        getAriaValueText={(v: number) => `${v} degrees`}
      />

      <ToggleButtonGroup data-testid='toggle-group' value='left' exclusive>
        <ToggleButton value='left'>Left</ToggleButton>
        <ToggleButton value='center' disabled>
          Center
        </ToggleButton>
        <ToggleButton value='right'>Right</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export const stateAccessorsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'State Accessors',
  ui: <StateAccessors />,
};
