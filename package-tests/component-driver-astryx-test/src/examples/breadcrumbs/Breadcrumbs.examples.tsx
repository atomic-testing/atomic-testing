import { BreadcrumbItem, Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Breadcrumbs scene.
 *
 * Breadcrumbs is a `<nav aria-label="Breadcrumb">` wrapping an `<ol>` of
 * `<li class="astryx-breadcrumb-item">`. Linked crumbs hold an `<a href>`; the last
 * crumb here is left WITHOUT `isCurrent` on purpose, so Astryx auto-detects it and
 * puts `aria-current="page"` on the `<li>` itself (not an inner span) while its
 * content is a bare `<span>`. That crumb has neither an `<a>` nor a descendant
 * `[aria-current="page"]`, so a reader that probes only those would drop it from the
 * labels and miss the current crumb — the driver reads the label from the crumb's
 * content element and checks `aria-current` on the `<li>` too, so `getLabels`,
 * `getCurrentLabel`, and `getHrefs` all stay correct.
 */
export const BreadcrumbsExample = () => (
  <Breadcrumbs label='Breadcrumb' data-testid='breadcrumbs'>
    <BreadcrumbItem href='/'>Home</BreadcrumbItem>
    <BreadcrumbItem href='/projects'>Projects</BreadcrumbItem>
    <BreadcrumbItem>My Project</BreadcrumbItem>
  </Breadcrumbs>
);

export const breadcrumbsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Breadcrumbs',
  ui: <BreadcrumbsExample />,
};
