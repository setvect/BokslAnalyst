import axios from 'axios';
import * as cheerio from 'cheerio';
import { KoreanCompanySummary } from '../../common/type/KoreanCompanySummary';

export default class CrawlingService {
  private static readonly KOSPI: number = 0;

  private static readonly KOSDAQ: number = 1;

  private static readonly STOCK_LIST_URL = `https://finance.naver.com/sise/sise_market_sum.nhn?sosok={market}&page={page}`;

  /**
   * 한국 주식목록
   */
  public static async crawlKorStockListAll() {
    await CrawlingService.crawlKorStockList(CrawlingService.KOSPI);
  }

  private static async crawlKorStockList(marketType: number): Promise<KoreanCompanySummary[]> {
    const companyList: KoreanCompanySummary[] = [];
    let page = 1;
    const regexCompanyLink = /<a[^>]*>([^<]+)<\/a>/;

    while (true) {
      const callUrl = CrawlingService.STOCK_LIST_URL.replace('{market}', marketType.toString()).replace('{page}', page.toString());
      console.log(`페이지: ${callUrl}`);
      const { data } = await axios.get(callUrl);
      const $ = cheerio.load(data);

      const elements = $('table.type_2 tbody tr[onmouseover]');
      if (elements.length === 0) {
        break;
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

      page++;
      if (page > 3) {
        // 예시로 페이지를 3까지 제한
        break;
      }
    }
    return companyList;
  }

  private static elementToInt(element: string): number {
    return parseInt(element.replace(/,/g, ''), 10) || 0;
  }
}
