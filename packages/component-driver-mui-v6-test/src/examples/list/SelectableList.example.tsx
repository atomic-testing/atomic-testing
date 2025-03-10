import { ListDriver, ListItemDriver } from '@atomic-testing/component-driver-mui-v6';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId, byRole } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import React from 'react';

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
      <List component="nav" aria-label="main mailbox folders" data-testid="selectable-list">
        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItemButton>

        <Divider />

        <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
          <ListItemText primary="Trash" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
          <ListItemText primary="Spam" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export const selectableListExampleScenePart = {
  selectableList: {
    locator: byDataTestId('selectable-list'),
    driver: ListDriver,
    option: {
      itemLocator: byRole('button'),
      itemClass: ListItemDriver,
    },
  },
} satisfies ScenePart;

export const selectableListExample: IExampleUnit<typeof selectableListExampleScenePart, JSX.Element> = {
  title: 'Selectable List',
  scene: selectableListExampleScenePart,
  ui: <SelectableList />,
};
//#endregion

export const selectableListTestSuite: TestSuiteInfo<typeof selectableListExample.scene> = {
  title: 'Selectable List',
  url: '/list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${selectableListExample.title}`, () => {
      let testEngine: TestEngine<typeof selectableListExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(selectableListExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      // This does not work because <div role="button"> cannot be clicked
      test.skip('should select the first item', async () => {
        const firstItem = await testEngine.parts.selectableList.getItemByIndex(0);
        firstItem!.click();
        const selected = await testEngine.parts.selectableList.getSelected();
        const selectedText = await selected?.getText();
        assertEqual(selectedText, 'Inbox');
      });

      test('Drafts (use getItemByLabel) should be selected', async () => {
        const draft = await testEngine.parts.selectableList.getItemByLabel('Drafts');
        const selected = await draft?.isSelected();
        assertEqual(selected, true);
      });

      test('There should be 4 items in the list', async () => {
        const items = await testEngine.parts.selectableList.getItems();
        assertEqual(items.length, 4);
      });
    });
  },
};
