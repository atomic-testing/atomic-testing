import { defaultOnFinishUpdate, IntegrationTestEngine, ScenePart, StepFunction } from '@testzilla/core';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { IReactTestEngineOption, IReactTestEngineResult } from './types';

const wrapAct: StepFunction = async (fn) => {
  await act(fn);
};

export function createTestEngine<T extends ScenePart>(
  node: JSX.Element,
  partDefinitions: T,
  option?: Readonly<Partial<IReactTestEngineOption>>,
): IReactTestEngineResult<T> {
  const rootEl = option?.rootElement ?? document.body;
  const step = option?.step ?? wrapAct;
  const onFinishUpdate = option?.onFinishUpdate ?? defaultOnFinishUpdate;
  const container = rootEl.appendChild(document.createElement('div'));

  const root = createRoot(container);
  act(() => root.render(node));

  const engine = new IntegrationTestEngine(
    partDefinitions,
    rootEl,
    {
      step,
      onFinishUpdate,
    },
    option?.parentEngine,
  );

  return {
    engine,
    cleanUp: () => {
      act(() => root.unmount());
      rootEl.removeChild(container);
    },
  };
}
