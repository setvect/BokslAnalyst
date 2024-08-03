import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import BokslConstant from '../../config/BokslConstant';
import { InitializedRepository } from './InitializedRepository';
import { KrxData, KrxSector } from '../../../common/type/KoreanCompanySummary';

export default class KorStockSectorRepository implements InitializedRepository {
  private db;

  initPromise: Promise<void>;

  constructor() {
    const dbPath = BokslConstant.DB_NAME.KOR_STOCK_SECTOR;

    const directory = path.dirname(dbPath);
    if (!fs.existsSync(directory)) {
      log.info(`[KorStockSectorRepository] Directory created: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }

    const adapter = new JSONFile<KrxData<KrxSector>>(dbPath);
    this.db = new Low(adapter, {} as KrxData<KrxSector>);
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

  async save(valueData: KrxData<KrxSector>): Promise<void> {
    this.db.data = valueData;
    await this.db.write();
  }
}
