import { MenuItem, Select } from '@mui/material';
import React from 'react';

export const SelectExample: React.FunctionComponent = () => (
  <Select data-testid="demo-simple-select" label="Age">
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </Select>
);
