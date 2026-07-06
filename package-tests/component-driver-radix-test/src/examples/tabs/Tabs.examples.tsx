import { IExampleUIUnit } from '@atomic-testing/core';
import { Tabs } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Tabs audit scene (Wave 0 capability-gap audit; no driver yet).
 * Includes a disabled trigger so the audit sees the disabled-state attributes.
 */
export const TabsExample = () => (
  <Tabs.Root defaultValue='one' data-testid='tabs'>
    <Tabs.List aria-label='Audit tabs' data-testid='tabs-list'>
      <Tabs.Trigger value='one' data-testid='tab-one'>
        One
      </Tabs.Trigger>
      <Tabs.Trigger value='two' data-testid='tab-two'>
        Two
      </Tabs.Trigger>
      <Tabs.Trigger value='three' disabled data-testid='tab-three'>
        Three
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value='one' data-testid='panel-one'>
      First panel
    </Tabs.Content>
    <Tabs.Content value='two' data-testid='panel-two'>
      Second panel
    </Tabs.Content>
    <Tabs.Content value='three' data-testid='panel-three'>
      Third panel
    </Tabs.Content>
  </Tabs.Root>
);

export const tabsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Tabs',
  ui: <TabsExample />,
};
