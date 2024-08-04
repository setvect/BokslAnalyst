import BaseRepository from './BaseRepository';
import { KrxData, KrxStock } from '../../../common/type/KoreanCompanySummary';
import BokslConstant from '../../config/BokslConstant';

export default class KorStockAllPriceRepository extends BaseRepository<KrxData<KrxStock>> {
  constructor() {
    super(BokslConstant.DB_NAME.KOR_STOCK_ALL_PRICE);
  }

  // eslint-disable-next-line class-methods-use-this
  initializeData(): KrxData<KrxStock> {
    return {
      list: [],
      currentDatetime: new Date(),
    };
  }
}
