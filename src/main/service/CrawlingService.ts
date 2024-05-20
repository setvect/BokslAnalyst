import axios from 'axios';
import * as iconv from 'iconv-lite';
import * as cheerio from 'cheerio';
import log from 'electron-log';
import { KoreanCompanySummary } from '../../common/type/KoreanCompanySummary';
import { getRandomSleepTime, sleep } from '../../common/CommonUtil';
import StockEntity from '../entity/StockEntity';
import StockService from './StockService';
import { NationCode } from '../../common/CommonType';

export default class CrawlingService {
  private static readonly KOSPI: number = 0;

  private static readonly KOSDAQ: number = 1;

  private static readonly STOCK_LIST_URL = `https://finance.naver.com/sise/sise_market_sum.nhn?sosok={market}&page={page}`;

  public static async crawlKorStockListAll() {
    let companyList: KoreanCompanySummary[] = [];
    companyList = companyList.concat(await CrawlingService.crawlKorStockList(CrawlingService.KOSPI));
    // companyList = companyList.concat(await CrawlingService.crawlKorStockList(CrawlingService.KOSDAQ));
    return companyList;
  }

  private static async crawlKorStockList(marketType: number): Promise<KoreanCompanySummary[]> {
    const companyList: KoreanCompanySummary[] = [];
    const regexCompanyLink = /code=(\d+).*>([^<]+)<\/a>/;

    const requests = Array.from({ length: 2 }, (_, i) => i + 1).map(async (page) => {
      const callUrl = CrawlingService.STOCK_LIST_URL.replace('{market}', marketType.toString()).replace('{page}', page.toString());
      log.info(`페이지: ${callUrl}`);
      const response = await axios.get(callUrl, {
        responseType: 'arraybuffer',
      });

      const decodedData = iconv.decode(Buffer.from(response.data), 'EUC-KR');
      const $ = cheerio.load(decodedData);

      const elements = $('table.type_2 tbody tr[onmouseover]');
      if (elements.length === 0) {
        return;
      }

      elements.each((index, element) => {
        const row = $(element);
        const link = row.find('td:eq(1)').html();
        const matchResult = regexCompanyLink.exec(link!);
        if (matchResult) {
          const code = matchResult[1];
          const name = matchResult[2];
          const capitalization = CrawlingService.elementToInt(row.find('td:eq(6)').text());
          const currentPrice = CrawlingService.elementToInt(row.find('td:eq(2)').text());

          companyList.push({
            code,
            name,
            market: marketType === CrawlingService.KOSPI ? 'KOSPI' : 'KOSDAQ',
            capitalization,
            currentPrice,
          });
        }
      });
      const sleepTime = getRandomSleepTime(1500, 2000);
      log.info(`Sleeping for ${sleepTime}ms`);
      await sleep(sleepTime);
    });

    await Promise.all(requests);
    return companyList;
  }

  static async saveKorStockDb(stockList: KoreanCompanySummary[]) {
    const stockEntityList: StockEntity[] = stockList.map((stock) => {
      const stockEntity = new StockEntity();
      stockEntity.nation = NationCode.KR;
      stockEntity.code = stock.code;
      stockEntity.name = stock.name;
      return stockEntity;
    });

    await StockService.saveAll(stockEntityList);
    log.info(`${stockEntityList.length}개 저장 완료`);
  }

  private static elementToInt(element: string): number {
    return parseInt(element.replace(/,/g, ''), 10) || 0;
  }
}
