import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Cookies from 'js-cookie';

//Get the token or null
const token = Cookies.get('token') ?? null;

//Set user details based on JWT token
const user = token && JSON.parse(atob(token.split('.')[1])).user;

const CustomNavbar = () => {
  const logout = (e) => {
    e.preventDefault();

    Cookies.remove('token');
    window.location.href = '/login';
  };

  //Show the proper dropdown for an admin user or a normal user
  const AuthDropdown = () => {
    let authItemList = [];

    if (user) {
      switch (user.user_type) {
        case 'admin':
          authItemList.push(
            <NavDropdown.Item href={'/upload'}>Upload file</NavDropdown.Item>,
            <NavDropdown.Item href={'/'}>Calculate</NavDropdown.Item>
          );
        default:
          authItemList.push(
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          );
          break;
      }

      return (
        <NavDropdown
          title={`Welcome ${user.user_name}`}
          id="collasible-nav-dropdown"
        >
          {authItemList}
        </NavDropdown>
      );
    }

    return null;
  };

  return (
    <Navbar bg="primary" variant="dark" style={{ marginBottom: '30px' }}>
      <Container>
        <Navbar.Brand href="/">Merchant Cost Calculator</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav style={{ justifyContent: 'end' }}>{AuthDropdown()}</Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
