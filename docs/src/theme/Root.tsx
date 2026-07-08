import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { type ReactNode } from 'react';

import DocSidebarResizer from './DocSidebarResizer';

// Swizzle of `@theme/Root` — the app-level wrapper that sits above the theme
// `<Layout>`, inside the Router. We render `children` untouched and only ADD a
// global overlay: the drag handle that makes the doc sidebar resizable. This
// keeps the doc layout (DocRoot/Layout, the sidebar's sticky/collapse/mobile
// behavior) entirely stock — the handle just drives the `--doc-sidebar-width`
// CSS variable the native sidebar already reads.
export default function Root({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      {children}
      <BrowserOnly>{() => <DocSidebarResizer />}</BrowserOnly>
    </>
  );
}
