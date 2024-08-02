export type KoreanCompanySummary = {
  code: string; // 종목코드
  name: string;
  market: string;
  capitalization: number; // 시가총액(억)
  currentPrice: number;
};

export type KrxStock = {
  stockCode: string; // ISU_SRT_CD - 종목코드
  companyName: string; // ISU_ABBRV - 기업명
  exchange: string; // MKT_NM - 거래소
  listingSection: string; // SECT_TP_NM - 소속부
  closingPrice: number; // TDD_CLSPRC - 종가
  openingPrice: number; // TDD_OPNPRC - 시가
  highPrice: number; // TDD_HGPRC - 고가
  lowPrice: number; // TDD_LWPRC - 저가
  change: number; // CMPPREVDD_PRC - 대비
  changeRate: number; // FLUC_RT - 등락률
  volume: number; // ACC_TRDVOL - 거래량
  tradingValue: number; // ACC_TRDVAL - 거래 대금
  marketCap: number; // MKTCAP - 시장총액
  sharesOutstanding: number; // LIST_SHRS - 상장주식수
};

export type KrxStockPrice = {
  stockList: KrxStock[]; // OutBlock_1
  currentDatetime: Date; // CURRENT_DATETIME - 수집일
};

export type KrxValue = {
  stockCode: string; // ISU_SRT_CD - 종목코드
  companyName: string; // ISU_ABBRV - 기업명
  closingPrice: number; // TDD_CLSPRC - 종가
  change: number; // CMPPREVDD_PRC - 대비
  changeRate: number; // FLUC_RT - 등락률
  eps: number; // EPS
  per: number; // PER
  bps: number; // BPS
  pbr: number; // PBR
  dividend: number; // DPS - 배당금
  dividendYield: number; // DVD_YLD - 배당률
};

export type KrxStockValue = {
  valueList: KrxValue[]; // OutBlock_1
  currentDatetime: Date; // CURRENT_DATETIME - 수집일
};
