import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import { KrxData, KrxSector, KrxStock, KrxValue, MarketType } from '../../common/type/KoreanCompanySummary';
import { getBusinessDay, parseNumber } from '../../common/CommonUtil';
import BokslConstant from '../config/BokslConstant';

/**
 * KRX 데이터 수집
 */
export default class KrxCrawlingService {
  /**
   * 한국 주가 지수
   */
  static async crawlStockAllPrice(): Promise<KrxData<KrxStock>> {
    const url = 'https://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd';
    const baseDate = getBusinessDay(new Date());
    const trdDd = moment(baseDate).format('YYYYMMDD');
    const data = {
      bld: 'dbms/MDC/STAT/standard/MDCSTAT01501',
      locale: 'ko_KR',
      mktId: 'ALL',
      trdDd,
      share: '1',
      money: '1',
      csvxls_isNo: 'false',
    };

    const response = await axios.post(url, new URLSearchParams(data).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'https://data.krx.co.kr',
        'User-Agent': BokslConstant.USER_AGENT,
      },
      timeout: 5000,
    });

    return this.transformKorStockPriceList(response.data);
  }

  /**
   * 한국 Value 지표
   */
  static async crawlValue(): Promise<KrxData<KrxValue>> {
    const url = 'https://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd';
    const baseDate = getBusinessDay(new Date());
    const trdDd = moment(baseDate).format('YYYYMMDD');

    const data = {
      bld: 'dbms/MDC/STAT/standard/MDCSTAT03501',
      searchType: '1',
      mktId: 'ALL',
      trdDd,
      param1isuCd_finder_stkisu0_1: 'ALL',
      csvxls_isNo: 'false',
    };

    const response = await axios.post(url, new URLSearchParams(data).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: 'https://data.krx.co.kr',
        'User-Agent': BokslConstant.USER_AGENT,
      },
      timeout: 5000,
    });

    return this.transformKorValueList(response.data);
  }

  /**
   * 한국 종목에 대한 업종 정보
   */
  static async crawlSector(): Promise<KrxData<KrxSector>> {
    const url = 'https://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd';
    const baseDate = getBusinessDay(new Date());
    const trdDd = moment(baseDate).format('YYYYMMDD');

    const fetchSectorData = async (marketType: string): Promise<KrxSector[]> => {
      const data = {
        bld: 'dbms/MDC/STAT/standard/MDCSTAT03901',
        mktId: marketType,
        trdDd,
      };

      const response = await axios.post(url, new URLSearchParams(data).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Referer: 'https://data.krx.co.kr',
          'User-Agent': BokslConstant.USER_AGENT,
        },
        timeout: 5000,
      });

      return this.transformKorStockSectorList(response.data).list;
    };

    const marketTypes = _.keys(MarketType);
    const sectorDataPromises = _.map(marketTypes, fetchSectorData);
    const sectorDataLists = await Promise.all(sectorDataPromises);
    const combinedList = _.flatten(sectorDataLists);

    return {
      list: combinedList,
      currentDatetime: new Date(),
    };
  }

  private static transformKorStockPriceList(data: any): KrxData<KrxStock> {
    return {
      list: data.OutBlock_1.map((item: any) => ({
        stockCode: item.ISU_SRT_CD,
        companyName: item.ISU_ABBRV,
        exchange: item.MKT_NM,
        listingSection: item.SECT_TP_NM,
        closingPrice: parseNumber(item.TDD_CLSPRC),
        openingPrice: parseNumber(item.TDD_OPNPRC),
        highPrice: parseNumber(item.TDD_HGPRC),
        lowPrice: parseNumber(item.TDD_LWPRC),
        change: parseNumber(item.CMPPREVDD_PRC),
        changeRate: parseNumber(item.FLUC_RT),
        volume: parseNumber(item.ACC_TRDVOL),
        tradingValue: parseNumber(item.ACC_TRDVAL),
        marketCap: parseNumber(item.MKTCAP),
        sharesOutstanding: parseNumber(item.LIST_SHRS),
      })),
      currentDatetime: moment(data.CURRENT_DATETIME, 'YYYY.MM.DD A hh:mm:ss').toDate(),
    };
  }

  private static transformKorValueList(data: any): KrxData<KrxValue> {
    return {
      list: data.output.map((item: any) => ({
        stockCode: item.ISU_SRT_CD,
        companyName: item.ISU_ABBRV,
        closingPrice: parseNumber(item.TDD_CLSPRC),
        change: parseNumber(item.CMPPREVDD_PRC),
        changeRate: parseNumber(item.FLUC_RT),
        eps: parseNumber(item.EPS),
        per: parseNumber(item.PER),
        bps: parseNumber(item.BPS),
        pbr: parseNumber(item.PBR),
        dividend: parseNumber(item.DPS),
        dividendYield: parseNumber(item.DVD_YLD),
      })),
      currentDatetime: moment(data.CURRENT_DATETIME, 'YYYY.MM.DD A hh:mm:ss').toDate(),
    };
  }

  private static transformKorStockSectorList(data: any): KrxData<KrxSector> {
    return {
      list: data.block1.map((item: any) => ({
        stockCode: item.ISU_SRT_CD,
        companyName: item.ISU_ABBRV,
        exchange: item.MKT_TP_NM,
        sector: item.IDX_IND_NM,
        closingPrice: parseNumber(item.TDD_CLSPRC),
        change: parseNumber(item.CMPPREVDD_PRC),
        changeRate: parseNumber(item.FLUC_RT),
        marketCap: parseNumber(item.MKTCAP),
      })),
      currentDatetime: moment(data.CURRENT_DATETIME, 'YYYY.MM.DD A hh:mm:ss').toDate(),
    };
  }
}
