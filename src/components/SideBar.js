import React from "react";
import { Nav, NavItem, NavLink, Col } from "reactstrap"
import { NavLink as RouterNavLink } from "react-router-dom";

import { useAuth0 } from "../react-auth0-wrapper";

const SideBar = () => {
  const { isAuthenticated } = useAuth0();
  return (
      <Col lg='2' style={{
        borderRightColor: "black",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
      }}>
        <Nav className="ml-auto" navbar>
          {isAuthenticated && (
            <>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/profile"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Profile
          </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/enrollments"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Enrollments
          </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/external-api"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  External API
          </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Col>
        );
      }

      export default SideBar;
