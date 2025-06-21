import React from 'react';

import clsx from 'clsx';

import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Unified Testing Solution',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Seamlessly integrate with top UI frameworks (React, Vue&nbsp;3, vanilla&nbsp;JS, Angular) and testing tools
        (Playwright, Cypress, DOM testing) for a streamlined and efficient testing experience
      </>
    ),
  },
  {
    title: 'Broad Compatibility',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Effortlessly drive applications using popular UI libraries like Material UI and Bootstrap, ensuring a consistent
        and flawless user experience across platforms.
      </>
    ),
  },
  {
    title: 'Simplified Testing',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Our portable library reduces the complexity of UI testing, enabling developers to focus on building high-quality
        applications with ease and confidence.
      </>
    ),
  },
  {
    title: 'Composable and extendable',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>Make your tests simpler and with composable architecture</>,
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
