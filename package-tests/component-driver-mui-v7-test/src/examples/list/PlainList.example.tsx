import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

//#region Example
/**
 * A vanilla `<List>` of `<ListItem>`s (which render as plain `<li>`) plus a pair of
 * `<ListItemButton component="button">` rendered as native `<button>`s — one enabled,
 * one disabled. Exercises the ListDriver default item locator and ListItemDriver
 * disabled-state detection.
 */
export const PlainList: React.FunctionComponent = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List aria-label='mailbox folders' data-testid='plain-list'>
        <ListItem>
          <ListItemText primary='Inbox' />
        </ListItem>
        <ListItem>
          <ListItemText primary='Drafts' />
        </ListItem>
        <ListItem>
          <ListItemText primary='Trash' />
        </ListItem>
      </List>
      <List aria-label='actions'>
        <ListItemButton component='button' data-testid='enabled-item'>
          <ListItemText primary='Enabled' />
        </ListItemButton>
        <ListItemButton component='button' disabled data-testid='disabled-item'>
          <ListItemText primary='Disabled' />
        </ListItemButton>
      </List>
    </Box>
  );
};

export const plainListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Plain List',
  ui: <PlainList />,
};
//#endregion
