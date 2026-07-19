import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  FluentProvider,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

/**
 * Drives `open` state directly and only honors `Escape` dismissal — Fluent
 * `Popover` dismisses on outside click by default, and clicking a SIBLING
 * popover's trigger counts as "outside" for the first one (verified against
 * rendered DOM), so two independent, uncontrolled `Popover`s never end up open
 * at once via naive sequential clicks. Filtering `onOpenChange` to the
 * `Escape` key means the outside-click dismiss request has no effect on this
 * component's own state (letting the example legitimately hold both open at
 * once to exercise the two-instance disambiguation the driver targets), while
 * `closeByEscape` still works.
 */
export const PopoverExample = () => {
  const [aOpen, setAOpen] = useState(false);
  const [bOpen, setBOpen] = useState(false);

  return (
    <FluentProvider theme={webLightTheme}>
      <Popover
        withArrow
        open={aOpen}
        onOpenChange={(e, data) => (e as React.KeyboardEvent).key === 'Escape' && setAOpen(data.open)}>
        <PopoverTrigger disableButtonEnhancement>
          <Button data-testid='popover-a-trigger' onClick={() => setAOpen(true)}>
            Open popover A
          </Button>
        </PopoverTrigger>
        <PopoverSurface data-testid='popover-a'>
          <div>Popover A content</div>
        </PopoverSurface>
      </Popover>

      <Popover
        withArrow
        open={bOpen}
        onOpenChange={(e, data) => (e as React.KeyboardEvent).key === 'Escape' && setBOpen(data.open)}>
        <PopoverTrigger disableButtonEnhancement>
          <Button data-testid='popover-b-trigger' onClick={() => setBOpen(true)}>
            Open popover B
          </Button>
        </PopoverTrigger>
        <PopoverSurface data-testid='popover-b'>
          <div>Popover B content</div>
        </PopoverSurface>
      </Popover>
    </FluentProvider>
  );
};

export const popoverUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Popover',
  ui: <PopoverExample />,
};
