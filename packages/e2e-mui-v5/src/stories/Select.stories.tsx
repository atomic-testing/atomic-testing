import { MenuItem, Select } from '@mui/material';
import { ComponentMeta } from '@storybook/react';
import React from 'react';

export default {
  title: 'Select',
  component: Select,
} as ComponentMeta<typeof Select>;

export const secondaryButton = () => <Select
data-testid="demo-simple-select"
label="Age"
>
<MenuItem value={10}>Ten</MenuItem>
<MenuItem value={20}>Twenty</MenuItem>
<MenuItem value={30}>Thirty</MenuItem>
</Select>
