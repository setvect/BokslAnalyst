# 1. 테이블 설계서

sqlite3를 사용

## 1.1. 수집

### 1.1.1. AA_STOCK: 주식 종목

| Column Name | Attribute Name | Key | Type     | Len | Not Null | Description         |
| ----------- | -------------- | --- | -------- | --- | -------- | ------------------- |
| STOCK_SEQ   | 일련번호       | PK  | INTEGER  |     | Y        |                     |
| NAME        | 종목명         |     | VARCHAR  | 100 | Y        |                     |
| CODE        | 종목코드       |     | VARCHAR  | 20  | Y        | 005930, 233740, ... |

### 1.1.2. AB_CANDLE: 시세 정보

| Column Name      | Attribute Name | Key | Type     | Len | Not Null | Description                                             |
| ---------------- | -------------- | --- | -------- | --- | -------- | ------------------------------------------------------- |
| CANDLE_SEQ       | 일련번호       | PK  | INTEGER  |     | Y        |                                                         |
| STOCK_SEQ        | 종목           | FK  | INTEGER  |     | Y        |                                                         |
| CANDLE_DATE_TIME | 시세 기준 날짜 | IDX | DATETIME |     | Y        |                                                         |
| PERIOD_TYPE      | 기준 기간      | IDX | VARCHAR  | 20  | Y        | PERIOD_DAY: 일봉, PERIOD_WEEK: 주봉, PERIOD_MONTH: 월봉 |
| OPEN_PRICE       | 시가           |     | REAL     |     | Y        |                                                         |
| HIGH_PRICE       | 고가           |     | REAL     |     | Y        |                                                         |
| LOW_PRICE        | 저가           |     | REAL     |     | Y        |                                                         |
| CLOSE_PRICE      | 종가           |     | REAL     |     | Y        |                                                         |


### 1.1.3. AC_CORPORATE_DISCLOSURE_INFO: 기업공시정보

| Column Name                   | Attribute Name     | Key | Type     | Len | Not Null | Description                      |
| ----------------------------- | ------------------ | --- | -------- | --- | -------- | -------------------------------- |
| CORPORATE_DISCLOSURE_INFO_SEQ | 일련번호           | PK  | INTEGER  |     | Y        |                                  |
| CODE                          | 종목코드           |     | VARCHAR  | 20  | Y        | 005930, 233740, ...              |
| FINANCIAL_METRIC_TYPE         | 재무제표 항목 유형 |     | VARCHAR  |     | Y        | SALES_REVENUE, TOTAL_ASSETS, ... |
| YEAR                          | 년도               |     | INTEGER  |     | Y        |                                  |
| ACCOUNT_CLOSE                 | 회계마감 기준      |     | VARCHAR  | 20  | Y        | Q1, Q2, Q3, Q4                   |
| ITEM_NAME                     | 재무제표 항목명    |     | VARCHAR  | 50  | Y        | 매출액, 영업이익                 |
| Q1_VALUE                      | 1분기값            |     | INTEGER  |     | Y        |                                  |
| Q2_VALUE                      | 2분기값            |     | INTEGER  |     | Y        |                                  |
| Q3_VALUE                      | 3분기값            |     | INTEGER  |     | Y        |                                  |
| Q4_VALUE                      | 4분기값            |     | INTEGER  |     | Y        |                                  |
| REG_DATE                      | 등록일             |     | DATETIME |     | Y        |                                  |
| EDIT_DATE                     | 마지막 수정일      |     | DATETIME |     | Y        |                                  |

