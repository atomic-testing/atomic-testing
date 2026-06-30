import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

//#region Basic Drawer
export const BasicDrawerExample = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      <Button data-testid='open-drawer' onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      {/* Enter instantly so the backdrop is immediately actionable for Playwright,
          but keep a real exit so the backdrop persists through the dismiss click
          (clicking an element that unmounts mid-action is flaky in Chromium). */}
      <Drawer
        data-testid='basic-drawer'
        anchor='left'
        open={open}
        onClose={() => setOpen(false)}
        transitionDuration={{ enter: 0, exit: 200 }}>
        <Box data-testid='drawer-content' sx={{ width: 250 }}>
          <List>
            <ListItem>
              <ListItemText primary='Inbox' />
            </ListItem>
            <ListItem>
              <ListItemText primary='Starred' />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

/**
 * Basic drawer example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-drawer/
 */
export const basicDrawerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Drawer',
  ui: <BasicDrawerExample />,
};
//#endregion
