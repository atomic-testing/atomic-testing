import { ScenePart } from '../types';

export interface IExampleUnit<T extends ScenePart, ExampleT> {
  title: string;
  description?: string;
  scene: T;
  ui: ExampleT;
}
