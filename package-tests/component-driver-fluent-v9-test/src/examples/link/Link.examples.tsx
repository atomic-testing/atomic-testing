import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Link, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const LinkExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Link data-testid='link-one' href='https://example.com/one'>
      One
    </Link>
    <Link data-testid='link-two' href='https://example.com/two' target='_blank'>
      Two
    </Link>
    <Link data-testid='link-disabled' href='https://example.com/disabled' disabled>
      Disabled
    </Link>
  </FluentProvider>
);

export const linkUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Link',
  ui: <LinkExample />,
};
