import log from 'electron-log';
import KorStockAllPriceRepository from '../main/repository/nosql/KorStockAllPriceRepository';
import createInitializedProxy from '../main/repository/nosql/RepositoryProxy';
import KrxCrawlingService from '../main/service/KrxCrawlingService';
import KorStockValueRepository from '../main/repository/nosql/KorStockValueRepository';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});
describe('크롤링', () => {
  // eslint-disable-next-line jest/expect-expect
  it('KRX-전종목 시세', async () => {
    const korStockList = await KrxCrawlingService.crawlStockAllPrice();

    const korStockRepository = createInitializedProxy(new KorStockAllPriceRepository());
    await korStockRepository.save(korStockList);

    log.info('끝.');
  });

  // eslint-disable-next-line jest/expect-expect
  it('한국 주식 밸류 지표 수집', async () => {
    const korValueList = await KrxCrawlingService.crawlValueList();

    const korValueRepository = createInitializedProxy(new KorStockValueRepository());
    await korValueRepository.save(korValueList);

    log.info('끝.');
  });
});
