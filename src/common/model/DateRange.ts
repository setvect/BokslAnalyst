import moment from 'moment';

export default class DateRange {
  private static readonly UNLIMITED_DATE_START = '1990-01-01 00:00:00';

  private static readonly UNLIMITED_DATE_END = '2100-12-31 23:59:59';

  /**
   * 최대 범위
   */
  static createMaxRange(): DateRange {
    return new DateRange(moment(DateRange.UNLIMITED_DATE_START).toDate(), moment(DateRange.UNLIMITED_DATE_END).toDate());
  }

  /**
   * 오늘 날짜를 기준으로 범위 생성
   */
  static createDiff(diff: number): DateRange {
    if (diff > 0) {
      return new DateRange(moment().subtract(diff, 'days').toDate(), moment().toDate());
    }
    return new DateRange(moment().toDate(), moment().subtract(diff, 'days').toDate());
  }

  /**
   * 날짜 범위를 해당 년도의 달에 1부터 그달의 마지막으로 한다.
   */
  static createYearMonth(year: number, month: number): DateRange {
    const from = moment(`${year}-${month}-01`).toDate();
    const to = moment(from).endOf('month').toDate();
    return new DateRange(from, to);
  }

  /**
   * 날짜영역 객체 생성. 기본 날짜 포맷 (YYYY-MM-DD HH:mm:ss)으로 날짜 변환
   */
  static create(from: string, to: string): DateRange {
    return new DateRange(moment(from).toDate(), moment(to).toDate());
  }

  from: Date;

  to: Date;

  constructor(from: Date, to: Date) {
    this.from = from;
    this.to = to;
  }

  get toDateFormat(): string {
    return moment(this.to).format('YYYY-MM-DD');
  }

  get fromDateFormat(): string {
    return moment(this.from).format('YYYY-MM-DD');
  }

  get toDateTimeFormat(): string {
    return moment(this.to).format('YYYY-MM-DD HH:mm:ss');
  }

  get fromDateTimeFormat(): string {
    return moment(this.from).format('YYYY-MM-DD HH:mm:ss');
  }

  get fromDate(): Date {
    return this.from;
  }

  get toDate(): Date {
    return this.to;
  }

  getToDateTimeFormat(formatStr: string): string {
    return moment(this.to).format(formatStr);
  }

  getFromDateTimeFormat(formatStr: string): string {
    return moment(this.from).format(formatStr);
  }
}
