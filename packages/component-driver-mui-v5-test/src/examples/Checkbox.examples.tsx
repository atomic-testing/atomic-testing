import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Box, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import React from 'react';

//#region Label checkbox
export const LabelCheckbox = () => {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked data-testid="apple" value="apple" />} label="Apple" />
      <FormControlLabel control={<Checkbox data-testid="banana" value="banana" />} label="Banana" />
    </FormGroup>
  );
};

export const labelCheckboxExampleScenePart = {
  apple: {
    locator: byDataTestId('apple'),
    driver: CheckboxDriver,
  },
  banana: {
    locator: byDataTestId('banana'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Icon button example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#label
 */
export const labelCheckboxExample: IExampleUnit<typeof labelCheckboxExampleScenePart, JSX.Element> = {
  title: 'Label Checkbox',
  scene: labelCheckboxExampleScenePart,
  ui: <LabelCheckbox />,
};
//#endregion

//#region Icon checkbox
export const IconCheckbox = () => {
  return (
    <Stack direction="row" spacing={10}>
      <Checkbox data-testid="favorite" icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="favorite" />
      <Checkbox data-testid="bookmark" icon={<BookmarkBorderIcon />} checkedIcon={<BookmarkIcon />} value="bookmark" />
    </Stack>
  );
};

export const iconCheckboxExampleScenePart = {
  favorite: {
    locator: byDataTestId('favorite'),
    driver: CheckboxDriver,
  },
  bookmark: {
    locator: byDataTestId('bookmark'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Icon button example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#icon
 */
export const iconCheckboxExample: IExampleUnit<typeof iconCheckboxExampleScenePart, JSX.Element> = {
  title: 'Icon Checkbox',
  scene: iconCheckboxExampleScenePart,
  ui: <IconCheckbox />,
};
//#endregion

//#region Indeterminate checkbox
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
        data-testid="child1"
        label="Child 1"
        control={<Checkbox data-testid="child1" checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="Child 2"
        control={<Checkbox data-testid="child2" checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        label="Parent"
        control={
          <Checkbox
            data-testid="parent"
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      />
      {children}
    </div>
  );
};

export const indeterminateCheckboxExampleScenePart = {
  parent: {
    locator: byDataTestId('parent'),
    driver: CheckboxDriver,
  },
  child1: {
    locator: byDataTestId('child1'),
    driver: CheckboxDriver,
  },
  child2: {
    locator: byDataTestId('child2'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Icon button example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#indeterminate
 */
export const indeterminateCheckboxExample: IExampleUnit<typeof indeterminateCheckboxExampleScenePart, JSX.Element> = {
  title: 'Indeterminate Checkbox',
  scene: indeterminateCheckboxExampleScenePart,
  ui: <IndeterminateCheckbox />,
};
//#endregion

export const checkboxExamples = [
  labelCheckboxExample,
  iconCheckboxExample,
  indeterminateCheckboxExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
