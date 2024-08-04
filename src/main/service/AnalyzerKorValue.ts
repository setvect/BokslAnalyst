// 한국 주식 밸류 분석
import _ from 'lodash';
import createInitializedProxy from '../repository/nosql/RepositoryProxy';
import KorStockAllPriceRepository from '../repository/nosql/KorStockAllPriceRepository';
import KorStockSectorRepository from '../repository/nosql/KorStockSectorRepository';

export default class AnalyzerKorValue {
  private static readonly EXCLUDE_SECTOR = ['기타금융', '생명보험', '손해보험', '은행', '증권', '창업투자'];

  public static async analyze() {
    const korStockRepository = createInitializedProxy(new KorStockAllPriceRepository());
    const korSectorRepository = createInitializedProxy(new KorStockSectorRepository());

    const korStockList = await korStockRepository.findAll();
    const korSectorList = await korSectorRepository.findAll();

    // 종목코드 key로 맵 만들기
    const sectorMap = _.keyBy(korSectorList.list, 'stockCode');

    // 시가총액 순으로 내림차순
    const sortedList = korStockList.list
      // 우선주 제외(코드가 0으로 안끝나면 우선주라는 뜻)
      .filter((stock) => stock.stockCode.endsWith('0'))
      // 금융 관련 종복 제외
      .filter((stock) => {
        const sectorMapElement = sectorMap[stock.stockCode];
        if (!sectorMapElement) {
          return false;
        }
        const isExcludeSector = AnalyzerKorValue.EXCLUDE_SECTOR.some((sector) => sectorMapElement.sector.includes(sector));
        return !isExcludeSector;
      })
      .sort((a, b) => b.marketCap - a.marketCap);

    sortedList.slice(0, 30).forEach((stock, index) => {
      console.log(`${index + 1}, [${stock.stockCode}] ${stock.companyName} ${stock.marketCap}`);
    });
  }
}
