import log from 'electron-log';
import KorStockRepository from '../main/repository/nosql/KorStockRepository';
import createInitializedProxy from '../main/repository/nosql/RepositoryProxy';
import KrxCrawlingService from '../main/service/KrxCrawlingService';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});

describe('DB 관련 테스트', () => {
  // eslint-disable-next-line jest/expect-expect
  it('한국 주식 종목 수집', async () => {
    const koreanStockList = await KrxCrawlingService.crawlKorStockList();
    console.log(koreanStockList);

    const korStockRepo = createInitializedProxy(new KorStockRepository());
    await korStockRepo.save(koreanStockList);

    log.info('끝.');
  });
});
