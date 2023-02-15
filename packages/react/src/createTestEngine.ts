import { defaultOnFinishUpdate, ITestEngine, PartDriverLookup, ScenePart } from '@testzilla/core';
import { IntegrationEngine } from '@testzilla/integration-core';
import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { IReactTestEngineOption, IReactTestEngineResult } from './types';

export function createTestEngine<T extends PartDriverLookup>(
  node: ReactNode,
  partDefinitions: ScenePart<T>,
  option?: Readonly<Partial<IReactTestEngineOption>>,
): IReactTestEngineResult {
  const rootEl = option?.rootElement ?? document.body;
  const step = option?.step ?? act;
  const onFinishUpdate = option?.onFinishUpdate ?? defaultOnFinishUpdate;
  const container = rootEl.appendChild(document.createElement('div'));

  const reactRoot = createRoot(container);
  reactRoot.render(node);

  const engine = new IntegrationEngine(
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
      reactRoot.unmount();
      rootEl.removeChild(container);
    },
  };
}
