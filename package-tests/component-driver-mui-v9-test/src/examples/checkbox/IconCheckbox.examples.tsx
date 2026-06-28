import { IExampleUIUnit } from '@atomic-testing/core';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

//#region Example
export const IconCheckbox = () => {
  return (
    <Stack direction='row' spacing={10}>
      <Checkbox data-testid='favorite' icon={<FavoriteBorder />} checkedIcon={<Favorite />} value='favorite' />
      <Checkbox data-testid='bookmark' icon={<BookmarkBorderIcon />} checkedIcon={<BookmarkIcon />} value='bookmark' />
    </Stack>
  );
};

/**
 * Icon checkbox example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#icon
 */
export const iconCheckboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Icon Checkbox',
  ui: <IconCheckbox />,
};
//#endregion
