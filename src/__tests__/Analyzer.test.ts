import log from 'electron-log';
import AnalyzerKorValue from '../main/service/analyzer/AnalyzerKorValue';
import AnalyzerMomentumMovieAverage, { MomentumMovieAverageCondition } from '../main/service/analyzer/AnalyzerMomentumMovieAverage';
import DateRange from '../common/model/DateRange';
import KorStockCode from '../common/KorStockCode';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});
describe('분석', () => {
  // eslint-disable-next-line jest/expect-expect
  it('한국주식 가치평가 전략', async () => {
    await AnalyzerKorValue.analyze();
    log.info('끝.');
  });

  // eslint-disable-next-line jest/expect-expect
  it('모멘텀 이평선 가중 전략', async () => {
    const conditon: MomentumMovieAverageCondition = {
      range: DateRange.createMaxRange(),
      cash: 10_000_000,
      stockCode: KorStockCode.KODEX_200,
      periodStep: [20, 40, 60, 80, 100],
      comment: '모멘텀 이평선 가중 전략',
    };

    await AnalyzerMomentumMovieAverage.analyze(conditon);
    log.info('끝.');
  });
});
