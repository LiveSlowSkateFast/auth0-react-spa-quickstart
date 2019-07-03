import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

import {
  Row,
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";

import { useAuth0 } from "../react-auth0-wrapper";
import { Logo, Button } from "@auth0/cosmos";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const toggle = () => {
    setIsOpen({ isOpen: !isOpen });
  };

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md">
        <Container>
          <NavbarBrand tag={RouterNavLink} to="/" >
            <Row>
              <Logo />&nbsp;
              React SPA Demo
            </Row>
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
            </Nav>
            <Nav className="d-none d-md-block" navbar>
              <NavItem>
                <Button
                  id={isAuthenticated ? "qsLogoutBtn" : "qsLoginBtn"}
                  color="primary"
                  className="btn-margin"
                  onClick={isAuthenticated ?
                    () => logout({}) :
                    () => loginWithRedirect({ redirect_uri: window.location.origin })}>
                  {isAuthenticated ? "Log out" : "Log in"}
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
