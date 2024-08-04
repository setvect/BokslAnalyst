import BaseRepository from './BaseRepository';
import { KrxData, KrxValue } from '../../../common/type/KoreanCompanySummary';
import BokslConstant from '../../config/BokslConstant';

export default class KorStockValueRepository extends BaseRepository<KrxData<KrxValue>> {
  constructor() {
    super(BokslConstant.DB_NAME.KOR_STOCK_VALUE);
  }

  // eslint-disable-next-line class-methods-use-this
  initializeData(): KrxData<KrxValue> {
    return {
      list: [],
      currentDatetime: new Date(),
    };
  }
}
