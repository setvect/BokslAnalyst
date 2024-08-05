// 한국 주식 밸류 분석
import _ from 'lodash';
import createInitializedProxy from '../repository/nosql/RepositoryProxy';
import KorStockAllPriceRepository from '../repository/nosql/KorStockAllPriceRepository';
import KorStockSectorRepository from '../repository/nosql/KorStockSectorRepository';
import { KrxData, KrxSector, KrxStock } from '../../common/type/KoreanCompanySummary';
import KorStockValueRepository from '../repository/nosql/KorStockValueRepository';

export default class AnalyzerKorValue {
  private static readonly EXCLUDE_SECTOR = ['기타금융', '생명보험', '손해보험', '은행', '증권', '창업투자'];

  public static async analyze() {
    const korStockRepository = createInitializedProxy(new KorStockAllPriceRepository());
    const korSectorRepository = createInitializedProxy(new KorStockSectorRepository());
    const korValueRepository = createInitializedProxy(new KorStockValueRepository());

    const korStockList = await korStockRepository.findAll();
    const korSectorList = await korSectorRepository.findAll();
    const korValueList = await korValueRepository.findAll();

    const sectorMap = _.keyBy(korSectorList.list, 'stockCode');
    const valueMap = _.keyBy(korValueList.list, 'stockCode');

    const rangeList = this.filterRange(korStockList, sectorMap);

    const filteredValueList = rangeList
      .filter((stock) => {
        const valueMapElement = valueMap[stock.stockCode];
        return !!valueMapElement;
      })
      .map((stock) => {
        const valueMapElement = valueMap[stock.stockCode];
        const sectorMapElement = sectorMap[stock.stockCode];

        return {
          stockCode: stock.stockCode,
          companyName: stock.companyName,
          sector: sectorMapElement.sector,
          price: stock.closingPrice,
          eps: valueMapElement.eps,
          per: valueMapElement.per || 99999,
          bps: valueMapElement.bps,
          pbr: valueMapElement.pbr || 99999,
          dividendYield: valueMapElement.dividendYield,
        } as KorValue;
      });

    // per 낮은 순으로 순위 구해 rankPer에 저장
    filteredValueList.sort((a, b) => a.per - b.per);
    filteredValueList.forEach((stock, index) => {
      stock.rankPer = index + 1;
    });
    // pbr 낮은 순으로 순위 구해 rankPbr에 저장
    filteredValueList.sort((a, b) => a.pbr - b.pbr);
    filteredValueList.forEach((stock, index) => {
      stock.rankPbr = index + 1;
    });
    // dividendYield 높은 순으로 순위 구해 rankDividend에 저장
    filteredValueList.sort((a, b) => b.dividendYield - a.dividendYield);
    filteredValueList.forEach((stock, index) => {
      stock.rankDividend = index + 1;
    });

    filteredValueList.forEach((stock) => {
      stock.getRankTotal = () => stock.rankPer + stock.rankPbr + stock.rankDividend;
    });

    // filteredValueList.sort((a, b) => a.rankPer + a.rankPbr + a.rankDividend - (b.rankPer + b.rankPbr + b.rankDividend));
    filteredValueList.sort((a, b) => a.getRankTotal() - b.getRankTotal());

    filteredValueList.forEach((stock, index) => {
      console.log(
        `${index}, ${stock.stockCode}, ${stock.companyName}, ${stock.sector}, ${stock.price}, PER: ${stock.per}, PBR: ${stock.pbr}, 배당율: ${
          stock.dividendYield
        }, 
        PER 순위: ${stock.rankPer}, PBR 순위: ${stock.rankPbr}, 배당 순위: ${stock.rankDividend}, 전체 순위: ${stock.getRankTotal()}`,
      );
    });
  }

  /**
   * 대상 종목 필터링
   * - 우전주 제외
   * - 금융관련 종목 제외
   * - 시총 70% ~ 90% 구간
   */
  private static filterRange(korStockList: KrxData<KrxStock>, sectorMap: Record<string, KrxSector>) {
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

    // 70% ~ 90% 구간 구하기
    return sortedList.slice(Math.floor(sortedList.length * 0.7), Math.floor(sortedList.length * 0.9));
  }
}

type KorValue = {
  stockCode: string;
  companyName: string;
  marketCap: number;
  exchange: string; // 마켓 KOSPI, KOSDAQ
  sector: string;
  price: number;

  eps: number;
  per: number;
  bps: number;
  pbr: number;
  dividendYield: number; // 배당률

  rankPer: number;
  rankPbr: number;
  rankDividend: number;
  getRankTotal: () => number;
};
