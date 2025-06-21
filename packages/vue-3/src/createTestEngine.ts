import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';
import { render } from '@testing-library/vue';
import { App, Component, createApp } from 'vue';

import { VueInteractor } from './VueInteractor';
import { IVueTestEngineOption } from './types';

function unwrapComponent(component: Component | { default: Component }): Component {
  return (component as any).default ?? (component as Component);
}

let _rootId = 0;
function getNextRootElementId() {
  return `${_rootId++}`;
}

const rootElementAttributeName = 'data-atomic-testing-vue';

export function createTestEngine<T extends ScenePart>(
  component: Component | { default: Component },
  partDefinitions: T,
  option?: Readonly<Partial<IVueTestEngineOption>>
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));
  const rootId = getNextRootElementId();
  container.setAttribute(rootElementAttributeName, rootId);
  
  let unmount: () => void;
  let app: App;

  try {
    const renderResult = render(unwrapComponent(component), { container });
    unmount = renderResult.unmount;
  } catch (_error) {
    // Fallback to manual Vue app creation if render fails
    app = createApp(unwrapComponent(component));
    app.mount(container);
    unmount = () => {
      if (app) {
        app.unmount();
      }
    };
  }

  const cleanup = () => {
    unmount();
    rootEl.removeChild(container);
    return Promise.resolve();
  };

  return new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new VueInteractor(),
    {
      parts: partDefinitions,
    },
    cleanup
  );
}

export function createRenderedTestEngine<T extends ScenePart>(
  rootElement: HTMLElement,
  partDefinitions: T,
  _option?: Readonly<Partial<IVueTestEngineOption>>
): TestEngine<T> {
  const rootId = getNextRootElementId();
  rootElement.setAttribute(rootElementAttributeName, rootId);

  const cleanup = () => {
    rootElement.removeAttribute(rootElementAttributeName);
    return Promise.resolve();
  };

  return new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new VueInteractor(),
    {
      parts: partDefinitions,
    },
    cleanup
  );
}
