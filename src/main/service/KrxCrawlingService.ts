import { KrxStockInfo } from '../../common/type/KoreanCompanySummary';
import axios from 'axios';
import { getBusinessDay, parseNumber } from '../../common/CommonUtil';
import moment from 'moment';
import BokslConstant from '../config/BokslConstant';

/**
 * KRX 데이터 수집
 */
export default class KrxCrawlingService {
  /**
   * 한국 주가 지수
   */
  static async crawlKorStockList(): Promise<KrxStockInfo> {
    const url = 'https://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd';
    const baseDate = getBusinessDay(new Date());
    let trdDd = moment(baseDate).format('YYYYMMDD');
    const data = {
      bld: 'dbms/MDC/STAT/standard/MDCSTAT01501',
      locale: 'ko_KR',
      mktId: 'ALL',
      trdDd,
      share: '1',
      money: '1',
      csvxls_isNo: 'false',
    };

    try {
      const response = await axios.post(url, new URLSearchParams(data).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Referer: 'https://data.krx.co.kr',
          'User-Agent': BokslConstant.USER_AGENT,
        },
        timeout: 5000,
      });

      return this.transformKorStockList(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response) {
          console.error('Status code:', error.response.status);
          console.error('Response data:', error.response.data);
        }
      } else {
        console.error('Error:', error);
      }
      throw error;
    }
  }
  private static transformKorStockList(data: any): KrxStockInfo {
    return {
      stocks: data.OutBlock_1.map((item: any) => ({
        stockCode: item.ISU_SRT_CD,
        abbreviation: item.ISU_ABBRV,
        marketName: item.MKT_NM,
        sectorTypeName: item.SECT_TP_NM,
        closePrice: parseNumber(item.TDD_CLSPRC),
        openPrice: parseNumber(item.TDD_OPNPRC),
        highPrice: parseNumber(item.TDD_HGPRC),
        lowPrice: parseNumber(item.TDD_LWPRC),
        difference: parseNumber(item.CMPPREVDD_PRC),
        changeRate: parseNumber(item.FLUC_RT),
        tradeVolume: parseNumber(item.ACC_TRDVOL),
        tradeValue: parseNumber(item.ACC_TRDVAL),
        marketCap: parseNumber(item.MKTCAP),
        listedShares: parseNumber(item.LIST_SHRS),
      })),
      currentDatetime: moment(data.CURRENT_DATETIME, 'YYYY.MM.DD A hh:mm:ss').toDate(),
    };
  }
}
