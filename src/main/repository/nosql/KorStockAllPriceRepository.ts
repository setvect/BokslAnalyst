import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import BokslConstant from '../../config/BokslConstant';
import { KrxData, KrxStock } from '../../../common/type/KoreanCompanySummary';
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

    const adapter = new JSONFile<KrxData<KrxStock>>(dbPath);
    this.db = new Low(adapter, {} as KrxData<KrxStock>);
    this.initPromise = this.initDb();
  }

  private async initDb() {
    await this.db.read();
    if (!this.db.data) {
      this.db.data = {
        list: [],
        currentDatetime: new Date(),
      };
    }
    await this.db.write();
  }

  async save(stockData: KrxData<KrxStock>): Promise<void> {
    this.db.data = stockData;
    await this.db.write();
  }
}
