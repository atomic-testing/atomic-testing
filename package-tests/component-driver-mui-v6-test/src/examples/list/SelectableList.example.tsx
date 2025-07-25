import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import DraftsIcon from '@mui/icons-material/Drafts';
import InboxIcon from '@mui/icons-material/Inbox';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

//#region Example
export const SelectableList: React.FunctionComponent = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component='nav' aria-label='main mailbox folders' data-testid='selectable-list'>
        <ListItemButton selected={selectedIndex === 0} onClick={event => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary='Inbox' />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={event => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary='Drafts' />
        </ListItemButton>

        <Divider />

        <ListItemButton selected={selectedIndex === 2} onClick={event => handleListItemClick(event, 2)}>
          <ListItemText primary='Trash' />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 3} onClick={event => handleListItemClick(event, 3)}>
          <ListItemText primary='Spam' />
        </ListItemButton>
      </List>
    </Box>
  );
};

export const selectableListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Selectable List',
  ui: <SelectableList />,
};
//#endregion
