import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import BokslConstant from '../../config/BokslConstant';
import { KrxValueInfo } from '../../../common/type/KoreanCompanySummary';
import { InitializedRepository } from './InitializedRepository';

export default class KorValueRepository implements InitializedRepository {
  private db;

  initPromise: Promise<void>;

  constructor() {
    const dbPath = BokslConstant.DB_NAME.KOR_VALUE;

    const directory = path.dirname(dbPath);
    if (!fs.existsSync(directory)) {
      log.info(`[KorValueRepository] Directory created: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }

    const adapter = new JSONFile<KrxValueInfo>(dbPath);
    this.db = new Low(adapter, {} as KrxValueInfo);
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

  async save(valueData: KrxValueInfo): Promise<void> {
    this.db.data = valueData;
    await this.db.write();
  }
}
