import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Skeleton, SkeletonItem, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SkeletonExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Skeleton data-testid='skeleton-plain'>
      <SkeletonItem />
      <SkeletonItem shape='circle' />
      <SkeletonItem />
    </Skeleton>
  </FluentProvider>
);

export const skeletonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Skeleton',
  ui: <SkeletonExample />,
};
