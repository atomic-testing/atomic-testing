import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  FluentProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

/**
 * Menus C and D drive their `open` state directly and only honor `Escape`
 * dismissal — Fluent Menu (like Popover) dismisses on outside click by
 * default, and clicking a SIBLING menu's trigger counts as "outside" for the
 * first one (verified against rendered DOM), so two independent, UNCONTROLLED
 * `Menu`s never end up open at once via naive sequential clicks. Filtering
 * `onOpenChange` to the `Escape` key means Fluent's outside-click dismiss
 * request has no effect on this component's own state (letting the example
 * legitimately hold both open at once to exercise the two-instance
 * disambiguation the driver targets), while `closeByEscape` still works.
 * Menu A stays uncontrolled so its close-on-select/checkbox/radio
 * behavior tests observe Fluent's real default lifecycle.
 */
export const MenuExample = () => {
  const [cOpen, setCOpen] = useState(false);
  const [dOpen, setDOpen] = useState(false);

  return (
    <FluentProvider theme={webLightTheme}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button data-testid='menu-a-trigger'>Open menu A</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem data-testid='menu-a-item-cut'>Cut</MenuItem>
            <MenuItem data-testid='menu-a-item-copy'>Copy</MenuItem>
            <MenuItem data-testid='menu-a-item-paste' disabled>
              Paste
            </MenuItem>
            <MenuItemCheckbox name='wrap' value='wrap'>
              Word wrap
            </MenuItemCheckbox>
            <MenuItemRadio name='align' value='left'>
              Align left
            </MenuItemRadio>
            <MenuItemRadio name='align' value='center'>
              Align center
            </MenuItemRadio>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu open={cOpen} onOpenChange={(e, data) => (e as React.KeyboardEvent).key === 'Escape' && setCOpen(data.open)}>
        <MenuTrigger disableButtonEnhancement>
          <Button data-testid='menu-c-trigger' onClick={() => setCOpen(true)}>
            Open menu C
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem data-testid='menu-c-item-one'>Menu C item</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu open={dOpen} onOpenChange={(e, data) => (e as React.KeyboardEvent).key === 'Escape' && setDOpen(data.open)}>
        <MenuTrigger disableButtonEnhancement>
          <Button data-testid='menu-d-trigger' onClick={() => setDOpen(true)}>
            Open menu D
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem data-testid='menu-d-item-one'>Menu D item</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton data-testid='menu-button'>MenuButton label</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem data-testid='menu-button-item'>Menu button item</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu positioning='below-end'>
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: any) => (
            <SplitButton
              data-testid='split-button'
              menuButton={triggerProps}
              primaryActionButton={{ 'data-testid': 'split-button-primary', onClick: () => {} } as any}>
              SplitButton label
            </SplitButton>
          )}
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem data-testid='split-button-item'>Split button item</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </FluentProvider>
  );
};

export const menuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Menu',
  ui: <MenuExample />,
};
