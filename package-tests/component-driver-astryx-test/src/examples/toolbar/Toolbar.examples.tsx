import { Toolbar } from '@astryxdesign/core/Toolbar';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Toolbar scene.
 *
 * Toolbar's DOM root is a section `<div>` with no role; `data-testid` and
 * `role="toolbar"` land together on an inner div, which is what the scene
 * anchors. A second, vertical toolbar renders alongside so the driver's reads can
 * be shown to be scoped to its own instance.
 */
export const ToolbarExample = () => (
  <div>
    <Toolbar
      label='Text actions'
      size='sm'
      data-testid='toolbar'
      startContent={
        <>
          <button type='button'>Bold</button>
          <button type='button'>Italic</button>
        </>
      }
      endContent={<button type='button'>Settings</button>}
    />
    <Toolbar
      label='Layout actions'
      size='md'
      orientation='vertical'
      data-testid='toolbar-secondary'
      startContent={<button type='button'>Grid</button>}
    />
  </div>
);

export const toolbarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Toolbar',
  ui: <ToolbarExample />,
};
