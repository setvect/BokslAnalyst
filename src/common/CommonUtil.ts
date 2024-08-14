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
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 기준 날짜를 입력 받아 가장 가까운 영업일(주말 제외)을 반환
 * @param {Date} [baseDate] - 기준 날짜 (선택 사항)
 * @returns {Date} - 가장 가까운 영업일
 */
export function getBusinessDay(baseDate: Date = new Date()): Date {
  const date = new Date(baseDate);

  // 오전 10시 전이면 전일로 변경
  if (date.getHours() < 10) {
    date.setDate(date.getDate() - 1);
  }

  const day = date.getDay();
  if (day === 6) {
    date.setDate(date.getDate() - 1);
  } else if (day === 0) {
    date.setDate(date.getDate() - 2);
  }

  return date;
}

export function parseNumber(value: string): number {
  return parseFloat(value.replace(/,/g, ''));
}

export function objectToString(obj: any): string {
  if (obj === null || obj === undefined) {
    return String(obj);
  }

  if (typeof obj !== 'object') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map((item) => objectToString(item)).join(', ')}]`;
  }

  const entries = Object.entries(obj)
    .map(([key, value]) => `${key}: ${objectToString(value)}`)
    .join(', ');

  return `{ ${entries} }`;
}
