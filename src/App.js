import React from "react";
import { Container } from "reactstrap";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./views/Profile";
import Enrollments from "./views/Enrollments";
import ExternalApi from "./views/ExternalApi";
import PrivateRoute from "./components/PrivateRoute";
import ExternalApi from "./components/ExternalApi";
import Loading from "./components/Loading"
import { useAuth0 } from "./react-auth0-wrapper";
import { PageLayout } from "@auth0/cosmos";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }
  return (
    <div id="app">
      <BrowserRouter>
          <NavBar />
        <Container className="mt-5">
        <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/enrollments" component={Enrollments} />
          <PrivateRoute path="/external-api" component={ExternalApi} />
        </Switch>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
