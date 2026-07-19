import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Tab, TabList, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * Two `TabList`s with deliberately different values/counts so a
 * too-broadly-scoped locator in `TabListDriver` would be caught immediately
 * (same disambiguation shape as the `Tags`/`Menu` examples). List A is
 * horizontal (the default) with a disabled tab; List B is `vertical` to
 * exercise `getOrientation()`. Both are uncontrolled (`defaultSelectedValue`)
 * — selection state after a driven `click()` is read straight back off the
 * DOM, no app-level state needed.
 */
const TabListExample = () => (
  <FluentProvider theme={webLightTheme}>
    <TabList data-testid='tab-list-a' defaultSelectedValue='home'>
      <Tab value='home'>Home</Tab>
      <Tab value='profile'>Profile</Tab>
      <Tab value='settings' disabled>
        Settings
      </Tab>
    </TabList>

    <TabList data-testid='tab-list-b' vertical defaultSelectedValue='overview'>
      <Tab value='overview'>Overview</Tab>
      <Tab value='details'>Details</Tab>
    </TabList>
  </FluentProvider>
);

export const tabListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent TabList',
  ui: <TabListExample />,
};
