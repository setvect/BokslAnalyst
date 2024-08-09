// 한국 주식 밸류 분석
import _ from 'lodash';
import createInitializedProxy from '../repository/nosql/RepositoryProxy';
import KorStockAllPriceRepository from '../repository/nosql/KorStockAllPriceRepository';
import KorStockSectorRepository from '../repository/nosql/KorStockSectorRepository';
import KorStockValueRepository from '../repository/nosql/KorStockValueRepository';

export default class AnalyzerKorValue {
  private static readonly FINANCIAL_SECTORS = ['손해보험', '생명보험', '다각화된 금융', '은행', '카드', '증권'];

  public static async analyze() {
    const mergeStock = await this.merge();
    const rangeList = this.filterRange(mergeStock);
    this.ranking(rangeList);

    rangeList.forEach((stock, index) => {
      console.log(
        `${index}, ${stock.stockCode}, ${stock.companyName}, ${stock.sector}, ${stock.price}, PER: ${stock.per}, PBR: ${stock.pbr}, 배당율: ${
          stock.dividendYield
        }, 
        PER 순위: ${stock.rankPer}, PBR 순위: ${stock.rankPbr}, 배당 순위: ${stock.rankDividend}, 전체 순위: ${stock.getRankTotal()}`,
      );
    });
  }

  private static async merge() {
    const korStockRepository = createInitializedProxy(new KorStockAllPriceRepository());
    const korSectorRepository = createInitializedProxy(new KorStockSectorRepository());
    const korValueRepository = createInitializedProxy(new KorStockValueRepository());

    const korStockList = await korStockRepository.findAll();
    const korSectorList = await korSectorRepository.findAll();
    const korValueList = await korValueRepository.findAll();

    const sectorMap = _.keyBy(korSectorList.list, 'stockCode');
    const valueMap = _.keyBy(korValueList.list, 'stockCode');

    return korStockList.list
      .filter((stock) => !!sectorMap[stock.stockCode])
      .filter((stock) => !!valueMap[stock.stockCode])
      .map((stock) => {
        const sectorMapElement = sectorMap[stock.stockCode];
        const valueMapElement = valueMap[stock.stockCode];

        return {
          stockCode: stock.stockCode,
          companyName: stock.companyName,
          marketCap: stock.marketCap,
          sector: sectorMapElement.sector,
          price: stock.closingPrice,
          eps: valueMapElement.eps,
          per: valueMapElement.per || 99999,
          bps: valueMapElement.bps,
          pbr: valueMapElement.pbr || 99999,
          dividendYield: valueMapElement.dividendYield,
        } as KorValue;
      });
  }

  /**
   * 대상 종목 필터링
   * - 우전주 제외
   * - 금융관련 종목 제외
   * - 시총 70% ~ 90% 구간
   */
  private static filterRange(rangeList: KorValue[]) {
    const isPreferredStock = (stock: KorValue) => stock.stockCode.endsWith('0');
    const isFinancialSector = (stock: KorValue) => AnalyzerKorValue.FINANCIAL_SECTORS.includes(stock.sector);
    const getMarketCap = (stock: KorValue) => stock.price * stock.sharesOutstanding;

    let filteredList = rangeList.filter(isPreferredStock);
    filteredList = filteredList.filter((stock) => !isFinancialSector(stock));

    const marketCapList = filteredList.map(getMarketCap);
    const lowerBound = marketCapList[Math.floor(marketCapList.length * 0.7)];
    const upperBound = marketCapList[Math.floor(marketCapList.length * 0.9)];

    filteredList = filteredList.filter((stock) => {
      const marketCap = getMarketCap(stock);
      return marketCap >= lowerBound && marketCap <= upperBound;
    });

    return filteredList;
  }

  private static ranking(rangeList: KorValue[]) {
    // per 낮은 순으로 순위 구해 rankPer에 저장
    AnalyzerKorValue.sortAndRank(rangeList, 'per', 'rankPer', true);

    // pbr 낮은 순으로 순위 구해 rankPbr에 저장
    AnalyzerKorValue.sortAndRank(rangeList, 'pbr', 'rankPbr', true);

    // dividendYield 높은 순으로 순위 구해 rankDividend에 저장
    AnalyzerKorValue.sortAndRank(rangeList, 'dividendYield', 'rankDividend', false);

    rangeList.forEach((stock) => {
      stock.getRankTotal = () => stock.rankPer + stock.rankPbr + stock.rankDividend;
    });
    // rangeList.sort((a, b) => a.rankPer + a.rankPbr + a.rankDividend - (b.rankPer + b.rankPbr + b.rankDividend));
    rangeList.sort((a, b) => a.getRankTotal() - b.getRankTotal());
  }

  private static sortAndRank(list: KorValue[], key: keyof KorValue, rankKey: keyof KorValue, ascending: boolean = true): void {
    list.sort((a, b) => {
      const aValue = a[key] as number;
      const bValue = b[key] as number;
      return ascending ? aValue - bValue : bValue - aValue;
    });
    list.forEach((item, index) => {
      item[rankKey] = index + 1;
    });
  }
}

type KorValue = {
  [key: string]: any; // 모든 키에 대해 임의의 타입을 허용
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
