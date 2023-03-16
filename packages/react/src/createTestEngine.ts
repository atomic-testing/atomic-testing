import { ScenePart, StepFunction, TestEngine } from '@atomic-testing/core';
import ReactDOM from 'react-dom';
import * as ReactDomClient from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { ReactInteractor } from './ReactInteractor';
import { IReactTestEngineOption } from './types';

const wrapAct: StepFunction = async (fn) => {
  await act(fn);
};

export function createTestEngine<T extends ScenePart>(
  node: JSX.Element,
  partDefinitions: T,
  option?: Readonly<Partial<IReactTestEngineOption>>,
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const step = option?.perform ?? wrapAct;
  const container = rootEl.appendChild(document.createElement('div'));

  let engine: TestEngine<T>;

  if (option?.legacyRender) {
    act(() => ReactDOM.render(node, container));
    const cleanup = () => {
      ReactDOM.unmountComponentAtNode(container);
      rootEl.removeChild(container);
      return Promise.resolve();
    };

    engine = new TestEngine(
      [],
      new ReactInteractor(),
      {
        perform: step,
        parts: partDefinitions,
      },
      cleanup,
    );
  } else {
    const root = ReactDomClient.createRoot(container);
    act(() => root.render(node));

    const cleanup = () => {
      act(() => root.unmount());
      rootEl.removeChild(container);
      return Promise.resolve();
    };

    engine = new TestEngine(
      [],
      new ReactInteractor(),
      {
        perform: step,
        parts: partDefinitions,
      },
      cleanup,
    );
  }

  return engine;
}
