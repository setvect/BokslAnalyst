/**
 * Trade 클래스 대체
 * 순수하게 매매에 관한 정보만 담고 있음.
 * 예를 들어 매도 수익, 수수료는 없음. 이건 계산으로 얻을 수 있기 때문에 제외했음.
 */
export class Trade {
  constructor(
    // 종목코드
    private stockCode: string,
    /*
     * 거래 단가
     * - 매수일 경우 매수 단가
     * - 매도일 경우 매도 단가
     */
    private price: number,
    // 매매 수량
    private quantity: number,
    // 거래시간
    private tradeDate: Date,
    private tradeType: TradeType,
    // 백테스트 조건 이름. 일반적인 경우는 stockCode 이름을 사용하면 됨
    private backtestCondition: string = stockCode,
    // 거래 메모
    private memo?: string,
  ) {}

  getStockCode(): string {
    return this.stockCode;
  }

  getPrice(): number {
    return this.price;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getTradeDate(): Date {
    return this.tradeDate;
  }

  getTradeType(): TradeType {
    return this.tradeType;
  }

  getBacktestCondition(): string {
    return this.backtestCondition;
  }

  getMemo(): string | undefined {
    return this.memo;
  }
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}
