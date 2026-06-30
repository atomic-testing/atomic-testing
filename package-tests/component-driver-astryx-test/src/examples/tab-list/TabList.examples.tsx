import { Tab, TabList, TabMenu } from '@astryxdesign/core/TabList';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx TabList scene.
 *
 * `TabList` is controlled — it renders a `<nav aria-label="Tabs">` whose direct
 * children are the tabs (`<button>`/`<a>`), the active one marked
 * `aria-current="page"`. A `TabMenu` overflow trigger + its popover are included
 * so the driver can be shown to ignore them when listing/counting tabs.
 */
const TabListHarness = () => {
  const [value, setValue] = useState('settings');
  return (
    <TabList value={value} onChange={setValue} data-testid='tabs'>
      <Tab value='home' label='Home' />
      <Tab value='profile' label='Profile' href='/profile' />
      <Tab value='settings' label='Settings' />
      <TabMenu
        label='More'
        options={[
          { value: 'analytics', label: 'Analytics' },
          { value: 'reports', label: 'Reports' },
        ]}
      />
    </TabList>
  );
};

export const TabListExample = () => <TabListHarness />;

export const tabListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TabList',
  ui: <TabListExample />,
};
