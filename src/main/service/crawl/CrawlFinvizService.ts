import axios from 'axios';
import BokslConstant from '../../config/BokslConstant';
import * as cheerio from 'cheerio';
import log from 'electron-log';
import { getRandomSleepTime, sleep } from '../../../common/CommonUtil';

export default class CrawlFinvizService {
  private static readonly STOCK_LIST_URL =
    'https://finviz.com/screener.ashx?v=152&ft=4&' +
    'c=0,1,2,3,4,5,79,6,7,8,9,10,11,12,13,73,74,14,15,16,77,17,18,19,20,21,23,22,82,78,24,25,26,27,28,29,30,31,84,32,33,34,' +
    '35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,68,70,80,83,76,60,61,62,63,64,67,69,81,65,66,71,72&r={position}';

  public static async crawlValue() {
    const jsonData: KeyMap<string, string>[] = [];
    let columName: string[] = [];
    let pagePerCount = 0;

    for (let page = 0; page < 550; page++) {
      let position = page * pagePerCount + 1;
      let content = await this.call(position);
      const matrix: string[][] = this.getData(content);
      if (matrix.length === 0) {
        break;
      }

      if (page === 0) {
        columName = this.getColumnName(content);
        pagePerCount = matrix.length;
      }

      const pageData: KeyMap<string, string>[] = matrix.map((row) => {
        let jsonObject: KeyMap<string, string> = {};
        columName.forEach((col, index) => {
          jsonObject[col] = row[index];
        });
        return jsonObject;
      });

      jsonData.push(...pageData);

      log.info(`수집: ${position}`);
      // 페이지 당 수집된 건수가 한 페이지 표시 건수보다 작으면 수집 종료
      if (matrix.length < pagePerCount) {
        // 이럴 경우 상황에 따라 마지막 한건이 중복 수집될 가능성이 있음. 그냥 넘어가자.
        break;
      }

      const sleepTime = getRandomSleepTime(1000, 2000);
      log.info(`Sleeping for ${sleepTime}ms`);
      await sleep(sleepTime);
    }

    return jsonData;
  }

  private static async call(position: number) {
    let url = CrawlFinvizService.STOCK_LIST_URL.replace('{position}', position.toString());
    const response = await axios.get(url, {
      headers: {
        'User-Agent': BokslConstant.USER_AGENT,
      },
    });
    return response.data;
  }

  private static getColumnName(html: string): string[] {
    const $ = cheerio.load(html);
    return $('#screener-table > td > table > tbody > tr > td > table > thead > tr')
      .map((rowIdx, element) => {
        return $(element)
          .find('th')
          .map((colIdx, th) => $(th).text().trim())
          .get();
      })
      .get();
  }

  private static getData(html: string) {
    const $ = cheerio.load(html);
    const rows = $('#screener-table > td > table > tbody > tr > td > table > tbody > tr').toArray();

    return rows.map((row) => {
      return $(row)
        .find('td')
        .map((_, cell) => $(cell).text())
        .toArray();
    });
  }
}
