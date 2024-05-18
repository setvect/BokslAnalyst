export type KoreanCompanySummary = {
  code: string; // 종목코드
  name: string;
  market: string;
  capitalization: number; // 시가총액(억)
  currentPrice: number;
};
