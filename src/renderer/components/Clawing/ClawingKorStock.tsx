import { Col, Container, Row, Tab } from 'react-bootstrap';
import React from 'react';

function ClawingKorStock() {
  return (
    <Container fluid style={{ height: '100%', padding: '20px' }} className="color-theme-content">
      <h2>데이터 수집</h2>
      <Tab.Container defaultActiveKey="transaction">
        <Row>
          <Col sm={12}>ClawingStock</Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default ClawingKorStock;
