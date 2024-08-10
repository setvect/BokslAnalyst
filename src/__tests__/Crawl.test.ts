import log from 'electron-log';
import KorStockAllPriceRepository from '../main/repository/nosql/KorStockAllPriceRepository';
import createInitializedProxy from '../main/repository/nosql/RepositoryProxy';
import KrxCrawlingService from '../main/service/crawl/KrxCrawlingService';
import KorStockValueRepository from '../main/repository/nosql/KorStockValueRepository';
import KorStockSectorRepository from '../main/repository/nosql/KorStockSectorRepository';
import NaverCrawlingStockPrice from '../main/service/crawl/NaverCrawlingStockPrice';
import KorStockPriceRepository from '../main/repository/nosql/KorStockPriceRepository';

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
    const korValueList = await KrxCrawlingService.crawlValue();

    const korValueRepository = createInitializedProxy(new KorStockValueRepository());
    await korValueRepository.save(korValueList);

    log.info('끝.');
  });

  // eslint-disable-next-line jest/expect-expect
  it('한국 주식 종목정보 수집', async () => {
    const korSectorList = await KrxCrawlingService.crawlSector();

    const korStockSectorRepository = createInitializedProxy(new KorStockSectorRepository());
    await korStockSectorRepository.save(korSectorList);

    log.info('끝.');
  });

  // eslint-disable-next-line jest/expect-expect
  it('한국 주식 시세 수집', async () => {
    const stockCode = '005930';
    const crawlData = await NaverCrawlingStockPrice.crawlPrice(stockCode);
    const korStockSectorRepository = createInitializedProxy(new KorStockPriceRepository(stockCode));
    await korStockSectorRepository.save(crawlData);
    log.info('끝.');
  });
});
