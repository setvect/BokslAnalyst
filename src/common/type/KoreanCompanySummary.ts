export type KoreanCompanySummary = {
  code: string; // 종목코드
  name: string;
  market: string;
  capitalization: number; // 시가총액(억)
  currentPrice: number;
};

export type StockInfo = {
  stockCode: string; // ISU_SRT_CD - 종목코드
  abbreviation: string; // ISU_ABBRV - 기업명
  marketName: string; // MKT_NM - 거래소
  sectorTypeName: string; // SECT_TP_NM - 소속부
  closePrice: number; // TDD_CLSPRC - 종가
  openPrice: number; // TDD_OPNPRC - 시가
  highPrice: number; // TDD_HGPRC - 고가
  lowPrice: number; // TDD_LWPRC - 저가
  difference: number; // CMPPREVDD_PRC - 대비
  changeRate: number; // FLUC_RT - 등락률
  tradeVolume: number; // ACC_TRDVOL - 거래량
  tradeValue: number; // ACC_TRDVAL - 거래 대금
  marketCap: number; // MKTCAP - 시장총액
  listedShares: number; // LIST_SHRS - 상장주식수
};

export type KrxStockInfo = {
  stocks: StockInfo[]; // OutBlock_1
  currentDatetime: Date; // CURRENT_DATETIME - 수집일
};
