import { IExampleUIUnit } from '@atomic-testing/core';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import React, { JSX } from 'react';

// Explicit width/height gives the charts a drawing area without ResizeObserver measurements —
// required under jsdom (no layout engine) and harmless in a browser. skipAnimation keeps mark
// geometry deterministic for e2e reads.
export const BasicCharts: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <div data-testid='basic-bar-chart'>
        <BarChart
          width={500}
          height={300}
          skipAnimation
          xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
          series={[
            { data: [4, 3, 5, 2], label: 'Series A' },
            { data: [1, 6, 3, 4], label: 'Series B' },
          ]}
        />
      </div>
      <div data-testid='basic-line-chart'>
        <LineChart
          width={500}
          height={300}
          skipAnimation
          xAxis={[{ data: [1, 2, 3, 4] }]}
          series={[{ data: [2, 5, 3, 7], label: 'Trend', showMark: true }]}
        />
      </div>
      <div data-testid='basic-pie-chart'>
        <PieChart
          width={400}
          height={300}
          skipAnimation
          series={[
            {
              data: [
                { id: 0, value: 10, label: 'Alpha' },
                { id: 1, value: 20, label: 'Beta' },
                { id: 2, value: 15, label: 'Gamma' },
              ],
            },
          ]}
        />
      </div>
    </React.Fragment>
  );
};

/**
 * Basic BarChart/LineChart/PieChart examples from MUI's website
 * @see https://mui.com/x/react-charts/
 */
export const basicChartsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Charts',
  ui: <BasicCharts />,
};
