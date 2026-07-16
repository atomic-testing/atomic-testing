import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  FluentProvider,
  TeachingPopover,
  TeachingPopoverBody,
  TeachingPopoverFooter,
  TeachingPopoverHeader,
  TeachingPopoverSurface,
  TeachingPopoverTitle,
  TeachingPopoverTrigger,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

export const TeachingPopoverExample = () => (
  <FluentProvider theme={webLightTheme}>
    <TeachingPopover withArrow>
      <TeachingPopoverTrigger disableButtonEnhancement>
        <Button data-testid='teaching-popover-trigger'>Open teaching popover</Button>
      </TeachingPopoverTrigger>
      <TeachingPopoverSurface data-testid='teaching-popover'>
        <TeachingPopoverHeader>New feature</TeachingPopoverHeader>
        <TeachingPopoverTitle>Try the new toolbar</TeachingPopoverTitle>
        <TeachingPopoverBody>The toolbar now supports quick actions.</TeachingPopoverBody>
        <TeachingPopoverFooter primary={{ children: 'Next', 'data-testid': 'teaching-popover-next' } as any} />
      </TeachingPopoverSurface>
    </TeachingPopover>
  </FluentProvider>
);

export const teachingPopoverUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent TeachingPopover',
  ui: <TeachingPopoverExample />,
};
