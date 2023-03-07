import React from 'react';
import { ExampleList } from '../components/ExampleList';
import { selectExamples } from '../examples/HTMLSelect.examples';

export const HTMLSelectExample: React.FunctionComponent = () => (
  // @ts-ignore
  <ExampleList examples={selectExamples} />
);
