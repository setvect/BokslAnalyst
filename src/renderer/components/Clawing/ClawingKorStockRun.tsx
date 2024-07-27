import { Button, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap';
import React from 'react';

function ClawingKorStockRun() {
  return (
    <Container>
      <span>https://finance.naver.com/sise/sise_market_sum.naver</span> 사이트 수집 합니다.
      <Form className="mb-3">
        <Row>
          <Col xs="auto">
            <Button variant="outline-success">수집하기</Button>
          </Col>
        </Row>
        <Row>
          <Col xs="auto">
            <ul>
              <li>코스피: 333/2232 진행</li>
              <li>코스닥: 333/2232 진행</li>
            </ul>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default ClawingKorStockRun;
