import { IExampleUIUnit } from '@atomic-testing/core';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';

//#region Basic RadioGroup
export const BasicRadioGroupExample = () => {
  // Controlled so selection changes are deterministic in tests.
  const [fruit, setFruit] = React.useState('banana');

  return (
    <div>
      <FormControl>
        <FormLabel id='fruit-group-label'>Fruit</FormLabel>
        <RadioGroup
          data-testid='fruit-group'
          aria-labelledby='fruit-group-label'
          value={fruit}
          onChange={event => setFruit(event.target.value)}>
          <FormControlLabel value='apple' control={<Radio />} label='Apple' />
          <FormControlLabel value='banana' control={<Radio />} label='Banana' />
          {/* A disabled option exercises isOptionDisabled(). */}
          <FormControlLabel value='cherry' control={<Radio />} label='Cherry' disabled />
        </RadioGroup>
      </FormControl>

      {/* A second group verifies locators stay scoped to their own root. */}
      <FormControl>
        <FormLabel id='size-group-label'>Size</FormLabel>
        <RadioGroup data-testid='size-group' aria-labelledby='size-group-label' defaultValue='medium'>
          <FormControlLabel value='small' control={<Radio />} label='Small' />
          <FormControlLabel value='medium' control={<Radio />} label='Medium' />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

/**
 * Basic radio group example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-radio-button/
 */
export const basicRadioGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic RadioGroup',
  ui: <BasicRadioGroupExample />,
};
//#endregion
