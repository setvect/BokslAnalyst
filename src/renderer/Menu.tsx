import { Button, Col, Nav, Navbar, Row } from 'react-bootstrap';
import { FaChartBar, FaCloudDownloadAlt, FaPaw } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getTopPath } from '../common/CommonUtil';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  subMenu?: { path: string; label: string }[];
}

const menuItems: MenuItem[] = [
  {
    path: '/Clawing',
    label: '데이터 수집',
    icon: <FaCloudDownloadAlt className="me-2" />,
    subMenu: [
      { path: '/Clawing/KorStock', label: '국내 주가' },
      { path: '/Clawing/UsaStock', label: '미장 주가' },
    ],
  },
  {
    path: '/Analysis',
    label: '분석',
    icon: <FaChartBar className="me-2" />,
    subMenu: [
      { path: '/Analysis/SubMenu1', label: '하위 메뉴 1' },
      { path: '/Analysis/SubMenu2', label: '하위 메뉴 2' },
    ],
  },
];

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setOpenMenu(getTopPath(location.pathname));
  }, [location.pathname, navigate, openMenu]);

  const getButtonClass = (path: string) => {
    return location.pathname === `${path}` ? 'custom-btn-navy' : 'custom-btn';
  };

  return (
    <Col className="color-theme-left sidebar-style">
      <Row>
        <Col style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 17 }}>
          <Navbar variant="dark" expand="lg">
            <Navbar.Brand style={{ paddingLeft: '37px', fontSize: '25px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <FaPaw size={30} style={{ marginBottom: 3 }} color="#ffee77" /> 복슬분석가
              </Link>
            </Navbar.Brand>
          </Navbar>
        </Col>
      </Row>

      <Nav className="flex-column menu" style={{ padding: '10px 20px' }}>
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link to={item.path}>
              <Button className={`text-left mb-2 menu-button ${getButtonClass(item.path)}`} onClick={() => setOpenMenu(item.path)}>
                {item.icon}
                {item.label}
              </Button>
            </Link>
            {openMenu === item.path && item.subMenu && (
              <div style={{ marginLeft: 30 }}>
                {item.subMenu.map((subItem) => (
                  <Link to={subItem.path} key={subItem.path}>
                    <Button className={`text-left mb-2 menu-button ${getButtonClass(subItem.path)}`}>{subItem.label}</Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </Nav>
    </Col>
  );
}

export default Menu;
