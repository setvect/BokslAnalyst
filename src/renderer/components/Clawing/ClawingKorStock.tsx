import { Button, Col, Container, Form, Nav, Pagination, Row, Tab, Table } from 'react-bootstrap';
import React from 'react';

function ClawingKorStock() {
  return (
    <Container fluid style={{ height: '100%', padding: '20px' }} className="color-theme-content">
      <h2>데이터 수집</h2>
      <Tab.Container defaultActiveKey="first">
        <Row>
          <Col sm={12}>
            <Nav variant="pills">
              <Nav.Item style={{ marginLeft: '10px' }}>
                <Nav.Link eventKey="first">종목</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Tab 2</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col sm={12} style={{ margin: '10px' }}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
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
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <p>Tab 2 content</p>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default ClawingKorStock;
