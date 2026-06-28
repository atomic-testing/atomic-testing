import { IExampleUIUnit } from '@atomic-testing/core';
import ToggleButton from '@mui/material/ToggleButton';
import React from 'react';

//#region Single toggle
export const SingleToggleExample = () => {
  const [selected, setSelected] = React.useState(false);

  const handleChange = () => {
    setSelected(!selected);
  };
  return (
    <ToggleButton data-testid='single-toggle' value='single' selected={selected} onChange={handleChange}>
      Toggle me
    </ToggleButton>
  );
};

/**
 * Editor Toolbar Example from MUI Website
 */
export const singleToggleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Single Toggle Button',
  ui: <SingleToggleExample />,
};
//#endregion
