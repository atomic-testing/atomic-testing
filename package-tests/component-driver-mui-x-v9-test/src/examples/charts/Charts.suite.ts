import {
  BarChartDriver,
  LineChartDriver,
  PieChartDriver,
  ScatterChartDriver,
} from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicChartsUIExample } from './Charts.examples';

export const chartsExampleScenePart = {
  barChart: {
    locator: byDataTestId('basic-bar-chart'),
    driver: BarChartDriver,
  },
  lineChart: {
    locator: byDataTestId('basic-line-chart'),
    driver: LineChartDriver,
  },
  pieChart: {
    locator: byDataTestId('basic-pie-chart'),
    driver: PieChartDriver,
  },
  scatterChart: {
    locator: byDataTestId('basic-scatter-chart'),
    driver: ScatterChartDriver,
  },
} satisfies ScenePart;

export const chartsExample: IExampleUnit<typeof chartsExampleScenePart, JSX.Element> = {
  ...basicChartsUIExample,
  scene: chartsExampleScenePart,
};

/**
 * The structural chart reads — legend, series labels, axis labels, data-point counts — which
 * are portable between jsdom (with the chart shims in jest.setup.js) and real browsers.
 * Geometry-dependent behavior (hover → tooltip) lives in the e2e-only interaction suite.
 */
export const chartsTestSuite: TestSuiteInfo<typeof chartsExampleScenePart> = {
  title: 'Charts',
  url: '/charts',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    const engine = useTestEngine(chartsExample.scene, getTestEngine, { beforeEach, afterEach });

    test('bar chart legend lists both series', async () => {
      assertEqual(await engine().parts.barChart.getLegendItems(), ['Series A', 'Series B']);
      assertEqual(await engine().parts.barChart.getSeriesLabels(), ['Series A', 'Series B']);
    });

    test('bar chart x-axis renders the band labels', async () => {
      assertEqual(await engine().parts.barChart.getAxisLabels('x'), ['Q1', 'Q2', 'Q3', 'Q4']);
    });

    test('bar chart renders one bar per category, per series', async () => {
      assertEqual(await engine().parts.barChart.getDataPointCount(0), 4);
      assertEqual(await engine().parts.barChart.getDataPointCount(1), 4);
    });

    test('line chart renders one mark per data point', async () => {
      assertEqual(await engine().parts.lineChart.getSeriesLabels(), ['Trend']);
      assertEqual(await engine().parts.lineChart.getDataPointCount(), 4);
    });

    test('pie chart legend lists the slices and renders one arc each', async () => {
      assertEqual(await engine().parts.pieChart.getLegendItems(), ['Alpha', 'Beta', 'Gamma']);
      assertEqual(await engine().parts.pieChart.getDataPointCount(), 3);
    });

    test('scatter chart legend lists both series', async () => {
      assertEqual(await engine().parts.scatterChart.getLegendItems(), ['Group A', 'Group B']);
      assertEqual(await engine().parts.scatterChart.getSeriesLabels(), ['Group A', 'Group B']);
    });

    test('scatter chart renders one marker per point, per series', async () => {
      assertEqual(await engine().parts.scatterChart.getDataPointCount(0), 5);
      assertEqual(await engine().parts.scatterChart.getDataPointCount(1), 5);
    });

    test('no tooltip is shown before any pointer interaction', async () => {
      assertEqual(await engine().parts.barChart.getTooltipText(), undefined);
    });
  },
};
