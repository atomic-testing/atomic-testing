import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

//#region Example
export const IndeterminateCheckbox = () => {
  const [checked, setChecked] = React.useState([true, false]);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label='Child 1'
        control={<Checkbox checked={checked[0]} onChange={handleChange2} data-testid='child1' />}
      />
      <FormControlLabel
        label='Child 2'
        control={<Checkbox checked={checked[1]} onChange={handleChange3} data-testid='child2' />}
      />
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        label='Parent'
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
            data-testid='parent'
          />
        }
      />
      {children}
    </div>
  );
};

/**
 * Indeterminate checkbox example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#indeterminate
 */
export const indeterminateCheckboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Indeterminate Checkbox',
  ui: <IndeterminateCheckbox />,
};
//#endregion
