// 한국 주식 밸류 분석
import _ from 'lodash';
import ExcelJS from 'exceljs';
import fs from 'fs';
import log from 'electron-log';
import createInitializedProxy from '../../repository/nosql/RepositoryProxy';
import KorStockAllPriceRepository from '../../repository/nosql/KorStockAllPriceRepository';
import KorStockSectorRepository from '../../repository/nosql/KorStockSectorRepository';
import KorStockValueRepository from '../../repository/nosql/KorStockValueRepository';

export default class AnalyzerKorValue {
  private static readonly FINANCIAL_SECTORS = ['손해보험', '생명보험', '다각화된 금융', '은행', '카드', '증권'];

  public static async analyze() {
    const allStock = await this.merge();
    const filterStock = this.filterRange(allStock);
    this.ranking(filterStock);

    // 워크북 생성
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Analysis');

    worksheet.columns = [
      { header: '종목명', key: 'companyName', width: 30 },
      { header: '종목코드', key: 'stockCode', width: 15 },
      { header: '링크(네이버)', key: 'naver', width: 15 },
      { header: '링크(알파스퀘어)', key: 'alphasquare', width: 15 },
      { header: '마켓', key: 'exchange', width: 15 },
      { header: '시총', key: 'marketCap', width: 15 },
      { header: '현재가', key: 'price', width: 10 },
      { header: '업종', key: 'sector', width: 15 },
      { header: 'PER', key: 'per', width: 10 },
      { header: 'PBR', key: 'pbr', width: 10 },
      { header: '배당수익률', key: 'dividendYield', width: 15 },
      { header: '순위-PER', key: 'rankPer', width: 10 },
      { header: '순위-PBR', key: 'rankPbr', width: 10 },
      { header: '순위-배당수익률', key: 'rankDividend', width: 15 },
      { header: '순위합계', key: 'rankTotal', width: 10 },
    ];

    filterStock.forEach((item) => {
      const row = worksheet.addRow({
        companyName: item.companyName,
        stockCode: item.stockCode,
        naver: {
          text: `https://finance.naver.com/item/main.nhn?code=${item.stockCode}`,
          hyperlink: `https://finance.naver.com/item/main.nhn?code=${item.stockCode}`,
        },
        alphasquare: {
          text: `https://alphasquare.co.kr/home/stock-information?code=${item.stockCode}`,
          hyperlink: `https://alphasquare.co.kr/home/stock-information?code=${item.stockCode}`,
        },
        marketCap: item.marketCap,
        exchange: item.exchange,
        sector: item.sector,
        price: item.price,
        eps: item.eps,
        per: item.per,
        bps: item.bps,
        pbr: item.pbr,
        dividendYield: item.dividendYield,
        rankPer: item.rankPer,
        rankPbr: item.rankPbr,
        rankDividend: item.rankDividend,
        rankTotal: item.getRankTotal(),
      });

      row.getCell('naver').font = { color: { argb: 'FF0000FF' }, bold: true };
      row.getCell('alphasquare').font = { color: { argb: 'FF0000FF' }, bold: true };
    });

    // 첫 번째 행 고정
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // 첫 번째 행 스타일 적용
    const firstRow = worksheet.getRow(1);
    firstRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // 노란색
      };
      cell.font = { bold: true };
    });

    worksheet.getColumn('marketCap').numFmt = '#,##0';
    worksheet.getColumn('price').numFmt = '#,##0';

    // 모든 셀에 외곽선 적용
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    const directory = './report';
    fs.mkdirSync(directory, { recursive: true });

    // 엑셀 파일로 저장
    await workbook.xlsx.writeFile(`${directory}/가치평가 전략(한국 주식).xlsx`);
    log.info(`${directory}/가치평가 전략(한국 주식).xlsx`);
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
          exchange: stock.exchange,
          marketCap: stock.marketCap,
          sector: sectorMapElement.sector,
          price: stock.closingPrice,
          eps: valueMapElement.eps,
          per: valueMapElement.per,
          bps: valueMapElement.bps,
          pbr: valueMapElement.pbr,
          dividendYield: valueMapElement.dividendYield,
        } as KorValue;
      });
  }

  /**
   * 대상 종목 필터링
   * - 우전주 제외
   * - 금융관련 종목 제외
   * - per, pbr 양수
   * - 시총 70% ~ 90% 구간
   */
  private static filterRange(rangeList: KorValue[]) {
    const isPreferredStock = (stock: KorValue) => stock.stockCode.endsWith('0');
    const isFinancialSector = (stock: KorValue) => AnalyzerKorValue.FINANCIAL_SECTORS.includes(stock.sector);

    let filteredList = rangeList.filter(isPreferredStock);
    filteredList = filteredList.filter((stock) => !isFinancialSector(stock));
    filteredList = filteredList.filter((stock) => stock.per);
    filteredList = filteredList.filter((stock) => stock.pbr);

    const sortList = filteredList.sort((a, b) => b.marketCap - a.marketCap);

    const lowerBound = Math.floor(sortList.length * 0.7);
    const upperBound = Math.floor(sortList.length * 0.9);

    return sortList.slice(lowerBound, upperBound);
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
