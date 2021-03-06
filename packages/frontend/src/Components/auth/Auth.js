import React, { useEffect, useState } from "react";
import app from "./firebase";
import API from "../../api/client";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      user.getIdToken().then(token => {
        localStorage.setItem("token", token);
      })
      localStorage.setItem("userId", user.uid);
      // Refresh auth token evey 10 mins
      const refreshHandler = async () => {
        const token = await app.auth().currentUser.getIdToken(true);
        localStorage.setItem("token", token);
        setTimeout(refreshHandler, 10*60*1000)
      }
      refreshHandler();
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
