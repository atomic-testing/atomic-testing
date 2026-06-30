import { ScenePart } from '../partTypes';

/**
 * Shape of a demo/example UI unit used by the monorepo's example harness and
 * `package-tests`. Exported for that internal tooling, not part of the stable
 * 1.0 consumer API.
 *
 * @internal
 */
export interface IExampleUIUnit<ExampleT> {
  title: string;
  description?: string;
  ui: ExampleT;
}

/**
 * A demo/example UI unit paired with the `ScenePart` its tests drive. Internal
 * example-harness tooling, not part of the stable 1.0 consumer API.
 *
 * @internal
 */
export interface IExampleUnit<T extends ScenePart, ExampleT> extends IExampleUIUnit<ExampleT> {
  scene: T;
}
