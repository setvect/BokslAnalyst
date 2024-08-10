import log from 'electron-log';
import AnalyzerKorValue from '../main/service/analyzer/AnalyzerKorValue';

jest.mock('electron-is-dev', () => {
  return true; // 또는 false, 시뮬레이션하려는 상황에 따라
});
describe('분석', () => {
  // eslint-disable-next-line jest/expect-expect
  it('한국주식 가치평가 전략', async () => {
    await AnalyzerKorValue.analyze();
    log.info('끝.');
  });
});
