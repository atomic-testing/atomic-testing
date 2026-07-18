import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, SearchBox, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SearchBoxExample = () => (
  <FluentProvider theme={webLightTheme}>
    <SearchBox data-testid='search-empty' />
    <SearchBox data-testid='search-filled' defaultValue='hello' />
    <SearchBox data-testid='search-disabled' defaultValue='hello' disabled />
    <SearchBox data-testid='search-no-dismiss' defaultValue='hello' dismiss={null} />
  </FluentProvider>
);

export const searchBoxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent SearchBox',
  ui: <SearchBoxExample />,
};
