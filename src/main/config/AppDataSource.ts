import { DataSource } from 'typeorm';
import log from 'electron-log';
import { app } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import StockEntity from '../entity/StockEntity';
import CandleEntity from '../entity/CandleEntity';
import DisclosureInfoEntity from '../entity/DisclosureInfoEntity';

export const DB_PATH = isDev ? 'db/BokslAnalyst.db' : path.join(app.getPath('userData'), 'BokslAnalystBook.db');

log.info('DB_PATH', DB_PATH);

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: DB_PATH,
  entities: [StockEntity, CandleEntity, DisclosureInfoEntity],
  synchronize: true,
  // SQLite 데이터베이스 파일에 로그를 남길지 여부
  logging: true,
  logger: 'advanced-console',
});

export async function initConnection() {
  if (AppDataSource.isInitialized) {
    return;
  }
  await AppDataSource.initialize()
    // eslint-disable-next-line promise/always-return
    .then(() => {
      log.info('DB 연결 성공');
    })
    .catch((error: Error) => {
      log.error(`DB 연결 실패${error}`);
    });
}

export async function closeConnection() {
  if (!AppDataSource.isInitialized) {
    return;
  }
  try {
    await AppDataSource.destroy();
    log.info('DB 연결 종료 성공');
  } catch (error) {
    log.error(`DB 연결 종료 실패: ${error}`);
  }
}

export default AppDataSource;
