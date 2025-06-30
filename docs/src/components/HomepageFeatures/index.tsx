import React, { JSX } from 'react';

import clsx from 'clsx';

import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Write Once, Test Everywhere',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Same test code works across React, Vue, Playwright, and DOM testing.
        <br />
        <strong>Learn once, test any UI framework.</strong>
      </>
    ),
  },
  {
    title: 'High-Level Semantic APIs',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        <code>muiSelect.selectByLabel('Option 2')</code> instead of complex DOM queries.
        <br />
        <strong>Focus on user behavior, not implementation details.</strong>
      </>
    ),
  },
  {
    title: 'Framework Agnostic Drivers',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Reuse component drivers across Material-UI, Bootstrap, and custom components.
        <br />
        <strong>Component library changes don't break your tests.</strong>
      </>
    ),
  },
  {
    title: 'Future-Proof Architecture',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Framework migrations, library upgrades, and test environment changes become trivial.
        <br />
        <strong>Your testing investment scales with your application.</strong>
      </>
    ),
  },
];

function Feature({ title, Svg, description, index }: FeatureItem & { index: number }) {
  const isOdd = index % 2 === 1;
  const padder = <div className={clsx('col col--6')}></div>;
  return (
    <div className='row'>
      {isOdd ? padder : null}
      <div className={clsx('col col--6')}>
        <div>{Svg ? <Svg className={styles.featureSvg} role='img' /> : null}</div>
        <div className='padding-horiz--md'>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {!isOdd ? padder : null}
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className='container'>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} index={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
