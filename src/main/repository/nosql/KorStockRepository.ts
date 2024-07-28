import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import BokslConstant from '../../config/BokslConstant';
import { KrxStockInfo } from '../../../common/type/KoreanCompanySummary';
import { InitializedRepository } from './InitializedRepository';

export default class KorStockRepository implements InitializedRepository {
  private db;

  initPromise: Promise<void>;

  constructor() {
    const dbPath = BokslConstant.DB_NAME.KOR_STOCK;

    const directory = path.dirname(dbPath);
    if (!fs.existsSync(directory)) {
      log.info(`[KorStockRepository] Directory created: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }

    const adapter = new JSONFile<KrxStockInfo>(dbPath);
    this.db = new Low(adapter, {} as KrxStockInfo);
    this.initPromise = this.initDb();
  }

  private async initDb() {
    await this.db.read();
    if (!this.db.data) {
      this.db.data = {
        stocks: [],
        currentDatetime: new Date(),
      };
    }
    await this.db.write();
  }

  async save(stockData: KrxStockInfo): Promise<void> {
    this.db.data = stockData;
    await this.db.write();
  }
}
