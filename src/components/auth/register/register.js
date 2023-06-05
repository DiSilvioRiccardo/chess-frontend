import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";

import { isEmail } from "validator";
import { useNavigate } from "react-router-dom";

import { Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import AuthService from "../../../services/authservice";

/*
Importaciones de módulos y componentes:

Se importan varios módulos y componentes necesarios para construir el formulario de registro, como React, useState, useRef, useEffect, Form, etc.
También se importan componentes de la librería @mui/material, como Container, Typography, Box, TextField, Button, Alert y Snackbar.
Además, se importa el servicio AuthService desde el archivo authservice.js.
Definición de funciones de validación:

Se definen funciones de validación personalizadas, como required, validEmail, vusername y vpassword, para validar los campos del formulario.
Componente Register:

El componente Register es una función que muestra el formulario de registro y maneja la lógica asociada al registro de usuarios.
Dentro del componente, se utilizan los hooks useState para gestionar los estados de los campos del formulario, como username, email, password, successful y message.
También se utilizan los hooks useRef para crear referencias a elementos del formulario, y useNavigate para acceder a la función de navegación proporcionada por react-router-dom.
Manejo de cambios en los campos del formulario:

Se definen las funciones onChangeUsername, onChangeEmail y onChangePassword que se ejecutan cuando hay cambios en los campos de nombre de usuario, correo electrónico y contraseña, respectivamente. Estas funciones actualizan los estados correspondientes.
Manejo del registro de usuario:

La función handleRegister se encarga de manejar el evento de registro de usuario cuando se envía el formulario.
Dentro de la función, se valida que los campos del formulario estén llenos y cumplan con los criterios de validación definidos.
Se utiliza el servicio AuthService.register para enviar una solicitud de registro al servidor.
Dependiendo de la respuesta del servidor, se establece el estado successful como true si el usuario se creó correctamente, y se muestra un mensaje correspondiente.
Efecto secundario useEffect:

Se utiliza useEffect para redirigir al usuario a la página de inicio de sesión después de un registro exitoso. Esto se realiza mediante la función navigate proporcionada por react-router-dom.
Renderizado del formulario:

Dentro del retorno del componente, se utiliza la estructura de componentes y estilos de la librería @mui/material para construir el formulario de registro.
El formulario se envuelve en el componente Form para gestionar la validación.
Se utilizan los componentes Box, Typography, TextField, Button, Alert y Snackbar para mostrar los elementos del formulario y mensajes de error.
*/

const required = (value) => {
  if (!value) {
    return (
      <Snackbar open={true} autoHideDuration={6000}>
        <Alert severity="error">Por favor llene todos los campos</Alert>
      </Snackbar>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <Snackbar open={true} autoHideDuration={6000}>
        <Alert severity="error">Este no es un correo valido</Alert>
      </Snackbar>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <Snackbar open={true} autoHideDuration={6000}>
        <Alert severity="error">
          El nombre de usuario debe tener entre 3 y 20 caracteres
        </Alert>
      </Snackbar>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <Snackbar open={true} autoHideDuration={6000}>
        <Alert severity="error">
          La contraseña debe tener entre 6 y 40 caracteres
        </Alert>
      </Snackbar>
    );
  }
};

const Register = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    console.log("registering")

    if(email && username && password){

      if(username < 3 || username > 20){
        setMessage("El nombre de usuario debe tener entre 3 y 20 caracteres");
        setSuccessful(false);
        return;
      }
      if(!isEmail(email)){
        setMessage("Este no es un correo valido");
        setSuccessful(false);
        return;
      }
      if(password < 6 || password > 40){
        setMessage("La contraseña debe tener entre 6 y 40 caracteres");
        setSuccessful(false);
        return;
      }

      AuthService.register(username, email, password).then(
        (response) => {
          if (response.data.result === "user created") {
            setMessage(
              "El usuario ha sido creado correctamente, puede iniciar sesión con el mismo"
            );
            setSuccessful(true);
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.result) ||
            error.result ||
            error.toString();
          if (resMessage === "user already exists") {
            setMessage("El usuario ya existe, por favor intente con otro");
          } else if (resMessage === "email already exists") {
            setMessage("El correo ya existe, por favor intente con otro");
          } else if(resMessage === "username already exists"){
            setMessage("El nombre de usuario ya existe, por favor intente con otro");
          }else{
            setMessage("Ha ocurrido un error, por favor intente más tarde");
          }
          setSuccessful(false);
        }
      );
    }else{
      setMessage("Por favor llene todos los campos");
      setSuccessful(false);
      return;
    }
  
  };

  useEffect(() => {
    if (successful) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [successful, navigate]);

  return (
    <>
      <Container component="main" maxWidth="sm">
        <Form onSubmit={handleRegister} ref={form}>
          <Box
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              px: 4,
              py: 6,
              marginTop: "15%",
              marginBottom: "5%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Registrese
            </Typography>
            <Box>
              {message && (
                <Alert severity={successful ? "success" : "error"}>
                  {message}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nombre de Usuario"
                name="username"
                autoComplete="username"
                onChange={onChangeUsername}
                validations={[required, vusername]}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electronico"
                name="email"
                autoComplete="email"
                onChange={onChangeEmail}
                validations={[required, validEmail]}
                autoFocus
              />
              <TextField
                margin="normal"
                type="password"
                required
                fullWidth
                id="password"
                label="Contraseña"
                onChange={onChangePassword}
                validations={[required, vpassword]}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Registrese!
              </Button>
            </Box>
          </Box>
        </Form>
      </Container>
    </>
  );
};

export default Register;
