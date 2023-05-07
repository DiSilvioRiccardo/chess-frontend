import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../../services/authservice";
import { useAuth } from "../../common/authHook";
import "./login.css";

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">This field is required!</div>
    );
  }
};

const Login = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const handleRedirectIfAuth = () => {
    if (auth) {
      navigate("/chessboard");
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

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        () => {
          setAuth(true);
          navigate("/home");
          window.location.reload();
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
        }
      );
    } else {
      setLoading(false);
    }
  };

  handleRedirectIfAuth();

  return (
    <div class="login-container">
      <Form onSubmit={handleLogin} ref={form}>
        <div class="container-login">
          <div class="login-box">
            <div class="login">
              <h1>Authentication</h1>
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
              <CheckButton ref={checkBtn}>Login </CheckButton>
              <span class="login-separator"></span>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Login;
