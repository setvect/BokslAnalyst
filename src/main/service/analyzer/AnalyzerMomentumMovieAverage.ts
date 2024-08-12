// 모멘텀 이평선 가중 전략
import { all, create } from 'mathjs';

import createInitializedProxy from '../../repository/nosql/RepositoryProxy';
import KorStockPriceRepository from '../../repository/nosql/KorStockPriceRepository';
import KorStockCode from '../../../common/KorStockCode';
import { StockDailyData } from '../../../common/type/NaverStockPrice';
import BokslConstant from '../../config/BokslConstant';

export default class AnalyzerMomentumMovieAverage {
  public static async analyze() {
    const korStockRepository = createInitializedProxy(new KorStockPriceRepository(KorStockCode.KODEX_200));
    const korStockList = await korStockRepository.findAll();
    const movingAverages = this.calculateMovingAverages(korStockList.items, [20, 40, 60, 80, 100]);

    const dailyPriceList = korStockList.items.map((item) => item.close);

    this.calcStd(dailyPriceList);

    const sharpeRatio = AnalyzerMomentumMovieAverage.calcSharpeRatio(dailyPriceList, 0.01);
    console.log(`샤프지수: ${sharpeRatio}`);

    const cagr = this.calcCagr(dailyPriceList);
    console.log(`CAGR: ${cagr}`);
    const mdd = this.calcMdd(dailyPriceList);
    console.log(`MDD: ${mdd}`);
  }

  private static calculateMovingAverages(data: StockDailyData[], periods: number[]) {
    const result = new Map<number, Map<string, number>>();

    periods.forEach((period) => {
      const averages = new Map<string, number>();
      for (let i = period - 1; i < data.length; i++) {
        const window = data.slice(i - period + 1, i + 1);
        const sum = window.reduce((acc, item) => acc + item.close, 0);
        averages.set(data[i].date, sum / period);
      }
      result.set(period, averages);
    });

    return result;
  }

  private static calcCagr(dailyPriceList: number[]) {
    if (dailyPriceList.length < 2) {
      throw new Error('가격 배열에는 최소 두 개 이상의 값이 필요합니다.');
    }

    const beginningValue = dailyPriceList[0];
    const endingValue = dailyPriceList[dailyPriceList.length - 1]; // 최종 가치

    const periodByYear = dailyPriceList.length / BokslConstant.BUSINESS_DAY;
    return (endingValue / beginningValue) ** (1 / periodByYear) - 1;
  }

  private static calcSharpeRatio(dailyPriceList: number[], freeRate: number) {
    const dailyReturn = AnalyzerMomentumMovieAverage.calcGeoAvgReturn(dailyPriceList);
    const yearlyReturn = dailyReturn * BokslConstant.BUSINESS_DAY;

    const stdDev = AnalyzerMomentumMovieAverage.calcStd(dailyPriceList);
    const yearlyStdDev = stdDev * Math.sqrt(BokslConstant.BUSINESS_DAY);

    return (yearlyReturn - freeRate) / yearlyStdDev;
  }

  /**
   * 주어진 값 변화를 기반으로 기하 평균 수익 계산
   */
  private static calcGeoAvgReturn(dailyPriceList: number[]): number {
    if (dailyPriceList.length < 2) {
      throw new Error('가격 배열에는 최소 두 개 이상의 값이 필요합니다.');
    }

    // 일일 수익률 계산
    const dailyReturns = dailyPriceList.slice(1).map((price, index) => (price - dailyPriceList[index]) / dailyPriceList[index]);

    const product = dailyReturns.reduce((acc, dailyReturn) => acc * (1 + dailyReturn), 1);

    // 기하평균 계산
    return Math.pow(product, 1 / dailyReturns.length) - 1;
  }

  private static calcStd(dailyPriceList: number[]) {
    const math = create(all);

    const returns = dailyPriceList.slice(1).map((value, index) => (value - dailyPriceList[index]) / dailyPriceList[index]);
    const stdDev = math.std(returns);
    return stdDev as unknown as number;
  }

  private static calcMdd(items: number[]) {
    let peak = items[0];
    let maxDrawdown = 0;

    for (let i = 1; i < items.length; i++) {
      if (items[i] > peak) {
        peak = items[i];
      } else {
        const drawdown = (peak - items[i]) / peak;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    }

    return maxDrawdown;
  }

  private static calcDrawdownSerial(items: number[]): number[] {
    let peak = items[0];
    return items.map((value) => {
      peak = Math.max(peak, value);
      const drawdown = (peak - value) / peak;
      return drawdown > 0 ? drawdown : 0;
    });
  }
}
