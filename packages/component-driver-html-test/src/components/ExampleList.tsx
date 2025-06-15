import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export interface ExampleListProps {
  examples: readonly IExampleUIUnit<JSX.Element>[];
}

export const ExampleList: React.FunctionComponent<ExampleListProps> = props => (
  <React.Fragment>
    {props.examples.map(example => (
      <React.Fragment key={example.title}>
        <h2>{example.title}</h2>
        {example.ui}
      </React.Fragment>
    ))}
  </React.Fragment>
);
