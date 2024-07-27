import { Button, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap';
import React from 'react';

function ClawingKorStockList() {
  return (
    <Container>
      <Form className="mb-3">
        <Row>
          <Col>
            <Form.Control type="text" placeholder="Search" />
          </Col>
          <Col xs="auto">
            <Button variant="outline-success">검색</Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>종목 코드</th>
            <th>종목명</th>
            <th>수집기간</th>
            <th>바로가기</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>546587</td>
            <td>삼성전자</td>
            <td>2010.02.22 ~ 2024.05.07</td>
            <td>네이버, 알파스퀘어</td>
          </tr>
        </tbody>
      </Table>

      <Pagination className="justify-content-center mt-3">
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Ellipsis />

        <Pagination.Item>{10}</Pagination.Item>
        <Pagination.Item>{11}</Pagination.Item>
        <Pagination.Item active>{12}</Pagination.Item>
        <Pagination.Item>{13}</Pagination.Item>
        <Pagination.Item disabled>{14}</Pagination.Item>

        <Pagination.Ellipsis />
        <Pagination.Item>{20}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    </Container>
  );
}

export default ClawingKorStockList;
