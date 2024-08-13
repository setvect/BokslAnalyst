import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import iconv from 'iconv-lite';
import { ChartData } from '../../../common/type/NaverStockPrice';
import { StockOhlcPrice } from '../../../common/type/CommonType';

export default class CrawlNaverStockPrice {
  private static readonly URL = 'https://fchart.stock.naver.com/sise.nhn?timeframe=day&count=8000&requestType=0&symbol=';

  public static async crawlPrice(stockCode: string) {
    const url = CrawlNaverStockPrice.URL + stockCode;

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    });

    const decodedData = iconv.decode(Buffer.from(response.data), 'euc-kr');
    return CrawlNaverStockPrice.parseStockData(decodedData);
  }

  // XML 데이터를 파싱하는 함수
  private static async parseStockData(xml: string) {
    const result = await parseStringPromise(xml);
    const chartdata = result.protocol.chartdata[0];
    const items = chartdata.item.map((item: any) => {
      const data = item.$.data.split('|');
      return {
        date: data[0],
        open: parseInt(data[1], 10),
        high: parseInt(data[2], 10),
        low: parseInt(data[3], 10),
        close: parseInt(data[4], 10),
        volume: parseInt(data[5], 10),
      } as StockOhlcPrice;
    });

    return {
      symbol: chartdata.$.symbol,
      name: chartdata.$.name,
      count: parseInt(chartdata.$.count, 10),
      timeframe: chartdata.$.timeframe,
      precision: parseInt(chartdata.$.precision, 10),
      origintime: chartdata.$.origintime,
      items,
    } as ChartData;
  }
}
