import log from 'electron-log';
import { initConnection } from '../main/config/AppDataSource';
import StockService from '../main/service/StockService';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});

describe('DB 관련 테스트', () => {
  beforeAll(async () => {
    await initConnection();
  });

  // eslint-disable-next-line jest/expect-expect
  it('단순 DB 연결 테스트', async () => {
    // await DbInitService.initDbData();

    const a = await StockService.findAll();
    log.info(a);
  });
});
