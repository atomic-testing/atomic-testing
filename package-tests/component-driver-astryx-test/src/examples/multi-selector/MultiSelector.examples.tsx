import { MultiSelector } from '@astryxdesign/core/MultiSelector';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

const FruitsMulti = () => {
  const [value, setValue] = useState<string[]>(['apple']);
  return (
    <MultiSelector
      data-testid='fruits'
      label='Fruits'
      hasClear
      value={value}
      onChange={setValue}
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
      ]}
    />
  );
};

const PermsMulti = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelector
      data-testid='perms'
      label='Permissions'
      hasSelectAll
      value={value}
      onChange={setValue}
      options={[
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' },
      ]}
    />
  );
};

const LockedMulti = () => (
  <MultiSelector
    data-testid='locked'
    label='Columns'
    value={['name']}
    onChange={() => {}}
    options={[{ value: 'name', label: 'Name' }]}
    isDisabled
    disabledMessage='Select a table first'
  />
);

/**
 * Astryx MultiSelector scene.
 *
 * The `fruits` selector (no "select all") gives a clean option list and a clear
 * control; `perms` enables "select all" to exercise {@link selectAll}. The
 * `locked` instance is disabled with a `disabledMessage`, so its trigger
 * `<button>` renders a `role="tooltip"` layer reached through the composed
 * `aria-describedby`.
 */
export const MultiSelectorExample = () => (
  <>
    <FruitsMulti />
    <PermsMulti />
    <LockedMulti />
  </>
);

export const multiSelectorUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx MultiSelector',
  ui: <MultiSelectorExample />,
};
