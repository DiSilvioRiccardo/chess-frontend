import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AuthService from "../../../services/authservice";
import { useAuth } from "../../../common/authHook";


const Login = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);


  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const handleRedirectIfAuth = () => {
    if (auth) {
      navigate("/puzzle");
    }
  };

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAuth(true);
    navigate("/puzzle");
    window.location.reload();
  };

  const handleDisagree = () => { 
    setOpenDialog(false);
    localStorage.clear();
    setAuth(false);
    navigate("/login");
  };

  const messageAlert = () => {
    return (
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Descripcion de la aplicacion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{
            whiteSpace: "pre-line",
          }}>
            Esta aplicacion fue creada por Riccardo Di Silvio y Ivan Perez
            utilizando React y Material UI junto con Django y Postgress alojado en
            una Instancia de AWS dockerizada.
            <br/><br/>
            El objetivo de la aplicacion es que el usuario pueda desarrollar su capacidad cognitiva
            a traves de la resolucion de puzzle. Para ello, el usuario debera completar un formulario
            de inicio y luego resolver diversos puzzles que se le presentaran en la pantalla.
            Una vez que el usuario haya llegado a cierto limite, se le presentara nuevamente el formulario
            de inicio para que pueda completarlo nuevamente. El proposito es comprobar si el usuario mejoro
            su capacidad cognitiva a traves de la resolucion de puzzles.
            <br/><br/>
            Al usar la aplicacion, el usuario acepta que sus datos sean utilizados para el estudio de la
            capacidad cognitiva y que los mismos sean almacenados en una base de datos. Los datos seran
            anonimizados y no se almacenaran datos personales del usuario mas alla de su nombre y correo.
            <br/><br/>
            Para mas informacion, contactarse con los creadores de la aplicacion.
            <br/><br/>
            Muchas gracias por su colaboracion!
            <br/><br/>
            Riccardo Di Silvio y Ivan Perez
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree}>No estoy de Acuerdo</Button>
          <Button onClick={handleCloseDialog} autoFocus>
            Estoy de Acuerdo
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      () => {
        setOpenDialog(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error);
        setLoading(false);
        setMessage(resMessage);
        setOpen(true);
      }
    );
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setMessage("");
  };

  handleRedirectIfAuth();

  return (
    <Container component="main" maxWidth="sm">
      <Form onSubmit={handleLogin} ref={form}>
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
            Ingrese sesion
          </Typography>
          <Box component="Form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              onChange={onChangeUsername}
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{ mt: 3, mb: 2 }}
            >
              Ingrese!
            </Button>
          </Box>
        </Box>
      </Form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      {messageAlert()}
    </Container>
  );
};

export default Login;
