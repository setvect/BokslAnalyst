import log from 'electron-log';
import CrawlingService from '../main/service/CrawlingService';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});

describe('DB 관련 테스트', () => {
  // eslint-disable-next-line jest/expect-expect
  it('단순 DB 연결 테스트', async () => {
    log.info('ㅋㅋㅋ');
    await CrawlingService.crawlKorStockListAll();
  });
});
