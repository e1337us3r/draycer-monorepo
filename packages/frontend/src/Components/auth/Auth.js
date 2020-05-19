import React, { useEffect, useState } from "react";
import app from "./firebase";
import API from "../../api/client";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      user.getIdToken().then(token => API.token = token)
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
