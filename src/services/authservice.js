import axios from "axios";

const API_URL = "http://localhost:8000/auth/";

/*
Primero, se importa la biblioteca Axios para realizar solicitudes HTTP.

API_URL es la URL base de la API del servidor de autenticación.

La función register toma un nombre de usuario, correo electrónico y contraseña como parámetros y realiza una solicitud POST a la ruta 
API_URL + "signup" para registrar un nuevo usuario en el servidor. Devuelve una promesa que se resuelve con la respuesta del servidor.

La función login toma un nombre de usuario y una contraseña como parámetros y realiza una solicitud POST a la ruta API_URL + 
"login" para iniciar sesión en el servidor. Si la solicitud es exitosa, almacena el token de acceso en el almacenamiento local del navegador y devuelve la respuesta del servidor. Si la solicitud falla, lanza un error.

La función logout elimina el usuario almacenado en el almacenamiento local del navegador y realiza una solicitud POST a la ruta API_URL 
+ "signout" para cerrar sesión en el servidor. Devuelve una promesa que se resuelve con la respuesta del servidor.

La función getCurrentUser obtiene el token de acceso almacenado en el almacenamiento local y realiza una solicitud POST a la ruta 
API_URL + "validate" para verificar la validez del token y obtener información del usuario actual. Devuelve una promesa que se resuelve 
con el nombre de usuario del usuario actual. Si la solicitud falla, lanza un error.

El objeto AuthService contiene todas las funciones disponibles para interactuar con el servidor de autenticación. Estas funciones se 
exportan para que puedan ser utilizadas en otros módulos de la aplicación.
*/

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
