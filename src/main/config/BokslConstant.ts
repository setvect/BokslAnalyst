export default class BokslConstant {
  private static readonly LOWDB_PATH = './db/json';

  public static readonly DB_NAME = {
    // 한국 전 종목 가격
    KOR_STOCK_ALL_PRICE: `${this.LOWDB_PATH}/KOR_STOCK_ALL_PRICE.json`,
    // 한국 PER/PBR/배당수익률
    KOR_STOCK_VALUE: `${this.LOWDB_PATH}/KOR_STOCK_VALUE.json`,
    // 한국 업종
    KOR_STOCK_SECTOR: `${this.LOWDB_PATH}/KOR_STOCK_SECTOR.json`,
    // 한국 종목 가격
    KOR_STOCK_PRICE: `${this.LOWDB_PATH}/price/KOR_STOCK_SECTOR_{stockCode}.json`,
  };

  public static readonly USER_AGENT =
    "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'";
}
