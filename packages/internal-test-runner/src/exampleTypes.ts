import { ScenePart } from '@atomic-testing/core';

/**
 * Metadata describing a single rendered example (its title, optional description
 * and the UI to render). Used by the internal example harness and the example
 * test suites; it is intentionally not part of the public `@atomic-testing/core`
 * surface.
 */
export interface IExampleUIUnit<ExampleT> {
  title: string;
  description?: string;
  ui: ExampleT;
}

/**
 * An {@link IExampleUIUnit} paired with the {@link ScenePart} definition that
 * drives it, so the same example can be both rendered and tested.
 */
export interface IExampleUnit<T extends ScenePart, ExampleT> extends IExampleUIUnit<ExampleT> {
  scene: T;
}
