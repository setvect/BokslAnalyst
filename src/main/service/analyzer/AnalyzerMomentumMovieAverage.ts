// 모멘텀 이평선 가중 전략
import createInitializedProxy from '../../repository/nosql/RepositoryProxy';
import KorStockPriceRepository from '../../repository/nosql/KorStockPriceRepository';
import KorStockCode from '../../../common/KorStockCode';
import MathUtil from '../../../common/MathUtil';

export default class AnalyzerMomentumMovieAverage {
  public static async analyze() {
    const korStockRepository = createInitializedProxy(new KorStockPriceRepository(KorStockCode.KODEX_200));
    const korStockList = await korStockRepository.findAll();
    const movingAverages = MathUtil.calculateMovingAverages(korStockList.items, [20, 40, 60, 80, 100]);

    const dailyPriceList = korStockList.items.map((item) => item.close);

    MathUtil.calcStd(dailyPriceList);

    const sharpeRatio = MathUtil.calcSharpeRatio(dailyPriceList, 0.01);
    console.log(`샤프지수: ${sharpeRatio}`);

    const cagr = MathUtil.calcCagr(dailyPriceList);
    console.log(`CAGR: ${cagr}`);
    const mdd = MathUtil.calcMdd(dailyPriceList);
    console.log(`MDD: ${mdd}`);
  }
}
