import { BacktestFactor } from '../../../common/type/CommonType';
import MathUtil from '../../../common/MathUtil';

export class BacktestService {
  /**
   *
   * @param dailyPriceList 날짜별 평가금액
   * @param freeRate 0.01 -> 1%
   */
  public static factor(dailyPriceList: number[], freeRate: number): BacktestFactor {
    const stdDev = MathUtil.calcStd(dailyPriceList);
    const sharpeRatio = MathUtil.calcSharpeRatio(dailyPriceList, 0.01);
    const cagr = MathUtil.calcCagr(dailyPriceList);
    const mdd = MathUtil.calcMdd(dailyPriceList);

    return {
      std: stdDev,
      sharpeRatio: sharpeRatio,
      mdd: mdd,
      cagr: cagr,
    };
  }
}
