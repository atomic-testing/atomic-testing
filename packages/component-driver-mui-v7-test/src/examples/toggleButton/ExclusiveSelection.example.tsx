import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//#region Exclusive Selection
export const ExclusiveSelectionExample = () => {
  const [alignment, setAlignment] = React.useState<string | null>(null);

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      data-testid='alignment'
      aria-label='text alignment'>
      <ToggleButton value='left' aria-label='left aligned'>
        <FormatAlignLeftIcon />
      </ToggleButton>
      <ToggleButton value='center' aria-label='centered'>
        <FormatAlignCenterIcon />
      </ToggleButton>
      <ToggleButton value='right' aria-label='right aligned'>
        <FormatAlignRightIcon />
      </ToggleButton>
      <ToggleButton value='justify' aria-label='justified' disabled>
        <FormatAlignJustifyIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

/**
 * Editor Toolbar Example from MUI Website
 * @see https://mui.com/material-ui/react-toggle-button/#customization
 */
export const exclusiveSelectionUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Exclusive Selection',
  ui: <ExclusiveSelectionExample />,
};
//#endregion
