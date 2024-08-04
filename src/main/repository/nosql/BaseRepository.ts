import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';

export interface InitializedRepository {
  initDb(): Promise<void>;

  save(data: any): Promise<void>;

  initPromise: Promise<void>;
}

export default abstract class BaseRepository<T> implements InitializedRepository {
  protected db: Low<T>;

  initPromise: Promise<void>;

  constructor(dbPath: string) {
    const directory = path.dirname(dbPath);
    if (!fs.existsSync(directory)) {
      log.info(`[BaseRepository] Directory created: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }

    const adapter = new JSONFile<T>(dbPath);
    this.db = new Low(adapter, {} as T);
    this.initPromise = this.initDb();
  }

  async initDb(): Promise<void> {
    await this.db.read();
    if (!this.db.data) {
      this.db.data = this.initializeData();
    }
    await this.db.write();
  }

  abstract initializeData(): T;

  async save(data: T): Promise<void> {
    this.db.data = data;
    await this.db.write();
  }

  async findAll(): Promise<T> {
    await this.initPromise;
    return this.db.data;
  }
}
