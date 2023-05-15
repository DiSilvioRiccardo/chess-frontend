import axios from "axios";

const API_URL = "http://web:8000/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      console.log("sucess proceeding to set token")
      console.log(response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(username));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return axios.post(API_URL + "validate", {
    token,
  }).then((response) => {
    return response.body.username;
  }).catch((error) => {
    console.log(error);
    throw error;
  });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
