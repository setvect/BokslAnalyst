import { DataSource, Repository } from 'typeorm';
import StockEntity from '../entity/StockEntity';
import DisclosureInfoEntity from '../entity/DisclosureInfoEntity';

export default class DisclosureInfoRepository {
  constructor(private dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  get repository(): Repository<DisclosureInfoEntity> {
    return this.dataSource.getRepository(DisclosureInfoEntity);
  }
}
