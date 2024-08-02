import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import BokslConstant from '../../config/BokslConstant';
import { KrxStockValue } from '../../../common/type/KoreanCompanySummary';
import { InitializedRepository } from './InitializedRepository';

export default class KorStockValueRepository implements InitializedRepository {
  private db;

  initPromise: Promise<void>;

  constructor() {
    const dbPath = BokslConstant.DB_NAME.KOR_VALUE;

    const directory = path.dirname(dbPath);
    if (!fs.existsSync(directory)) {
      log.info(`[KorStockValueRepository] Directory created: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }

    const adapter = new JSONFile<KrxStockValue>(dbPath);
    this.db = new Low(adapter, {} as KrxStockValue);
    this.initPromise = this.initDb();
  }

  private async initDb() {
    await this.db.read();
    if (!this.db.data) {
      this.db.data = {
        valueList: [],
        currentDatetime: new Date(),
      };
    }
    await this.db.write();
  }

  async save(valueData: KrxStockValue): Promise<void> {
    this.db.data = valueData;
    await this.db.write();
  }
}
