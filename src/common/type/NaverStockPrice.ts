// 주식 일봉 데이터 모델
export type StockDailyData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// 차트 데이터 모델
export type ChartData = {
  symbol: string;
  name: string;
  count: number;
  timeframe: string;
  precision: number;
  origintime: string;
  items: StockDailyData[];
};
