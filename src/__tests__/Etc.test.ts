import log from 'electron-log';
import CrawlingService from '../main/service/CrawlingService';
import { initConnection } from '../main/config/AppDataSource';
import UserService from '../main/repository/nosql/UserService';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});

describe('DB 관련 테스트', () => {
  beforeAll(async () => {
    await initConnection();
  });

  // eslint-disable-next-line jest/expect-expect
  it('단순 DB 연결 테스트', async () => {
    const koreanStockList = await CrawlingService.crawlKorStockListAll();
    await CrawlingService.saveKorStockDb(koreanStockList);
  }, 20000);

  // eslint-disable-next-line jest/expect-expect
  it('low db 연결 테스트', async () => {
    const a = new UserService();
    a.createUser('복슬이', 'b@b.com');
    log.info('끝.');
  });
});
