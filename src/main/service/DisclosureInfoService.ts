import AppDataSource from '../config/AppDataSource';
import StockRepository from '../repository/StockRepository';
import { ResStock } from '../../common/model/ResStock';
import DisclosureInfoRepository from '../repository/DisclosureInfoRepository';

export default class DisclosureInfoService {
  private static disclosureInfoRepository = new DisclosureInfoRepository(AppDataSource);

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    // empty
  }
}
