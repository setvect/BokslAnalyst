// 차트 데이터 모델
export type ChartData = {
  symbol: string;
  name: string;
  count: number;
  timeframe: string;
  precision: number;
  origintime: string;
  items: StockOhlcPrice[];
};
