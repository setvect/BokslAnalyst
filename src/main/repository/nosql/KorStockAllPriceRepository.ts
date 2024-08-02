import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import BokslConstant from '../../config/BokslConstant';
import { KrxStockPrice } from '../../../common/type/KoreanCompanySummary';
import { InitializedRepository } from './InitializedRepository';

export default class KorStockAllPriceRepository implements InitializedRepository {
  private db;

  initPromise: Promise<void>;

  constructor() {
    const dbPath = BokslConstant.DB_NAME.KOR_STOCK_ALL_PRICE;

    const directory = path.dirname(dbPath);
    if (!fs.existsSync(directory)) {
      log.info(`[KorStockAllPriceRepository] Directory created: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }

    const adapter = new JSONFile<KrxStockPrice>(dbPath);
    this.db = new Low(adapter, {} as KrxStockPrice);
    this.initPromise = this.initDb();
  }

  private async initDb() {
    await this.db.read();
    if (!this.db.data) {
      this.db.data = {
        stockList: [],
        currentDatetime: new Date(),
      };
    }
    await this.db.write();
  }

  async save(stockData: KrxStockPrice): Promise<void> {
    this.db.data = stockData;
    await this.db.write();
  }
}
