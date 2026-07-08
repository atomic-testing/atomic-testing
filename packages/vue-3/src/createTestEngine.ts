import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';
import { render } from '@testing-library/vue';
import { Component, createApp, defineComponent } from 'vue';

import { VueSFCLikeComponent, VueTestEngineOption } from './types';
import { VueInteractor } from './VueInteractor';

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

/**
 * Detect the single Vue-Test-Utils quirk the manual-mount fallback exists for:
 * `@testing-library/vue`'s `render` delegates to `@vue/test-utils`' `mount`,
 * which is a peer dependency not present in every environment (it is absent from
 * this workspace). When it is missing, `render` throws
 * `TypeError: ...mount... is not a function`.
 *
 * Only that quirk warrants the fallback; every other error from `render` is a
 * genuine failure in the component under test and must propagate with its
 * original stack rather than be masked by the fallback's different cleanup
 * semantics (#1049).
 */
function isVueTestUtilsMountUnavailable(error: unknown): boolean {
  return error instanceof TypeError && error.message.includes('mount') && error.message.includes('is not a function');
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
  option?: Readonly<Partial<VueTestEngineOption>>
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));
  const rootId = getNextRootElementId();
  container.setAttribute(rootElementAttributeName, rootId);

  // Create component from SFC-like object if needed
  const compiledComponent = isSFCLikeObject(component)
    ? createComponentFromSFCLike(component)
    : (component as Component);

  const plugins = option?.plugins ?? [];

  let unmount: () => void;
  try {
    const renderResult = render(compiledComponent, {
      container,
      global: {
        plugins,
        // Vue Test Utils stubs <Transition> by default, replacing it with a
        // wrapper element that never runs the enter/leave JS hooks. Component
        // libraries do real work in those hooks (PrimeVue's Dialog binds its
        // Escape listener in onEnter), so the stub silently disables behavior
        // the same shared suite verifies in the Playwright leg. Real
        // transitions resolve immediately under jsdom (computed durations are
        // 0), so rendering them keeps the jsdom DOM aligned with the browser.
        stubs: { transition: false },
      },
    });
    unmount = renderResult.unmount;
  } catch (error) {
    // Narrowly scoped fallback: only the missing-`@vue/test-utils` quirk (see
    // isVueTestUtilsMountUnavailable) is handled by mounting the app directly.
    // Any other error is a real render failure and is rethrown so its stack
    // surfaces instead of being swallowed (#1049).
    if (!isVueTestUtilsMountUnavailable(error)) {
      throw error;
    }
    const app = createApp(compiledComponent);
    for (const plugin of plugins) {
      if (Array.isArray(plugin)) {
        const [pluginInstance, ...pluginOptions] = plugin;
        app.use(pluginInstance, ...pluginOptions);
      } else {
        app.use(plugin);
      }
    }
    app.mount(container);
    unmount = () => app.unmount();
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
  _option?: Readonly<Partial<VueTestEngineOption>>
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
