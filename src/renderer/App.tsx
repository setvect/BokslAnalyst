import { Col, Container, Row, Spinner } from 'react-bootstrap';
import React, { Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Clawing from './components/Clawing';
import Menu from './Menu';

function Wait() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}


export default function App() {
  return (
    <Container fluid style={{ minHeight: '100vh' }} data-bs-theme="dark">
      <Row style={{ minHeight: '100vh' }}>
        <Router>
          <Menu />
          <Col style={{ padding: '20px' }} className="color-theme-content-bg">
            <Suspense fallback={<Wait />}>
              <Routes>
                <Route path="Clawing" element={<Clawing />} />
              </Routes>
            </Suspense>
          </Col>
        </Router>
      </Row>
    </Container>
  );

}
