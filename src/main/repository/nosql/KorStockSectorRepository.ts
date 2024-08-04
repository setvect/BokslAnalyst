// src/main/repository/nosql/KorStockSectorRepository.ts
import BaseRepository from './BaseRepository';
import { KrxData, KrxSector } from '../../../common/type/KoreanCompanySummary';
import BokslConstant from '../../config/BokslConstant';

export default class KorStockSectorRepository extends BaseRepository<KrxData<KrxSector>> {
  constructor() {
    super(BokslConstant.DB_NAME.KOR_STOCK_SECTOR);
  }

  initializeData(): KrxData<KrxSector> {
    return {
      list: [],
      currentDatetime: new Date(),
    };
  }
}
