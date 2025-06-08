import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//#region Regular Selection
export const RegularSelectionExample = () => {
  const [formats, setFormats] = React.useState(() => [] as string[]);

  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setFormats(newFormats);
  };

  return (
    <ToggleButtonGroup data-testid='formatting' value={formats} onChange={handleFormat} aria-label='text formatting'>
      <ToggleButton value='bold' aria-label='bold'>
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton value='italic' aria-label='italic'>
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton value='underlined' aria-label='underlined'>
        <FormatUnderlinedIcon />
      </ToggleButton>
      <ToggleButton value='color' aria-label='color' disabled>
        <FormatColorFillIcon />
        <ArrowDropDownIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

/**
 * Multiple selection example from MUI Website
 * @see https://mui.com/material-ui/react-toggle-button/#customization
 */
export const regularSelectionUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Multiple Selection',
  ui: <RegularSelectionExample />,
};
//#endregion
