import { IExampleUIUnit } from '@atomic-testing/core';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import React from 'react';

//#region Basic Avatar
// A self-contained 1x1 image so the avatar's <img> actually loads in real
// browsers (a broken src makes MUI fall back and drop the <img>, which would only
// surface in e2e, not jsdom).
const dataUriImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export const BasicAvatarExample = () => {
  return (
    <Box>
      <Avatar data-testid='letter-avatar'>OP</Avatar>
      <Avatar data-testid='image-avatar' alt='Remy Sharp' src={dataUriImage} />
      <AvatarGroup data-testid='avatar-group' max={3}>
        <Avatar alt='Alpha' src='/static/images/avatar/1.jpg' />
        <Avatar alt='Bravo' src='/static/images/avatar/2.jpg' />
        <Avatar alt='Charlie' src='/static/images/avatar/3.jpg' />
        <Avatar alt='Delta' src='/static/images/avatar/4.jpg' />
        <Avatar alt='Echo' src='/static/images/avatar/5.jpg' />
      </AvatarGroup>
    </Box>
  );
};

/**
 * Basic avatar example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-avatar/
 */
export const basicAvatarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Avatar',
  ui: <BasicAvatarExample />,
};
//#endregion
