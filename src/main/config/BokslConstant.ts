export default class BokslConstant {
  private static readonly LOWDB_PATH = './db/json';

  public static readonly DB_NAME = {
    KOR_STOCK: `${this.LOWDB_PATH}/KOR_STOCK.json`,
    KOR_VALUE: `${this.LOWDB_PATH}/KOR_VALUE.json`,
  };

  public static readonly USER_AGENT =
    "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'";
}
