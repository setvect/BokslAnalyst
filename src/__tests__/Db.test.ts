import log from 'electron-log';
import { initConnection } from '../main/config/AppDataSource';
import StockService from '../main/service/StockService';
import CrawlService from '../main/service/crawl/CrawlService';

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

  // eslint-disable-next-line jest/expect-expect
  it('데이터 수집 테스트', async () => {
    const koreanStockList = await CrawlService.crawlKorStockListAll();
    await CrawlService.saveKorStockDb(koreanStockList);
  }, 20000);
});
