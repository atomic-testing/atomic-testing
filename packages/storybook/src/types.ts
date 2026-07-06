/**
 * The slice of Storybook's play-function context the helpers need. Structural
 * and renderer-agnostic on purpose: every framework's `PlayFunctionContext`
 * satisfies it, so the helpers never import a renderer package.
 */
export interface StorybookPlayContext {
  readonly canvasElement: HTMLElement;
}
