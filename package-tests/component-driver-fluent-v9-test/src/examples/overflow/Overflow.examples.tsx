import { IExampleUIUnit } from '@atomic-testing/core';
import {
  FluentProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Overflow,
  OverflowItem,
  useOverflowMenu,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

const itemIds = ['one', 'two', 'three'];

/**
 * `useOverflowMenu`'s "+N" trigger is normally rendered conditionally on
 * `isOverflowing` (hidden entirely when nothing overflows) — this example
 * renders it UNCONDITIONALLY instead, and its `MenuList` lists every item
 * rather than only the overflowed ones. Real overflow computation
 * (`@fluentui/priority-overflow`) needs `ResizeObserver` + real layout
 * measurement, neither available under jsdom (confirmed: it degrades
 * gracefully — no `ResizeObserver` global logs a console error and no-ops,
 * it does not throw — but produces no meaningful overflow state there). This
 * package's shared dom+e2e suite pattern runs the identical assertions in
 * both environments, so the example keeps the trigger structurally
 * addressable everywhere rather than asserting a layout-dependent
 * true/false overflow state that only a real browser can produce
 * deterministically.
 */
const OverflowMenuTrigger = () => {
  const { ref, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton ref={ref}>{overflowCount > 0 ? `+${overflowCount}` : 'More'}</MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {itemIds.map(id => (
            <MenuItem key={id}>{`Item ${id}`}</MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const OverflowExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Overflow>
      <div data-testid='overflow-row' style={{ display: 'flex', gap: 4 }}>
        {itemIds.map(id => (
          <OverflowItem key={id} id={id}>
            <button type='button'>{`Item ${id}`}</button>
          </OverflowItem>
        ))}
        <OverflowMenuTrigger />
      </div>
    </Overflow>
  </FluentProvider>
);

export const overflowUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Overflow',
  ui: <OverflowExample />,
};
