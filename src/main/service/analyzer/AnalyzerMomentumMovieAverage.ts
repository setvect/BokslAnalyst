// 모멘텀 이평선 가중 전략
import moment from 'moment';
import createInitializedProxy from '../../repository/nosql/RepositoryProxy';
import KorStockPriceRepository from '../../repository/nosql/KorStockPriceRepository';
import KorStockCode from '../../../common/KorStockCode';
import MathUtil from '../../../common/MathUtil';
import { BacktestService } from './BacktestService';
import { objectToString } from '../../../common/CommonUtil';

export default class AnalyzerMomentumMovieAverage {
  public static async analyze() {
    const korStockRepository = createInitializedProxy(new KorStockPriceRepository(KorStockCode.KODEX_200));
    const korStockList = await korStockRepository.findAll();
    const movingAverages = MathUtil.calculateMovingAverages(korStockList.items, [20, 40, 60, 80, 100]);

    const priceList = korStockList.items.map((i) => i.close);

    const factor = BacktestService.factor(priceList, 0.03);
    console.log(
      `종목: ${korStockList.name}, 기간: ${moment(korStockList.items[0].date).format('YYYY-MM-DD')} ~ ${moment(
        korStockList.items[korStockList.items.length - 1].date,
      ).format('YYYY-MM-DD')}\n평가지표: ${objectToString(factor)}`,
    );
  }
}
