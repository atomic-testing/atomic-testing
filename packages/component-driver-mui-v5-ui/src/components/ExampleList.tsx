import { IExampleUnit, ScenePart } from "@testzilla/core";
import React from "react";

export interface ExampleListProps {
  examples: IExampleUnit<ScenePart, JSX.Element>[];
}

export const ExampleList: React.FunctionComponent<ExampleListProps> = ( props ) => (
  <React.Fragment>
    {
      props.examples.map((example) => (
        <React.Fragment key={example.title}>
          <h2>{example.title}</h2>
          {example.ui}
        </React.Fragment>
      ))
    }
  </React.Fragment>
);