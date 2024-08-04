import BaseRepository from './BaseRepository';
import { KrxData, KrxSector } from '../../../common/type/KoreanCompanySummary';
import BokslConstant from '../../config/BokslConstant';

export default class KorStockSectorRepository extends BaseRepository<KrxData<KrxSector>> {
  constructor() {
    super(BokslConstant.DB_NAME.KOR_STOCK_SECTOR);
  }

  // eslint-disable-next-line class-methods-use-this
  initializeData(): KrxData<KrxSector> {
    return {
      list: [],
      currentDatetime: new Date(),
    };
  }
}
