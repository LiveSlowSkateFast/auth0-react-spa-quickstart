import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

import config from "./auth_config.json";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

const isRequired = (param) => { throw new Error(param + " is required"); };

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [idleTimer, setIdleTimer] = useState();

  const createProfile = (user) => {
    const namespace = 'https://localhost:3000/'
    const obj = {}
    if (user) {
      Object.keys(user).map(key => {
        if (key.startsWith(namespace)) {
          obj[key.replace(namespace, '')] = user[key]
        }
      })
    }
    return obj
  }

  const getProfileToken = async () => getTokenSilently({
    audience: "https://" + config.domain + "/api/v2/",
    scope: "update:current_user_metadata update:current_user"
  });

  const updateUserMetadata = async (path, value = isRequired("value")) => {

    try {
      const response = await fetch("https://" + config.domain + "/api/v2/users/" + user.sub, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getProfileToken()}`
        },
        body: JSON.stringify({ user_metadata: { [path]: value } })
      });

      if (response.status === 200) {
        const responseBody = await response.json()
        setProfile(responseBody.user_metadata)
      }
      return response
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
        setProfile(await createProfile(user));
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setProfile(await createProfile());
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    resetIdleTimer()
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
    setProfile(await createProfile());
  };

  const getTokenSilently = async (params) => {
    var token = null
    try {
      token = await auth0Client.getTokenSilently(params);
    } catch (error) {
      console.log(error)
      await loginWithPopup(params)
      token = await getTokenSilently(params)
    } finally {
      resetIdleTimer()
      return token
    }
  }

  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer)
    const newTimer = setTimeout(() => {
      auth0Client.logout()
    }, 300000);
    setIdleTimer(newTimer);
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        profile,
        updateUserMetadata,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getTokenSilently,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
}
