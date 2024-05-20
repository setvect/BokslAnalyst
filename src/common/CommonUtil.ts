import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/prefer-default-export
export const generateUUID = () => {
  return uuidv4();
};

/**
 * 수익률 계산 (현재가 - 매입가) / 매입가
 */
export const calcYield = (totalAmount: number, evaluateAmount: number) => {
  if (totalAmount === 0) {
    return 0;
  }

  return (evaluateAmount - totalAmount) / totalAmount;
};

export function getTopPath(path: string): string {
  const match = path.match(/^\/[^/]*/);
  return match ? match[0] : path;
}

export function getRandomSleepTime(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
