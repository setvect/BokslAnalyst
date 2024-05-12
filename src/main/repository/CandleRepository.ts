import { DataSource, Repository } from 'typeorm';
import StockEntity from '../entity/StockEntity';
import CandleEntity from '../entity/CandleEntity';

export default class CandleRepository {
  constructor(private dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  get repository(): Repository<CandleEntity> {
    return this.dataSource.getRepository(CandleEntity);
  }
}
