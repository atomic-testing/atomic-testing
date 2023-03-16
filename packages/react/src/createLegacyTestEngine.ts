import { ScenePart, StepFunction, TestEngine } from '@atomic-testing/core';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { ReactInteractor } from './ReactInteractor';
import { IReactTestEngineOption } from './types';

const wrapAct: StepFunction = async (fn) => {
  await act(fn);
};

/**
 * Create test engine for React 17 or before, for React 18 or later, use createTestEngine
 * @param node The React node to render
 * @param partDefinitions The scene part definitions
 * @param option
 * @returns The test engine
 */
export function createLegacyTestEngine<T extends ScenePart>(
  node: JSX.Element,
  partDefinitions: T,
  option?: Readonly<Partial<IReactTestEngineOption>>,
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const step = option?.perform ?? wrapAct;
  const container = rootEl.appendChild(document.createElement('div'));

  act(() => {
    ReactDOM.render(node, container);
  });
  const cleanup = () => {
    ReactDOM.unmountComponentAtNode(container);
    rootEl.removeChild(container);
    return Promise.resolve();
  };

  const engine = new TestEngine(
    [],
    new ReactInteractor(),
    {
      perform: step,
      parts: partDefinitions,
    },
    cleanup,
  );

  return engine;
}
