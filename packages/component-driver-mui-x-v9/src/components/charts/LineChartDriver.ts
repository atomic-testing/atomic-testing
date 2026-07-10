import { ChartDriverBase } from './ChartDriverBase';

/**
 * Driver for the MUI X v9 LineChart.
 *
 * Data points render as `circle.MuiLineChart-mark[data-index]` inside one clip group per series
 * under `g.MuiLineChart-markPlot` — only when the series has `showMark` enabled; a mark-less
 * line has no per-point DOM to count or hover.
 * @see https://mui.com/x/react-charts/lines/
 */
export class LineChartDriver extends ChartDriverBase {
  protected seriesDataPointsSelector(seriesIndex: number): string {
    return `.MuiLineChart-markPlot g:nth-of-type(${seriesIndex + 1}) circle.MuiLineChart-mark`;
  }

  protected dataPointSelector(seriesIndex: number, dataIndex: number): string {
    return `.MuiLineChart-markPlot g:nth-of-type(${seriesIndex + 1}) circle.MuiLineChart-mark[data-index="${dataIndex}"]`;
  }

  get driverName(): string {
    return 'MuiV9LineChart';
  }
}
