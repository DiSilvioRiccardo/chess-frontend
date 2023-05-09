import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import { useAuth } from "./common/authHook";
import Login from "./components/login/login";
import Register from "./components/register/register";
import Chessboard from "./components/chess/chess";
import Form from "./components/form";
import "./App.css";

const App = () => {
  const { setAuth, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth();
    navigate("/login");
  };

  return (
    <div>
      <header class="header">
        <a class="logo" href="/form">
          Estudio de la aplicación de aprendizaje de ajedrez en la competencia
          cognitiva
        </a>
        <input class="menu-btn" type="checkbox" id="menu-btn" />
        <label class="menu-icon" for="menu-btn">
          <span class="navicon"></span>
        </label>
        <ul class="menu">
          {/* eslint-disable */}
          {user ? (
            <>
              <li>
                <a href="#one" class="link link-theme link-arrow">
                  {user}
                </a>
              </li>
              <li>
                <a class="link link-theme link-arrow" onClick={handleLogout}>
                  Cerrar Sesion
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={"/login"} className="link link-theme link-arrow">
                  Inicia Sesion
                </Link>
              </li>
              <li>
                <Link to={"/register"} className="link link-theme link-arrow">
                  Registrate
                </Link>
              </li>
            </>
          )}
        </ul>
        {/* eslint-enable */}
      </header>
      <div>
        <div id="main" class="main">
          <div className="container">
            <Routes>
              <Route exact path={"/"} element={<Login />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/form" element={<Form />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/chessboard" element={<Chessboard />} />
            </Routes>
          </div>

          <footer class="footer">
            <div class="container">
              <hr />
              <article class="foot-content-left">
                <ul>Made with ❤️ by Ivan Perez and Riccado Di Silvio</ul>
              </article>

              {/* eslint-disable */}
              <article class="foot-content">
                <ul>
                  <li class="social">
                    <a href="">Universidad del Norte</a>
                  </li>
                  <li class="social">
                    <a href="">Barranquilla</a>
                  </li>
                  <li class="social">
                    <a href="">Atlantico</a>
                  </li>
                </ul>
              </article>
              {/* eslint-enable */}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
