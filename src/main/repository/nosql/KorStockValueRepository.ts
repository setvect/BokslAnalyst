// src/main/repository/nosql/KorStockValueRepository.ts
import BaseRepository from './BaseRepository';
import { KrxData, KrxValue } from '../../../common/type/KoreanCompanySummary';
import BokslConstant from '../../config/BokslConstant';

export default class KorStockValueRepository extends BaseRepository<KrxData<KrxValue>> {
  constructor() {
    super(BokslConstant.DB_NAME.KOR_STOCK_VALUE);
  }

  initializeData(): KrxData<KrxValue> {
    return {
      list: [],
      currentDatetime: new Date(),
    };
  }
}
