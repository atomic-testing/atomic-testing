import { IExampleUIUnit } from '@atomic-testing/core';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

//#region Example
export const LabelCheckbox = () => {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked data-testid='apple' value='apple' />} label='Apple' />
      <FormControlLabel control={<Checkbox data-testid='banana' value='banana' />} label='Banana' />
    </FormGroup>
  );
};

/**
 * Label checkbox example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#label
 */
export const labelCheckboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Label Checkbox',
  ui: <LabelCheckbox />,
};
//#endregion
