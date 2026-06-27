import { IExampleUIUnit } from '@atomic-testing/core';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestoreIcon from '@mui/icons-material/Restore';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import React from 'react';

//#region Basic BottomNavigation
export const BasicBottomNavigationExample = () => {
  const [value, setValue] = React.useState(1);
  // A second instance verifies locators stay scoped to their own root.
  const [otherValue, setOtherValue] = React.useState(0);

  return (
    <Box>
      <BottomNavigation
        data-testid='bottom-nav'
        showLabels
        value={value}
        onChange={(_e, next: number) => setValue(next)}>
        <BottomNavigationAction label='Recents' icon={<RestoreIcon />} />
        <BottomNavigationAction label='Favorites' icon={<FavoriteIcon />} />
        <BottomNavigationAction label='Nearby' icon={<LocationOnIcon />} />
      </BottomNavigation>

      <BottomNavigation
        data-testid='other-bottom-nav'
        showLabels
        value={otherValue}
        onChange={(_e, next: number) => setOtherValue(next)}>
        <BottomNavigationAction label='Home' icon={<RestoreIcon />} />
        <BottomNavigationAction label='Profile' icon={<FavoriteIcon />} />
      </BottomNavigation>
    </Box>
  );
};

/**
 * Basic bottom navigation example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-bottom-navigation/
 */
export const basicBottomNavigationUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic BottomNavigation',
  ui: <BasicBottomNavigationExample />,
};
//#endregion
