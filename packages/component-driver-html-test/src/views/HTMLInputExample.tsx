import { textInputExamples } from '../examples/HTMLTextInput.examples';
import React from 'react';
import { ExampleList } from '../components/ExampleList';

export const HTMLInputExample: React.FunctionComponent = () => (
  // @ts-ignore
  <ExampleList examples={textInputExamples} />
);
