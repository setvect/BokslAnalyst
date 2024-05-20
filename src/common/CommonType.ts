// eslint-disable-next-line import/prefer-default-export
export enum IPC_CHANNEL {
  PageAboutBoksl = 'PageAboutBoksl',
  PageChangePassword = 'PageChangePassword',
  FindOpen = 'FindOpen',
  CallFindDocument = 'CallFindDocument',
}

export enum PeriodType {
  PERIOD_DAY = 'PERIOD_DAY',
  PERIOD_WEEK = 'PERIOD_WEEK',
  PERIOD_MONTH = 'PERIOD_MONTH',
}

export enum FinancialMetricType {
  SALES_REVENUE = 'SALES_REVENUE',
  TOTAL_ASSETS = 'TOTAL_ASSETS',
  // 여기에 다른 재무제표 항목 유형을 추가할 수 있습니다.
}

export enum AccountClose {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

export enum NationCode {
  KR = 'KR',
  US = 'US',
  JP = 'JP',
}
