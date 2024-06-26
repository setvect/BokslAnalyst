# 복슬분석가
주가 정보를 크롤링 하여 분석하는 프로그램. [복슬스톡](https://github.com/setvect/BokslStock2)에서 제공하는 분석기능을 옮기는 게 목적.

## 1. 주요기능
- 크롤링
  - 시세 크롤링
  - 기업 밸류 크롤링
- 주가 기반 백테스트
  - 이동평균돌파 전략
  - 변동성 돌파 전략
  - 듀얼모멘텀
  - 리벨런싱
  - LAA
- 밸류 기반 백테스트
- Claude 3 Opus를 활용한 기업 분석 리포트

## 2. 실행 및 빌드

### 2.1. 초기셋팅

```shell
$ npm install

$ cd release/app
$ npm install
```

### 2.2. 실행 방법

```shell
$ npm start
```

### 2.3. 빌드 방법 (인스톨 파일 생성)

```shell
$ npm run package
```

- 빌드 결과는 `release/build` 폴더에 생성됨

## 3. 설계 문서


## 4. 주요화면

## 5. 개발환경

프로젝트 초기환경은 [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)를 기반으로 만들었음.

### 5.1. 주요 프레임워크 및 라이브러리

## 6. 관련 정보
### 6.1 크롤링 사이트
- https://www.alphavantage.co : 미국 증시 데이터
- https://opendart.fss.or.kr : 한국 기업 데이터

