import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { useNavigate } from "react-router-dom";
import "./register.css";

import AuthService from "../../services/authservice";

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">This field is required!</div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">This is not a valid email.</div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="invalid-feedback d-block">
        The password must be between 6 and 40 characters.
      </div>
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
  const [message, setMessage] = useState("test");

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

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          if (response.data.result === "user created") {
            setMessage(
              "El usuario ha sido creado correctamente., puede iniciar sesión con el mismo"
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
          } else {
            setMessage("Ha ocurrido un error, por favor intente más tarde");
          }
          setSuccessful(false);
        }
      );
    }
  };

  useEffect(() => {
    if (successful) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, [successful, navigate]);

  return (
    <>
      <div class="login-container">
        <Form onSubmit={handleRegister} ref={form}>
          <div class="container-login">
            <div class="login-box">
              <div class="login">
                <h1>Registro</h1>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required]}
                  style={{ width: "88%" }}
                />
                <label for="username" class="login-input-icon">
                  <i class="fa fa-user"></i>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required]}
                  style={{ width: "88%" }}
                />
                <label for="password" class="login-input-icon">
                  <i class="fa fa-lock"></i>
                </label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  style={{ width: "88%" }}
                  validations={[required, validEmail]}
                />
                <label for="email" class="login-input-icon">
                  <i class="fa fa-user"></i>
                </label>
                <CheckButton ref={checkBtn}>Login </CheckButton>
                <span class="login-separator"></span>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
