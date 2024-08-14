type KeyMap<T extends keyof any, V> = {
  [Key in T]: V;
};
// 주식 일봉 데이터 모델
export type StockOhlcPrice = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Range = {
  from: Date;
  to: Date;
};

export type BacktestFactor = {
  std: number;
  sharpeRatio: number;
  mdd: number;
  cagr: number;
};
