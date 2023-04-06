import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, MenuDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip } from '@mui/material';
import React from 'react';

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
    console.log({ s });
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Stack direction={'row'} gap={6} alignItems={'center'}>
        <Tooltip title="Account settings">
          <IconButton
            data-testid="account-menu-trigger"
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
        <div>
          Selection:
          <span data-testid="account-menu-selection">{selection}</span>
        </div>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        data-testid="account-menu"
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
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem data-testid="menu-profile" onClick={() => handleClose('Profile')}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={() => handleClose('My account')}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleClose('Add another account')}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem selected onClick={() => handleClose('Settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem disabled onClick={() => handleClose('Logout')}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export const accountMenuExampleScenePart = {
  menu: {
    locator: byDataTestId('account-menu'),
    driver: MenuDriver,
  },
  disclosure: {
    locator: byDataTestId('account-menu-trigger'),
    driver: ButtonDriver,
  },
  selection: {
    locator: byDataTestId('account-menu-selection'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-menu/#account-menu
 */
export const accountMenuExample: IExampleUnit<typeof accountMenuExampleScenePart, JSX.Element> = {
  title: 'Account Menu',
  scene: accountMenuExampleScenePart,
  ui: <AccountMenu />,
};
//#endregion

export const accountMenuTestSuite: TestSuiteInfo<typeof accountMenuExampleScenePart> = {
  title: 'Account Menu',
  url: '/menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof accountMenuExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(accountMenuExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    describe('When menu is open', () => {
      beforeEach(async () => {
        await testEngine.parts.disclosure.click();
      });

      test('Settings menu item should be selected', async () => {
        const item = await testEngine.parts.menu.getByLabel('Settings');
        const isSelected = await item?.isSelected();
        assertEqual(isSelected, true);
      });

      test('Profile menu item should not be selected', async () => {
        const item = await testEngine.parts.menu.getByLabel('Profile');
        const isSelected = await item?.isSelected();
        assertEqual(isSelected, false);
      });

      test('Clicking on Profile menu item should select it', async () => {
        await testEngine.parts.menu.selectByLabel('Profile');
        const selection = await testEngine.parts.selection.getText();
        assertEqual(selection, 'Profile');
      });

      test('Logout menu item should be disabled', async () => {
        const item = await testEngine.parts.menu.getByLabel('Logout');
        const isDisabled = await item?.isDisabled();
        assertEqual(isDisabled, true);
      });
    });
  },
};
