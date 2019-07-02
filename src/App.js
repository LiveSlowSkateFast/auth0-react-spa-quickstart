import React from "react";
import NavBar from "./components/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./views/Profile";
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
    <PageLayout>
      <BrowserRouter>
        <PageLayout.Header>
          <NavBar />
        </PageLayout.Header>
        <PageLayout.Content>
        <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/external-api" component={ExternalApi} />
        </Switch>
        </PageLayout.Content>
      </BrowserRouter>
    </PageLayout>
  );
}

export default App;
