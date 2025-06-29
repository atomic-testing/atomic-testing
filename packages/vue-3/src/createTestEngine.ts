import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';
import { render } from '@testing-library/vue';
import { App, Component, createApp, defineComponent, h } from 'vue';

import { VueInteractor } from './VueInteractor';
import { IVueTestEngineOption, VueSFCLikeComponent } from './types';

let _rootId = 0;
function getNextRootElementId() {
  return `${_rootId++}`;
}

const rootElementAttributeName = 'data-atomic-testing-vue';

function isSFCLikeObject(component: any): component is VueSFCLikeComponent {
  return (
    component && typeof component === 'object' && 'template' in component && typeof component.template === 'string'
  );
}

function createComponentFromSFCLike(sfcObj: VueSFCLikeComponent): Component {
  const componentOptions: any = {
    name: sfcObj.name || 'SFCComponent',
    template: sfcObj.template,
  };

  if (sfcObj.props) {
    componentOptions.props = sfcObj.props;
  }

  if (sfcObj.setup) {
    componentOptions.setup = sfcObj.setup;
  }

  if (sfcObj.data) {
    componentOptions.data = sfcObj.data;
  }

  if (sfcObj.methods) {
    componentOptions.methods = sfcObj.methods;
  }

  if (sfcObj.computed) {
    componentOptions.computed = sfcObj.computed;
  }

  return defineComponent(componentOptions);
}

export function createTestEngine<T extends ScenePart>(
  component: Component | VueSFCLikeComponent,
  partDefinitions: T,
  option?: Readonly<Partial<IVueTestEngineOption>>
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));
  const rootId = getNextRootElementId();
  container.setAttribute(rootElementAttributeName, rootId);

  let unmount: () => void;
  let app: App;

  // Create component from SFC-like object if needed
  const compiledComponent = isSFCLikeObject(component)
    ? createComponentFromSFCLike(component)
    : (component as Component);

  try {
    const renderResult = render(compiledComponent, { container });
    unmount = renderResult.unmount;
  } catch (_error) {
    // Fallback to manual Vue app creation if render fails
    app = createApp(compiledComponent);
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
