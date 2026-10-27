import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "userData";

// Read synchronously so the first render already knows whether the user is
// logged in (otherwise a page refresh briefly redirects to /auth)
const readStoredAuth = () => {
  try {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      return {
        token: storedData.token,
        userId: storedData.userId,
        expiration: new Date(storedData.expiration),
      };
    }
  } catch (err) {}
  return null;
};

export const useAuth = () => {
  const [authData, setAuthData] = useState(readStoredAuth);

  const login = useCallback((uid, token, expirationDate) => {
    const expiration =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setAuthData({ token, userId: uid, expiration });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: expiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setAuthData(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!authData) {
      return;
    }
    const remainingTime = authData.expiration.getTime() - new Date().getTime();
    const logoutTimer = setTimeout(logout, remainingTime);
    return () => clearTimeout(logoutTimer);
  }, [authData, logout]);

  return {
    token: authData ? authData.token : null,
    userId: authData ? authData.userId : null,
    login,
    logout,
  };
};
