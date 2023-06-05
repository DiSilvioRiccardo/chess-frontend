import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isAuth = async () => {
      try {
        if (JSON.parse(localStorage.getItem("token")) === null) {
          setUser(null);
          return;
        }
        const res = await axios.post("http://localhost:8000/auth/validate", {
          token: JSON.parse(localStorage.getItem("token")),
        });
        
        setAuth(true);
        setUser(res.data.username);
      } catch (error) {
        console.log(error);
        setUser(null);
      }
    };

    isAuth();
  }, [auth,user]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
