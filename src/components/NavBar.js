import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

import {
  Row,
  Container,
  Navbar,
  NavbarBrand,
  Nav,
} from "reactstrap";

import { useAuth0 } from "../react-auth0-wrapper";
import { Logo, Button } from "@auth0/cosmos";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="nav-container">
      <Navbar color="light" light >
        <Container>
          <NavbarBrand tag={RouterNavLink} to="/" >
            <Row>
              <Logo />&nbsp;
              React SPA Demo
            </Row>
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <Button
              id={isAuthenticated ? "qsLogoutBtn" : "qsLoginBtn"}
              color="primary"
              className="btn-margin"
              onClick={isAuthenticated ?
                () => logout({}) :
                () => loginWithRedirect({ redirect_uri: window.location.origin })}>
              {isAuthenticated ? "Log out" : "Log in"}
            </Button>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
