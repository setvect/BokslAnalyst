import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import React from 'react';
import ClawingKorStockList from './ClawingKorStockList';
import ClawingKorStockRun from './ClawingKorStockRun';

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
                <Nav.Link eventKey="second">수집</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col sm={12} style={{ margin: '10px' }}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <ClawingKorStockList />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ClawingKorStockRun />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default ClawingKorStock;
