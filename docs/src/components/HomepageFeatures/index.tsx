import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React, { type JSX, type ReactNode } from 'react';

import styles from './styles.module.css';

type FeatureItem = {
  icon: string;
  iconVariant: 'blue' | 'teal';
  title: string;
  description: ReactNode;
};

const featureList: FeatureItem[] = [
  {
    icon: '♻️',
    iconVariant: 'blue',
    title: 'Write once, test everywhere',
    description:
      'The same driver and assertion code works across React, Vue and Playwright — plus Angular (async setup), Storybook, and plain DOM tests. Learn once, test any UI framework.',
  },
  {
    icon: '🎯',
    iconVariant: 'teal',
    title: 'High-level semantic APIs',
    description: (
      <>
        <code className={styles.inlineCode}>select.selectByLabel(&apos;Option 2&apos;)</code> instead of brittle DOM
        queries. Focus on behavior, not implementation.
      </>
    ),
  },
  {
    icon: '🧩',
    iconVariant: 'blue',
    title: 'Framework-agnostic drivers',
    description:
      'Reuse component drivers across Material-UI, Radix, shadcn/ui and custom components. Component library changes don’t break your tests.',
  },
  {
    icon: '🛡️',
    iconVariant: 'teal',
    title: 'Future-proof architecture',
    description:
      'Framework migrations, library upgrades and environment changes become trivial. Your testing investment scales with your app.',
  },
];

function Feature({ icon, iconVariant, title, description }: FeatureItem): JSX.Element {
  return (
    <article className={styles.card}>
      <div className={clsx(styles.iconTile, styles[iconVariant])} aria-hidden='true'>
        {icon}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardBody}>{description}</p>
    </article>
  );
}

const PACKAGE_TESTS_URL = 'https://github.com/atomic-testing/atomic-testing/tree/main/package-tests';

function ProofStrip(): JSX.Element {
  return (
    <p className={styles.proof}>
      <span className={styles.proofBadge}>✓ verifiable</span>
      Not just a claim: this repo&apos;s own <code className={styles.inlineCode}>*.suite.ts</code> test logic runs
      unmodified under Jest <em>and</em> across Chromium, Firefox &amp; WebKit via Playwright —{' '}
      <Link to='/docs/evaluate/proof-of-portability'>see how portability is tested →</Link> or browse{' '}
      <a href={PACKAGE_TESTS_URL} target='_blank' rel='noopener noreferrer'>
        package-tests/
      </a>{' '}
      in this monorepo.
    </p>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 className={styles.headingTitle}>Why teams adopt it</h2>
        </header>
        <div className={styles.grid}>
          {featureList.map(feature => (
            <Feature key={feature.title} {...feature} />
          ))}
        </div>
        <ProofStrip />
      </div>
    </section>
  );
}
