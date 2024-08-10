import BaseRepository from './BaseRepository';
import BokslConstant from '../../config/BokslConstant';
import { ChartData } from '../../../common/type/NaverStockPrice';

export default class KorStockPriceRepository extends BaseRepository<ChartData> {
  constructor(stockCode: string) {
    super(BokslConstant.DB_NAME.KOR_STOCK_PRICE.replace('{stockCode}', stockCode));
  }

  // eslint-disable-next-line class-methods-use-this
  initializeData(): ChartData {
    return {
      symbol: '',
      name: '',
      count: 0,
      timeframe: '',
      precision: 0,
      origintime: '',
      items: [],
    };
  }
}
