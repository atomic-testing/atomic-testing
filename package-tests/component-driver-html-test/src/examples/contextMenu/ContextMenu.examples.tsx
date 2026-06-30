import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useCallback } from 'react';

export const ContextMenuExample = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<number>(0);

  const onContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the native OS/browser context menu so the e2e right-click does not
    // surface a real menu and stall the test.
    event.preventDefault();
    setOpen(true);
    setCount(prev => prev + 1);
  }, []);

  return (
    <React.Fragment>
      <div data-testid='context-target' onContextMenu={onContextMenu}>
        Right-click me
      </div>
      {/* The menu renders only after a contextmenu event, so a test can assert it
          went from absent to present. */}
      {open && <div data-testid='context-menu'>Menu</div>}
      {/* Counts how many contextmenu events fired, so a test can assert exactly one. */}
      <div data-testid='context-count'>{count}</div>
    </React.Fragment>
  );
};

export const contextMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Context Menu',
  ui: <ContextMenuExample />,
};
