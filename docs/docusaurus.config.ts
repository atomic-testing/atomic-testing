// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// require('prism-react-renderer/themes/github');
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes } from 'prism-react-renderer';

const darkCodeTheme = themes.dracula; // require('prism-react-renderer/themes/dracula');
const lightCodeTheme = themes.github;

const config: Config = {
  title: 'Atomic Testing',
  tagline: 'Portable UI testing library: Simplify and unify across frameworks and libraries',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.atomic-testing.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'atomic-testing', // Usually your GitHub org/user name.
  projectName: 'atomic-testing', // Usually your repo name.
  deploymentBranch: 'gh-pages', // Branch that GitHub pages will deploy from.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  trailingSlash: true,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      // https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/docusaurus-plugin-typedoc
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: [
          '../packages/core',
          '../packages/dom-core',
          '../packages/playwright',
          '../packages/react',
          '../packages/react-19',
          '../packages/component-driver-html',
          '../packages/component-driver-mui-v5',
          '../packages/component-driver-mui-v6',
          '../packages/component-driver-mui-v7',
          '../packages/component-driver-mui-x-v5',
          '../packages/component-driver-mui-x-v6',
          '../packages/component-driver-mui-x-v7',
          '../packages/component-driver-mui-x-v8',
        ],
        entryPointStrategy: 'packages',
        tsconfig: '../tsconfig.json',
        sidebar: {},
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/atomic-testing/atomic-testing/tree/main/docs/docs/',
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
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Get Started',
        },
        {
          type: 'doc',
          docId: 'concepts',
          position: 'left',
          label: 'Concepts',
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
          ],
        },
        {
          title: 'Community',
          items: [
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/atomic-testing',
            // },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/atomic-testing',
            // },
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
              label: 'Best practices',
              to: '/docs/best-practices',
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
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
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
