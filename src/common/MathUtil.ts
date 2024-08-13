import BokslConstant from '../main/config/BokslConstant';
import { all, create } from 'mathjs';

import { StockOhlcPrice } from './type/CommonType';

export default class MathUtil {
  /**
   * 주식 데이터의 이동평균을 계산합니다.
   *
   * @param {StockOhlcPrice[]} data - 주식 일봉 데이터
   * @param {number[]} periodList - 이동평균 기간 목록
   * @return {Map<number, Map<string, number>>} 이동평균 데이터
   */
  public static calculateMovingAverages(data: StockOhlcPrice[], periodList: number[]): Map<number, Map<string, number>> {
    const result = new Map<number, Map<string, number>>();

    periodList.forEach((period) => {
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

  public static calcCagr(dailyPriceList: number[]) {
    if (dailyPriceList.length < 2) {
      throw new Error('가격 배열에는 최소 두 개 이상의 값이 필요합니다.');
    }

    const beginningValue = dailyPriceList[0];
    const endingValue = dailyPriceList[dailyPriceList.length - 1]; // 최종 가치

    const periodByYear = dailyPriceList.length / BokslConstant.BUSINESS_DAY;
    return (endingValue / beginningValue) ** (1 / periodByYear) - 1;
  }

  public static calcSharpeRatio(dailyPriceList: number[], freeRate: number) {
    const dailyReturn = MathUtil.calcGeoAvgReturn(dailyPriceList);
    const yearlyReturn = dailyReturn * BokslConstant.BUSINESS_DAY;

    const stdDev = MathUtil.calcStd(dailyPriceList);
    const yearlyStdDev = stdDev * Math.sqrt(BokslConstant.BUSINESS_DAY);

    return (yearlyReturn - freeRate) / yearlyStdDev;
  }

  /**
   * 주어진 값 변화를 기반으로 기하 평균 수익 계산
   */
  public static calcGeoAvgReturn(dailyPriceList: number[]): number {
    if (dailyPriceList.length < 2) {
      throw new Error('가격 배열에는 최소 두 개 이상의 값이 필요합니다.');
    }

    // 일일 수익률 계산
    const dailyReturns = dailyPriceList.slice(1).map((price, index) => (price - dailyPriceList[index]) / dailyPriceList[index]);

    const product = dailyReturns.reduce((acc, dailyReturn) => acc * (1 + dailyReturn), 1);

    // 기하평균 계산
    return Math.pow(product, 1 / dailyReturns.length) - 1;
  }

  public static calcStd(dailyPriceList: number[]) {
    const math = create(all);

    const returns = dailyPriceList.slice(1).map((value, index) => (value - dailyPriceList[index]) / dailyPriceList[index]);
    const stdDev = math.std(returns);
    return stdDev as unknown as number;
  }

  public static calcMdd(items: number[]) {
    let peak = items[0];
    let maxDrawdown = 0;

    for (let i = 1; i < items.length; i += 1) {
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

  public static calcDrawdownSerial(items: number[]): number[] {
    let peak = items[0];
    return items.map((value) => {
      peak = Math.max(peak, value);
      const drawdown = (peak - value) / peak;
      return drawdown > 0 ? drawdown : 0;
    });
  }
}
