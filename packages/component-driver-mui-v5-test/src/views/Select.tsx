import { selectExamples } from '../examples/Select.examples';
import React from 'react';
import { ExampleList } from '../components/ExampleList';

export const SelectExample: React.FunctionComponent = () => (
  // @ts-ignore
  <ExampleList examples={selectExamples} />
);
