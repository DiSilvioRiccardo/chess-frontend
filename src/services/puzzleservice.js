import axios from "axios";

const API_URL = "http://localhost:8000/puzzles/";

/*
El servidor de rompecabezas tiene una API expuesta en http://localhost:8000/puzzles/ y requiere autenticación mediante un token.

Aquí está el desglose del código:

Se importa la biblioteca Axios para realizar solicitudes HTTP.

API_URL es la URL base de la API del servidor de rompecabezas.

config es un objeto que contiene las cabeceras de la solicitud HTTP. En este caso, se incluye la autorización utilizando el token 
almacenado en el almacenamiento local del navegador.

La función getProfile realiza una solicitud GET a la ruta http://localhost:8000/auth/profile con las cabeceras de autorización
proporcionadas en config. Devuelve una promesa que se resuelve con los datos del perfil del usuario.

La función getPuzzle realiza una solicitud GET a la ruta API_URL con las cabeceras de autorización proporcionadas en config. 
Devuelve una promesa que se resuelve con los datos del rompecabezas.

La función SendChessPuzzleResult realiza una solicitud POST a la ruta API_URL + "solution" con los resultados del rompecabezas 
proporcionados en el parámetro result y las cabeceras de autorización en config. Devuelve una promesa que se resuelve con la respuesta del servidor.

La función submitForm es una función asíncrona que primero llama a getProfile para obtener los datos del perfil del usuario. 
Luego, verifica si el usuario ha completado los formularios iniciales (did_initial_form), el formulario 700 (did_700_form) y 
el formulario 1500 (did_1500_form). Dependiendo del estado de los formularios, realiza una solicitud POST a la ruta API_URL + 
"form_report" con el tipo de formulario correspondiente. Devuelve una promesa que se resuelve con la respuesta del servidor.

La función sendLogicPuzzleResult realiza una solicitud POST a la ruta API_URL + "logic_puzzle/solution" con los resultados del 
rompecabezas lógico proporcionados en el parámetro result y las cabeceras de autorización en config. Devuelve una promesa que se 
resuelve con la respuesta del servidor.

El objeto PuzzleService contiene todas las funciones disponibles para interactuar con el servidor de rompecabezas. 
Estas funciones se exportan para que puedan ser utilizadas en otros módulos de la aplicación.
*/

const config = {
  headers: {
    Authorization: "Token " + JSON.parse(localStorage.getItem("token")),
  },
};

const getProfile = () => {
  return axios
    .get("http://localhost:8000/auth/profile", config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getPuzzle = () => {
  return axios
    .get(API_URL, config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const SendChessPuzzleResult = (result) => {
  return axios
    .post(API_URL + "solution", result, config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const submitForm = async () => {
  const profile = await getProfile();
  console.log(profile)
  if (!profile.did_initial_form) {
    const type = { type: 0 };
    return axios
      .post(API_URL + "form_report", type, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  } else if (!profile.did_700_form) {
    const type = { type: 700 };
    return axios
      .post(API_URL + "form_report", type, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  } else if (!profile.did_1500_form) {
    const type = { type: 1500 };
    return axios
      .post(API_URL + "form_report", type, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
};

const sendLogicPuzzleResult = (result) => {
  return axios
    .post(API_URL + "logic_puzzle/solution", result, config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const PuzzleService = {
  getProfile,
  getPuzzle,
  submitForm,
  SendChessPuzzleResult,
  sendLogicPuzzleResult,
};

export default PuzzleService;
