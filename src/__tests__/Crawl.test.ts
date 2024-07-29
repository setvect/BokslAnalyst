import log from 'electron-log';
import KorStockRepository from '../main/repository/nosql/KorStockRepository';
import createInitializedProxy from '../main/repository/nosql/RepositoryProxy';
import KrxCrawlingService from '../main/service/KrxCrawlingService';
import KorValueRepository from '../main/repository/nosql/KorValueRepository';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});

describe('DB 관련 테스트', () => {
  // eslint-disable-next-line jest/expect-expect
  it('한국 주식 종목 수집', async () => {
    const korStockList = await KrxCrawlingService.crawlStockList();
    console.log(korStockList);

    const korStockRepository = createInitializedProxy(new KorStockRepository());
    await korStockRepository.save(korStockList);

    log.info('끝.');
  });

  it('한국 주식 밸류 지표 수집', async () => {
    const korValueList = await KrxCrawlingService.crawlValueList();

    const korValueRepository = createInitializedProxy(new KorValueRepository());
    await korValueRepository.save(korValueList);

    log.info('끝.');
  });
});
