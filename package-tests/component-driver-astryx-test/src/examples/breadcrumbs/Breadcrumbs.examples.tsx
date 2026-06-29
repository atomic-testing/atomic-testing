import { BreadcrumbItem, Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Breadcrumbs scene.
 *
 * Breadcrumbs is a `<nav aria-label="Breadcrumb">` wrapping an `<ol>` of
 * `<li class="astryx-breadcrumb-item">`. Linked crumbs hold an `<a href>`; the
 * current crumb holds a `<span aria-current="page">` (the `aria-current` is on the
 * inner span, not the `<li>`). Two links plus a current crumb let the driver exercise
 * label/href enumeration and current-crumb detection.
 */
export const BreadcrumbsExample = () => (
  <Breadcrumbs label='Breadcrumb' data-testid='breadcrumbs'>
    <BreadcrumbItem href='/'>Home</BreadcrumbItem>
    <BreadcrumbItem href='/projects'>Projects</BreadcrumbItem>
    <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
  </Breadcrumbs>
);

export const breadcrumbsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Breadcrumbs',
  ui: <BreadcrumbsExample />,
};
