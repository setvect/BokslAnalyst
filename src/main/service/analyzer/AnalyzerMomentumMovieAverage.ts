// 모멘텀 이평선 가중 전략
import moment from 'moment';
import _ from 'lodash';
import createInitializedProxy from '../../repository/nosql/RepositoryProxy';
import KorStockPriceRepository from '../../repository/nosql/KorStockPriceRepository';
import KorStockCode from '../../../common/KorStockCode';
import MathUtil from '../../../common/MathUtil';
import { Trade, TradeType } from '../../model/Trade';
import { objectToString } from '../../../common/CommonUtil';
import DateRange from '../../../common/model/DateRange';

export default class AnalyzerMomentumMovieAverage {
  public static async analyze(condition: MomentumMovieAverageCondition) {
    const korStockRepository = createInitializedProxy(new KorStockPriceRepository(KorStockCode.KODEX_200));
    const korStockList = await korStockRepository.findAll();
    const movingAverages = MathUtil.calculateMovingAverages(korStockList.items, condition.periodStep);
    const priceObj = _.keyBy(korStockList.items, 'date');
    const tradeHistory: Trade[] = [];

    // 가장 큰 key 값 찾기
    const maxPeriod = _.max(Array.from(movingAverages.keys()))!;

    const maxPeriodDate = _.chain(Array.from(movingAverages.get(maxPeriod)!.keys()))
      .map((dateStr) => moment(dateStr, 'YYYYMMDD').toDate())
      .sortBy()
      .value();

    let currentCash = condition.cash;
    let currentStockQuantity = 0;
    let beforeCrossedCount = 0;

    for (let i = 1; i < maxPeriodDate.length; i += 1) {
      const beforeDate = maxPeriodDate[i - 1];
      const beforeDateStr = moment(beforeDate).format('YYYYMMDD');

      // 이평선 돌파 여부 체크. 결과를 바탕으로 다음날 시가 매매 결정
      const beforeMovingAveragePrice = AnalyzerMomentumMovieAverage.getMovingAveragePrice(movingAverages, beforeDate)!;
      const beforeClosePrice = priceObj[beforeDateStr].close;
      // 어제 종가 기준으로 이평선 돌파 정보
      const movingAveragesBreaking = AnalyzerMomentumMovieAverage.calculateMovingAveragesInfo(beforeMovingAveragePrice, beforeClosePrice);

      const currentDate = maxPeriodDate[i];
      const currentDateStr = moment(currentDate).format('YYYYMMDD');

      // 이평선 돌파한 횟수
      const currentCrossedCount = Array.from(movingAveragesBreaking.values()).filter((info) => info.isCrossed).length;

      // 매매 진행
      if (beforeCrossedCount !== currentCrossedCount) {
        const { open } = priceObj[currentDateStr];

        const valuation = currentCash + currentStockQuantity * open;
        // 보유해야될 주식 비율
        const holdingStockRatio = currentCrossedCount / condition.periodStep.length;
        // 현재 주식 비율
        const currentStockRate = (currentStockQuantity * open) / valuation;

        // 매도
        if (currentStockRate > holdingStockRatio) {
          const sellQuantity = Math.floor((valuation * (currentStockRate - holdingStockRatio)) / open);
          const trade = new Trade(condition.stockCode, open, sellQuantity, currentDate, TradeType.SELL, condition.stockCode);
          tradeHistory.push(trade);
          currentCash += trade.getPrice() * trade.getQuantity();
          currentStockQuantity -= trade.getQuantity();
        }
        // 매수
        else {
          const buyQuantity = Math.floor((valuation * (holdingStockRatio - currentStockRate)) / open);
          const trade = new Trade(condition.stockCode, open, buyQuantity, currentDate, TradeType.BUY, condition.stockCode);
          tradeHistory.push(trade);
          currentCash -= trade.getPrice() * trade.getQuantity();
          currentStockQuantity += trade.getQuantity();
        }
        beforeCrossedCount = currentCrossedCount;
      }
    }

    tradeHistory.forEach((trade) => {
      console.log(objectToString(trade));
    });

    // 평가금액
    const lastDateStr = moment(maxPeriodDate[maxPeriodDate.length - 1]).format('YYYYMMDD');
    const finalBalance = currentCash + currentStockQuantity * priceObj[lastDateStr].close;
    console.log(`최종 평가금액: ${finalBalance}`);
  }

  /**
   * 현재 날짜를 기준으로 이동 평균 가격을 가져옵니다.
   *
   * @param movingAverages - 이동 평균 값을 포함하는 맵 <이평기간, <날짜, 평균가격>>
   * @param current - 현재 날짜
   * @returns 이동 평균 가격을 포함하는 객체 {이평기간: 평균가격}
   */
  private static getMovingAveragePrice(movingAverages: Map<number, Map<string, number>>, current: Date) {
    const currentDateStr = moment(current).format('YYYYMMDD');
    const averagePrice: { [key: number]: number } = {};

    movingAverages.forEach((average, period) => {
      const value = average.get(currentDateStr)!;
      averagePrice[period] = value;
    });

    return averagePrice;
  }

  private static calculateMovingAveragesInfo(averagePrice: { [key: number]: number }, close: number) {
    const periodStep = Object.keys(averagePrice).map((key) => parseInt(key, 10));
    return periodStep.reduce((acc, period) => {
      const average = averagePrice[period];
      const isCrossed = close > average;
      acc.set(period, { averagePrice: average, isCrossed });
      return acc;
    }, new Map<number, MovingAveragesInfo>());
  }
}

type MovingAveragesInfo = {
  averagePrice: number;
  isCrossed: boolean;
};

export type MomentumMovieAverageCondition = {
  // 매매 기간
  range: DateRange;

  // 투자금액
  cash: number;

  // 주식 종목
  stockCode: string;

  // 이평선 기간
  periodStep: number[];

  // 조건에 대한 설명. 리포트에서 사용하기 위함
  comment: String;
};
