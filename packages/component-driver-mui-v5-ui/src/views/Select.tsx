import { selectExamples } from '@testzilla/component-driver-mui-v5-dom-test';
import React from 'react';
import { ExampleList } from '../components/ExampleList';

export const SelectExample: React.FunctionComponent = () => (
  <ExampleList examples={selectExamples} />
);
