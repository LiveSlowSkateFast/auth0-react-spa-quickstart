import React from "react";
import NavBar from "./components/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";

// NEW - import the PrivateRoute component
import PrivateRoute from "./components/PrivateRoute";
import ExternalApi from "./components/ExternalApi";
import { useAuth0 } from "./react-auth0-wrapper";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />

          {/* NEW - Modify the /profile route to use PrivateRoute instead of Route */}
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
