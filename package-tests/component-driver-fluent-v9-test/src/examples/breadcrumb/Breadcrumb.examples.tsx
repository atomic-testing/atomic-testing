import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * Two `Breadcrumb`s with deliberately different item counts/labels so a
 * too-broadly-scoped locator in `BreadcrumbDriver` would be caught
 * immediately (same disambiguation shape as the `Tags`/`Menu` examples).
 * Breadcrumb A's last crumb is `current` (no `href`, real `<button>`);
 * Breadcrumb B has a `disabled` non-current crumb. Every `href`-bearing
 * button `preventDefault`s its click — a real anchor click would otherwise
 * navigate the E2E browser away from the running example app.
 */
const preventNavigation = (event: React.MouseEvent) => event.preventDefault();

const BreadcrumbExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Breadcrumb data-testid='breadcrumb-a' aria-label='Breadcrumb A'>
      <BreadcrumbItem>
        <BreadcrumbButton href='/home' onClick={preventNavigation}>
          Home
        </BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton href='/home/library' onClick={preventNavigation}>
          Library
        </BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton current>Data</BreadcrumbButton>
      </BreadcrumbItem>
    </Breadcrumb>

    <Breadcrumb data-testid='breadcrumb-b' aria-label='Breadcrumb B'>
      <BreadcrumbItem>
        <BreadcrumbButton href='/root' onClick={preventNavigation}>
          Root
        </BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton href='/root/locked' disabled onClick={preventNavigation}>
          Locked
        </BreadcrumbButton>
      </BreadcrumbItem>
    </Breadcrumb>
  </FluentProvider>
);

export const breadcrumbUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Breadcrumb',
  ui: <BreadcrumbExample />,
};
