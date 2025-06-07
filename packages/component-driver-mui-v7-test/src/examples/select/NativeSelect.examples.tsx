import { IExampleUIUnit } from '@atomic-testing/core';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';

//#region Example
export const NativeSelectExample = () => (
  <FormControl fullWidth>
    <InputLabel variant='standard' htmlFor='uncontrolled-native'>
      Age
    </InputLabel>
    <NativeSelect
      data-testid='native-select'
      defaultValue={30}
      inputProps={{
        name: 'age',
        id: 'uncontrolled-native',
      }}>
      <option value={10}>Ten</option>
      <option value={20}>Twenty</option>
      <option value={30}>Thirty</option>
    </NativeSelect>
  </FormControl>
);

/**
 * Native select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#native-select
 */
export const nativeSelectUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Native Select',
  ui: <NativeSelectExample />,
};
//#endregion
