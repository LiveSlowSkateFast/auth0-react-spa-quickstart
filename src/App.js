import React from "react";
import { useAuth0 } from "./react-auth0-wrapper";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Container, Col, Row } from "reactstrap";

import Profile from "./views/Profile";
import Enrollments from "./views/Enrollments";
import ExternalApi from "./views/ExternalApi";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import PrivateRoute from "./components/PrivateRoute";
import { Spinner } from "@auth0/cosmos";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <Spinner size="large"/>;
  }
  return (
    <div id="app">
      <BrowserRouter>
        <NavBar />
        <Container className="mt-5">
          <Row>
            <SideBar />
            <Col lg='10'>
              <Switch>
                <Route path="/" exact />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/enrollments" component={Enrollments} />
                <PrivateRoute path="/external-api" component={ExternalApi} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    </div >
  );
}

export default App;
