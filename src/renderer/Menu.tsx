import { Button, Col, Nav, Navbar, Row } from 'react-bootstrap';
import { FaCalendarAlt, FaPaw } from 'react-icons/fa';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: 'Clawing', label: '데이터 수집', icon: <FaCalendarAlt className="me-2" /> },
];

function Menu() {
  const location = useLocation();

  const getButtonClass = (path: string) => {
    return location.pathname === `/main/${path}` ? 'custom-btn-navy' : 'custom-btn';
  };

  return (
    <Col className="color-theme-left sidebar-style">
      <Row>
        <Col style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 17 }}>
          <Navbar variant="dark" expand="lg">
            <Navbar.Brand style={{ paddingLeft: '37px', fontSize: '25px' }}>
              <Link to="/main/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <FaPaw size={30} style={{ marginBottom: 3 }} color="#ffee77" /> 복슬분석가
              </Link>
            </Navbar.Brand>
          </Navbar>
        </Col>
      </Row>

      <Nav className="flex-column menu" style={{ padding: '10px 20px' }}>
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <Button className={`text-left mb-2 menu-button ${getButtonClass(item.path)}`}>
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </Nav>
    </Col>
  );
}

export default Menu;
