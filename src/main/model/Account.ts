export class Account {
  private constructor(balance: number) {
    this.balance = balance;
    this.heldStockMap = {};
  }

  // 보유종목. key: 종목코드, value: 수량
  private heldStockMap: { [key: string]: number };

  // 잔고
  private balance: number = 0;

  public getBalance(): number {
    return this.balance;
  }

  public addBalance(balance: number): void {
    this.balance += balance;
  }

  // 현재 보유 종목
  public getHeldStockMap(): { [key: string]: number } {
    return Object.freeze(this.heldStockMap);
  }

  public buyStock(stock: string, quantity: number): void {
    this.heldStockMap[stock] = (this.heldStockMap[stock] || 0) + quantity;
  }

  public sellStock(stock: string, quantity: number): void {
    let currentQuantity = this.heldStockMap[stock] || 0;
    if (currentQuantity < quantity) {
      throw new Error(`보유 수량이 적음. key: ${stock}, value: ${currentQuantity}`);
    }

    this.heldStockMap[stock] = currentQuantity - quantity;
  }

  /**
   *
   * @param currentStockPrice 현재 종목 가격
   */
  public getValuation(currentStockPrice: { [key: string]: number }): number {
    const keys = Object.keys(this.heldStockMap);
    let stockValuation: number = 0;

    keys.forEach((key) => {
      let heldStockMapElement = this.heldStockMap[key];
      if (heldStockMapElement) {
        throw new Error(`보유 종목에대한 가격 정보가 없음. key: ${key}, value: ${heldStockMapElement}`);
      }
      stockValuation += heldStockMapElement * currentStockPrice[key];
    });

    return this.balance + stockValuation;
  }
}
