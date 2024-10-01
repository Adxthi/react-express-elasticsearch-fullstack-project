import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    return {
      token,
      isAuthenticated: !!token,
    };
  });

  const signin = async (user) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/signin",
      user
    );
    const token = response.data.token;
    localStorage.setItem("token", token);
    setAuth({ token, isAuthenticated: true });
  };

  const signup = async (user) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/signup",
      user
    );
    const token = response.data.token;
    localStorage.setItem("token", token);
    setAuth({ token, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};