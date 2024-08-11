import BaseRepository from './BaseRepository';
import BokslConstant from '../../config/BokslConstant';

export default class UsaStockValueRepository extends BaseRepository<KeyMap<string, string>[]> {
  constructor() {
    super(BokslConstant.DB_NAME.USA_STOCK_VALUE);
  }

  // eslint-disable-next-line class-methods-use-this
  initializeData(): KeyMap<string, string>[] {
    return [];
  }
}
