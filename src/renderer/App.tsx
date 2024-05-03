import { Col, Container, Row, Spinner } from 'react-bootstrap';
import React, { Suspense, useEffect, useRef } from 'react';
import { HashRouter as Router, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import ClawingKorStock from './components/Clawing/ClawingKorStock';

function Wait() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      navigate('/Clawing/KorStock');
      isInitialRender.current = false;
    }
  }, [navigate]);

  return (
    <Container fluid style={{ minHeight: '100vh' }} data-bs-theme="dark">
      <Row style={{ minHeight: '100vh' }}>
        <Menu />
        <Col style={{ padding: '20px' }} className="color-theme-content-bg">
          <Suspense fallback={<Wait />}>
            <Routes>
              <Route path="Clawing/KorStock" element={<ClawingKorStock />} />
              <Route path="Clawing" element={<Navigate to="/Clawing/KorStock" />} />
              <Route path="/" element={<Navigate to="/Clawing/KorStock" />} />
            </Routes>
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
