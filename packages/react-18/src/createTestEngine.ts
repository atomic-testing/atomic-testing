import { createRoot } from 'react-dom/client';

import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';
import { act } from '@testing-library/react';

import { ReactInteractor } from '@atomic-testing/react-core';
import { IReactTestEngineOption } from './types';

let _rootId = 0;
function getNextRootElementId() {
  return `${_rootId++}`;
}

const rootElementAttributeName = 'data-atomic-testing-react';

/**
 * Create test engine for React 18 or later, for React 17 or before, use createLegacyTestEngine
 * This function takes a react node and render it into a container element.  For rendered
 * components, use createRenderedTestEngine
 * @param node The React node to render
 * @param partDefinitions The scene part definitions
 * @param option
 * @returns The test engine
 */
export function createTestEngine<T extends ScenePart>(
  node: JSX.Element,
  partDefinitions: T,
  option?: Readonly<Partial<IReactTestEngineOption>>
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));

  const root = createRoot(container);
  const rootId = getNextRootElementId();
  container.setAttribute(rootElementAttributeName, rootId);
  act(() => root.render(node));

  const cleanup = () => {
    act(() => root.unmount());
    rootEl.removeChild(container);
    return Promise.resolve();
  };

  const engine = new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new ReactInteractor(),
    {
      parts: partDefinitions,
    },
    cleanup
  );

  return engine;
}

/**
 * Create test engine for React 18 or later, for React 17 or before, use createRenderedLegacyTestEngine
 * This function takes an html element purportedly rendered by React and create a test engine for it, it
 * can be useful in environment such as Storybook where Storybook renders the component and the test
 * @param rootElement The React node to render
 * @param partDefinitions The scene part definitions
 * @param option
 * @returns The test engine
 */
export function createRenderedTestEngine<T extends ScenePart>(
  rootElement: HTMLElement,
  partDefinitions: T,
  _option?: Readonly<Partial<IReactTestEngineOption>>
): TestEngine<T> {
  const rootId = getNextRootElementId();
  rootElement.setAttribute(rootElementAttributeName, rootId);

  const cleanup = () => {
    rootElement.removeAttribute(rootElementAttributeName);
    return Promise.resolve();
  };

  const engine = new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new ReactInteractor(),
    {
      parts: partDefinitions,
    },
    cleanup
  );

  return engine;
}
