import { defineComponent, h } from 'vue';

import { directory } from './directory';

/**
 * Path-switching shell: renders the example registered for the current
 * pathname, or the directory listing at any other path.
 */
export const App = defineComponent({
  name: 'App',
  setup() {
    const entry = directory.find(candidate => candidate.path === window.location.pathname);
    return () =>
      entry
        ? h('main', [h('h1', entry.title), h(entry.component)])
        : h('main', [
            h('h1', 'PrimeVue driver examples'),
            h(
              'ul',
              directory.map(candidate =>
                h('li', { key: candidate.path }, [h('a', { href: candidate.path }, candidate.title)])
              )
            ),
          ]);
  },
});
