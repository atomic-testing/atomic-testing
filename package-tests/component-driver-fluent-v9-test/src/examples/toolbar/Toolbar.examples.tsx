import { IExampleUIUnit } from '@atomic-testing/core';
import {
  FluentProvider,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * Two `Toolbar`s with deliberately different button counts/labels so a
 * too-broadly-scoped locator in `ToolbarDriver` would be caught immediately
 * (same disambiguation shape as the `Tags`/`Menu` examples). Toolbar A is
 * horizontal (the default) with a `ToolbarRadioGroup`; Toolbar B is
 * `vertical`, to exercise `getOrientation()` and `ToolbarDivider`'s inverted
 * axis.
 */
const ToolbarExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Toolbar data-testid='toolbar-a' aria-label='Toolbar A' defaultCheckedValues={{ align: ['left'] }}>
      <ToolbarButton>Cut</ToolbarButton>
      <ToolbarButton disabled>Copy</ToolbarButton>
      <ToolbarButton>Paste</ToolbarButton>
      <ToolbarDivider data-testid='divider-a' />
      <ToolbarRadioGroup data-testid='align-group'>
        <ToolbarRadioButton name='align' value='left'>
          Left
        </ToolbarRadioButton>
        <ToolbarRadioButton name='align' value='center'>
          Center
        </ToolbarRadioButton>
        <ToolbarRadioButton name='align' value='right'>
          Right
        </ToolbarRadioButton>
      </ToolbarRadioGroup>
    </Toolbar>

    <Toolbar data-testid='toolbar-b' aria-label='Toolbar B' vertical>
      <ToolbarButton>Save</ToolbarButton>
      <ToolbarDivider data-testid='divider-b' />
      <ToolbarButton>Open</ToolbarButton>
    </Toolbar>
  </FluentProvider>
);

export const toolbarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Toolbar',
  ui: <ToolbarExample />,
};
