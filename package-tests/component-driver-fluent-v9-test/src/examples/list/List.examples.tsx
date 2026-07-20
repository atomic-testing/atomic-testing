import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, List, ListItem, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const ListExample = () => (
  <FluentProvider theme={webLightTheme}>
    <List data-testid='list-plain'>
      <ListItem data-testid='list-item-one' value='1'>
        Item One
      </ListItem>
      <ListItem data-testid='list-item-two' value='2'>
        Item Two
      </ListItem>
    </List>
    <List data-testid='list-selectable' selectionMode='multiselect'>
      <ListItem data-testid='list-item-sel-one' value='a'>
        Selectable One
      </ListItem>
      <ListItem data-testid='list-item-sel-two' value='b'>
        Selectable Two
      </ListItem>
    </List>
  </FluentProvider>
);

export const listUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent List',
  ui: <ListExample />,
};
