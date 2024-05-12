import AppDataSource from '../config/AppDataSource';
import { ResStock } from '../../common/model/ResStock';
import CandleRepository from '../repository/CandleRepository';

export default class StockService {
  private static candleRepository = new CandleRepository(AppDataSource);

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    // empty
  }
}
