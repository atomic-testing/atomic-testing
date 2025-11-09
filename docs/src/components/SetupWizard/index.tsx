import React, { useState } from 'react';

import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

const frameworkOptions = ['react', 'vue'] as const;
const designOptions = ['mui', 'homegrown', 'none'] as const;
const testOptions = ['unit', 'e2e'] as const;

type Framework = (typeof frameworkOptions)[number];
type Design = (typeof designOptions)[number];
type TestMethod = (typeof testOptions)[number];

const pkgMap: Record<Framework, Record<Design, Record<TestMethod, string[]>>> = {
  react: {
    mui: {
      unit: ['@atomic-testing/react-18', '@atomic-testing/component-driver-mui-v7', '@atomic-testing/core'],
      e2e: ['@atomic-testing/playwright', '@atomic-testing/component-driver-mui-v7'],
    },
    homegrown: {
      unit: ['@atomic-testing/react-18', '@atomic-testing/component-driver-html', '@atomic-testing/core'],
      e2e: ['@atomic-testing/playwright', '@atomic-testing/component-driver-html'],
    },
    none: {
      unit: ['@atomic-testing/react-18', '@atomic-testing/component-driver-html', '@atomic-testing/core'],
      e2e: ['@atomic-testing/playwright', '@atomic-testing/component-driver-html'],
    },
  },
  vue: {
    mui: {
      unit: ['@atomic-testing/vue-3', '@atomic-testing/component-driver-mui-v7', '@atomic-testing/core'],
      e2e: ['@atomic-testing/playwright', '@atomic-testing/component-driver-mui-v7'],
    },
    homegrown: {
      unit: ['@atomic-testing/vue-3', '@atomic-testing/component-driver-html', '@atomic-testing/core'],
      e2e: ['@atomic-testing/playwright', '@atomic-testing/component-driver-html'],
    },
    none: {
      unit: ['@atomic-testing/vue-3', '@atomic-testing/component-driver-html', '@atomic-testing/core'],
      e2e: ['@atomic-testing/playwright', '@atomic-testing/component-driver-html'],
    },
  },
};

export default function SetupWizard() {
  const [framework, setFramework] = useState<Framework>('react');
  const [design, setDesign] = useState<Design>('mui');
  const [testMethod, setTestMethod] = useState<TestMethod>('unit');

  const packages = pkgMap?.[framework]?.[design]?.[testMethod];

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <label>
          UI Framework:
          <select value={framework} onChange={e => setFramework(e.target.value as Framework)}>
            {frameworkOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <label>
          Design System:
          <select value={design} onChange={e => setDesign(e.target.value as Design)}>
            {designOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <label>
          Testing Method:
          <select value={testMethod} onChange={e => setTestMethod(e.target.value as TestMethod)}>
            {testOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>
      {packages ? (
        <Tabs>
          <TabItem value='pnpm' label='pnpm'>
            {`pnpm add ${packages.join(' ')}`}
          </TabItem>
          <TabItem value='npm' label='npm'>
            {`npm install ${packages.join(' ')}`}
          </TabItem>
          <TabItem value='yarn' label='yarn'>
            {`yarn add ${packages.join(' ')}`}
          </TabItem>
        </Tabs>
      ) : (
        <p>
          Sorry, we don&apos;t have libraries for that combination yet. Please{' '}
          <a href='https://github.com/atomic-testing/atomic-testing/issues'>open an issue</a> to request support.
        </p>
      )}
    </div>
  );
}
