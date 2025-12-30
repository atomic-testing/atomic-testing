import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export interface ExampleListProps {
  examples: readonly IExampleUIUnit<React.ReactNode>[];
}

export const ExampleList: React.FC<ExampleListProps> = props => (
  <>
    {props.examples.map(example => (
      <React.Fragment key={example.title}>
        <h2>{example.title}</h2>
        {example.ui}
      </React.Fragment>
    ))}
  </>
);
