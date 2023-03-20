import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Work with popular UI libraries',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Atomic testings lets you write tests working with popular UI libraries like Material UI, Xyz, and many more
        easily.
      </>
    ),
  },
  {
    title: 'Work with many UI frameworks',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Atomic testing lets you write tests working with popular UI frameworks like React, Angular, Vue, and many more
      </>
    ),
  },
  {
    title: 'Work with many testing strategies',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Whether you prefer to write integration tests with Jest, or end-to-end tests with Playwright, Puppeteer,
        Cypress, etc., Atomic testing gets you covered
      </>
    ),
  },
  {
    title: 'Composable and extendable',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>Make your tests simpler and with composable architecture</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">{Svg ? <Svg className={styles.featureSvg} role="img" /> : null}</div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
