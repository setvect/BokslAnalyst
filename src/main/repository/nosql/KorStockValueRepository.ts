import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import BokslConstant from '../../config/BokslConstant';
import { KrxData, KrxValue } from '../../../common/type/KoreanCompanySummary';
import { InitializedRepository } from './InitializedRepository';

export default class KorStockValueRepository implements InitializedRepository {
  private db;

  initPromise: Promise<void>;

  constructor() {
    const dbPath = BokslConstant.DB_NAME.KOR_STOCK_VALUE;

    const directory = path.dirname(dbPath);
    if (!fs.existsSync(directory)) {
      log.info(`[KorStockValueRepository] Directory created: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }

    const adapter = new JSONFile<KrxData<KrxValue>>(dbPath);
    this.db = new Low(adapter, {} as KrxData<KrxValue>);
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

  async save(valueData: KrxData<KrxValue>): Promise<void> {
    this.db.data = valueData;
    await this.db.write();
  }
}
