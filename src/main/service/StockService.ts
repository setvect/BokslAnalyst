import AppDataSource from '../config/AppDataSource';
import StockRepository from '../repository/StockRepository';
import { ResStock } from '../../common/model/ResStock';

export default class StockService {
  private static stockRepository = new StockRepository(AppDataSource);

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    // empty
  }

  static async findAll(): Promise<ResStock[]> {
    const stockList = await this.stockRepository.repository.find({});
    console.log(stockList);
    return stockList;
  }
}
