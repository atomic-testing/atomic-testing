import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

//#region Account menu
export const AccountMenu: React.FunctionComponent = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selection, setSelection] = React.useState<string | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (s: string | null = null) => {
    setSelection(s);
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Stack direction={'row'} gap={6} alignItems={'center'}>
        <Tooltip title='Account settings'>
          <IconButton
            data-testid='account-menu-trigger'
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}>
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
        <div>
          Selection:
          <span data-testid='account-menu-selection'>{selection}</span>
        </div>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        data-testid='account-menu'
        open={open}
        onClose={() => handleClose()}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem data-testid='menu-profile' onClick={() => handleClose('Profile')}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={() => handleClose('My account')}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleClose('Add another account')}>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem selected onClick={() => handleClose('Settings')}>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem disabled onClick={() => handleClose('Logout')}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-menu/#account-menu
 */
export const accountMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Account Menu',
  ui: <AccountMenu />,
};
//#endregion
