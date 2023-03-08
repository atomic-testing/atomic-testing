import React from 'react';
import { ExampleList } from '../components/ExampleList';
import { checkboxExamples } from '../examples';

export const HTMLCheckboxExample: React.FunctionComponent = () => (
  <ExampleList examples={checkboxExamples} />
);
