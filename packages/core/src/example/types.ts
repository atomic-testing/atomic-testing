import { ScenePart } from '../partTypes';

export interface IExampleUnit<T extends ScenePart, ExampleT> {
  title: string;
  description?: string;
  scene: T;
  ui: ExampleT;
}
