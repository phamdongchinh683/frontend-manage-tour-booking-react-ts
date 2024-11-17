import { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import useToken from '../../../jwt/useToken';
import navLink from "../../../mock/test.json";
export const Header: FC = () => {
 const{deleteToken} = useToken();
 const logout = () =>{
  window.location.reload();
  deleteToken();
 }
  return (
    <Navbar expand="lg" className="bg-body-tertiary" >
    <Container>
      <Link to="/">
        <Navbar.Collapse>Dashboard</Navbar.Collapse>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {navLink.map((router) => (
            <Link
              to={`/dashboard/${router.linkRouter}`}
              key={router.id}
              className="nav-link"
            >
              {router.name}
            </Link>
          ))}
          <NavDropdown title="Features" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}
