import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  FluentProvider,
  InlineDrawer,
  OverlayDrawer,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

/**
 * `OverlayDrawer`'s `defaultOpen` is deprecated and non-functional (verified
 * against rendered DOM) — it works only as a controlled component, so this
 * example drives `open`/`onOpenChange` itself rather than relying on
 * uncontrolled default state.
 */
const DrawerExample = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(true);

  return (
    <FluentProvider theme={webLightTheme}>
      <Button data-testid='overlay-drawer-trigger' onClick={() => setOverlayOpen(true)}>
        Open overlay drawer
      </Button>
      <Button data-testid='inline-drawer-toggle' onClick={() => setInlineOpen(prev => !prev)}>
        Toggle inline drawer
      </Button>

      <OverlayDrawer
        data-testid='overlay-drawer'
        open={overlayOpen}
        onOpenChange={(_, data) => setOverlayOpen(data.open)}
        position='start'>
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance='subtle'
                aria-label='Close'
                data-testid='overlay-drawer-close'
                onClick={() => setOverlayOpen(false)}
              />
            }>
            Overlay drawer title
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>Overlay drawer body content</DrawerBody>
      </OverlayDrawer>

      <InlineDrawer data-testid='inline-drawer' open={inlineOpen} position='start'>
        <DrawerHeader>
          <DrawerHeaderTitle>Inline drawer title</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>Inline drawer body content</DrawerBody>
      </InlineDrawer>
    </FluentProvider>
  );
};

export const drawerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Drawer',
  ui: <DrawerExample />,
};
