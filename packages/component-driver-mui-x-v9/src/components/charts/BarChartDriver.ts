import { ChartDriverBase } from './ChartDriverBase';

/**
 * Driver for the MUI X v9 BarChart.
 *
 * Bars render as `rect.MuiBarChart-element` siblings inside one `g.MuiBarChart-series` group per
 * series (groups in series order); bars carry no index attribute, so both series and bar are
 * addressed positionally.
 * @see https://mui.com/x/react-charts/bars/
 */
export class BarChartDriver extends ChartDriverBase {
  protected seriesDataPointsSelector(seriesIndex: number): string {
    return `.MuiBarChart-series:nth-of-type(${seriesIndex + 1}) rect.MuiBarChart-element`;
  }

  protected dataPointSelector(seriesIndex: number, dataIndex: number): string {
    return `${this.seriesDataPointsSelector(seriesIndex)}:nth-of-type(${dataIndex + 1})`;
  }

  get driverName(): string {
    return 'MuiV9BarChart';
  }
}
