import { ChartDriverBase } from './ChartDriverBase';

/**
 * Driver for the MUI X v9 PieChart.
 *
 * Slices render as `path.MuiPieChart-arc[data-index]` inside one `g.MuiPieChart-series` group
 * per series. A pie's legend lists one item per slice (not per series), so
 * {@link ChartDriverBase.getLegendItems} returns the slice labels.
 * @see https://mui.com/x/react-charts/pie/
 */
export class PieChartDriver extends ChartDriverBase {
  protected seriesDataPointsSelector(seriesIndex: number): string {
    return `.MuiPieChart-series:nth-of-type(${seriesIndex + 1}) path.MuiPieChart-arc`;
  }

  protected dataPointSelector(seriesIndex: number, dataIndex: number): string {
    return `.MuiPieChart-series:nth-of-type(${seriesIndex + 1}) path.MuiPieChart-arc[data-index="${dataIndex}"]`;
  }

  get driverName(): string {
    return 'MuiV9PieChart';
  }
}
