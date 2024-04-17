import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
  };

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for token in sessionStorage
    const user = sessionStorage.getItem('userdata');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    sessionStorage.setItem('userdata', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.clear();
  };

  const contextValue = {
    currentUser,
    setCurrentUser, // Now passing this as part of the context
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
