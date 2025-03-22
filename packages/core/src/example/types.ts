import { ScenePart } from '../partTypes';

export interface IExampleUIUnit<ExampleT> {
  title: string;
  description?: string;
  ui: ExampleT;
}

export interface IExampleUnit<T extends ScenePart, ExampleT> extends IExampleUIUnit<ExampleT> {
  scene: T;
}
