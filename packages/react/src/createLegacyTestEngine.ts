import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';

import { ReactInteractor } from './ReactInteractor';
import { IReactTestEngineOption } from './types';

let _rootId = 0;
function getNextRootElementId() {
  return `${_rootId++}`;
}

const rootElementAttributeName = 'data-atomic-testing-react-legacy';

/**
 * Create test engine for React 17 or before, for React 18 or later, use createTestEngine
 * This function takes a react node and render it into a container element.  For rendered
 * components, use createRenderedLegacyTestEngine
 * @param node The React node to render
 * @param partDefinitions The scene part definitions
 * @param option
 * @returns The test engine
 */
export function createLegacyTestEngine<T extends ScenePart>(
  node: JSX.Element,
  partDefinitions: T,
  option?: Readonly<Partial<IReactTestEngineOption>>
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));
  const rootId = getNextRootElementId();
  container.setAttribute(rootElementAttributeName, rootId);

  act(() => {
    ReactDOM.render(node, container);
  });
  const cleanup = () => {
    ReactDOM.unmountComponentAtNode(container);
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
 * Create test engine for React 17 or before, for React 18 or later, use createRenderedTestEngine
 * This function takes an html element purportedly rendered by React and create a test engine for it, it
 * can be useful in environment such as Storybook where Storybook renders the component and the test
 * @param rootElement The React node to render
 * @param partDefinitions The scene part definitions
 * @param option
 * @returns The test engine
 */
export function createRenderedLegacyTestEngine<T extends ScenePart>(
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
