import fs from 'fs';
import path from 'path';

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// require('prism-react-renderer/themes/github');
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import type { PrismTheme } from 'prism-react-renderer';

// Custom Prism theme: code blocks are always dark navy with the design's token colors,
// in both light and dark site themes. Colors mirror the design tokenizer palette.
const atomicCodeTheme: PrismTheme = {
  plain: { color: '#cbd7e6', backgroundColor: '#0e1726' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#5e7488', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#7e91ab' } },
    { types: ['operator', 'entity', 'url'], style: { color: '#9fb3cc' } },
    { types: ['keyword', 'storage', 'keyword-control', 'atrule'], style: { color: '#c9a6f0' } },
    { types: ['boolean', 'number', 'constant', 'symbol', 'inserted'], style: { color: '#5fe3c8' } },
    { types: ['string', 'char', 'attr-value'], style: { color: '#7fd1f0' } },
    { types: ['function', 'function-variable'], style: { color: '#7fd1f0' } },
    { types: ['class-name', 'maybe-class-name', 'builtin'], style: { color: '#8fd4ff' } },
    { types: ['tag', 'deleted'], style: { color: '#7fb0f5' } },
    { types: ['attr-name', 'property', 'selector'], style: { color: '#9bd0ff' } },
    { types: ['variable', 'parameter'], style: { color: '#cbd7e6' } },
    { types: ['regex', 'important'], style: { color: '#5fe3c8' } },
    { types: ['namespace'], style: { opacity: '0.7' } },
  ],
};

// Packages excluded from the generated API reference — e.g. a frozen/EOL
// package still in packages/ but no longer built, so TypeDoc can't resolve
// its cross-package types (see ADR-005 for the MUI 5 precedent). Currently
// empty: MUI 5 / MUI-X 5 were fully extracted to a separate repo (ADR-014)
// rather than frozen in place, so there's nothing to exclude right now.
// Kept as a named export (not deleted) because
// docs/scripts/check-doc-driver-sync.mjs parses this constant by name to
// gate narrative docs against silently un-flagging an excluded package.
const EXCLUDED_FROM_DOCS = new Set([]);

// Applies a reader's persisted sidebar width BEFORE first paint so the sidebar
// doesn't flash from the stock 300px to the saved value after hydration. The
// clamp range must match DocSidebarResizer's MIN/MAX (see src/theme/DocSidebarResizer).
function sidebarWidthInitPlugin() {
  return {
    name: 'sidebar-width-init',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: [
              '(function(){try{',
              "var w=localStorage.getItem('docSidebarWidth');",
              'if(w){var n=parseInt(w,10);',
              // Clamp (not range-check) so an out-of-range stored value is still
              // applied pre-paint, matching DocSidebarResizer.clampWidth() — a
              // range-check would skip it and let the component reintroduce a flash.
              'if(!isNaN(n)){n=Math.max(200,Math.min(480,n));',
              "document.documentElement.style.setProperty('--doc-sidebar-width',n+'px');}}",
              '}catch(e){}})();',
            ].join(''),
          },
        ],
      };
    },
  };
}

function getPackageNames() {
  const baseDir = path.join(__dirname, '../packages');
  const packageNames = fs.readdirSync(baseDir).filter(name => {
    if (name.startsWith('internal-') || EXCLUDED_FROM_DOCS.has(name)) {
      return false;
    }
    const fullPath = path.join(baseDir, name);
    return fs.statSync(fullPath).isDirectory();
  });
  return packageNames.map(name => `../packages/${name}`);
}

const config: Config = {
  title: 'Atomic Testing',
  tagline: 'Portable UI testing library: Simplify and unify across frameworks and libraries',
  favicon: 'img/favicon.ico',

  url: 'https://www.atomic-testing.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'atomic-testing', // Usually your GitHub org/user name.
  projectName: 'atomic-testing', // Usually your repo name.
  deploymentBranch: 'gh-pages', // Branch that GitHub pages will deploy from.

  onBrokenLinks: 'throw',

  trailingSlash: true,

  future: {
    faster: true, // Enable faster builds (renamed from experimental_faster in Docusaurus 3.10)
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      // https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/docusaurus-plugin-typedoc
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: [...getPackageNames()],
        entryPointStrategy: 'packages',
        tsconfig: '../tsconfig.json',
        sidebar: {},
        // Emit each package directly under api/ (e.g. api/core) instead of
        // nesting it under an api/@atomic-testing/ scope directory. This drops
        // the redundant "@atomic-testing" grouping layer from the API sidebar
        // while each package keeps its full "@atomic-testing/…" label (derived
        // from the generated index page title). See sidebars.ts → API Reference.
        excludeScopesInPaths: true,
        // Partition each class/interface page's members into own / inherited /
        // protected sections (see typedoc/partition-members-plugin.mjs). Absolute
        // path because TypeDoc resolves relative plugin specifiers from its own
        // node_modules location, not from here.
        plugin: [path.join(__dirname, 'typedoc', 'partition-members-plugin.mjs')],
        theme: 'markdown-partitioned',
      },
    ],
    sidebarWidthInitPlugin,
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //
          // The `api/` subtree is generated by docusaurus-plugin-typedoc at build time
          // and is gitignored (see /.gitignore) — there's no source file in the repo for
          // "Edit this page" to link to, so suppress the link there by returning
          // `undefined` (per EditUrlFunction in @docusaurus/plugin-content-docs) instead
          // of building a URL to a path that 404s.
          editUrl: ({ docPath }) =>
            docPath.startsWith('api/') || docPath.startsWith('api\\')
              ? undefined
              : `https://github.com/atomic-testing/atomic-testing/tree/main/docs/docs/${docPath}`,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.png',
    navbar: {
      title: 'Atomic Testing',
      logo: {
        alt: 'Atomic Testing Logo',
        src: 'img/logo-atom.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'quick-start',
          position: 'left',
          label: 'Getting Started',
        },
        {
          type: 'doc',
          docId: 'concepts',
          position: 'left',
          label: 'Core Concepts',
        },
        {
          type: 'doc',
          docId: 'api-overview',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/atomic-testing/atomic-testing',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: '/docs/quick-start',
            },
            {
              label: 'Why Atomic Testing?',
              to: '/docs/why-atomic-testing',
            },
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Concepts',
              to: '/docs/concepts',
            },
            {
              label: 'API overview',
              to: '/docs/api-overview',
            },
            {
              label: 'Best practices',
              to: '/docs/best-practices',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/qbeqWTYzEH',
            },
            {
              label: 'Twitter/X',
              href: 'https://twitter.com/TestingAtomic',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/atomic-testing/atomic-testing',
            },
          ],
        },
      ],
      copyright: `Copyright © 2022-${new Date().getFullYear()} Tangent Lin`,
    },
    prism: {
      theme: atomicCodeTheme,
      darkTheme: atomicCodeTheme,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // @see https://docusaurus.io/docs/search
    algolia: {
      appId: 'HKBV6KED15',
      apiKey: '31786977c036097aab45afff518ca641',
      indexName: 'atomic-testing',
      contextualSearch: false,
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/docs/',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
