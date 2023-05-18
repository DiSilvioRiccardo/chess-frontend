import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import PuzzleService from "../../../services/puzzleservice";

function Form() {
  const navigate = useNavigate();
  let afterInitialLoading = false;

  function submitForm() {
    PuzzleService.submitForm();
  }

  function handleSubmmit(e) {
    if (afterInitialLoading) {
      navigate("/chessboard");
      return;
    }
    afterInitialLoading = true;
  }

  return (
    <Box
      sx={{
        marginTop: "5%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeO7INusou0Ps1lI2SlrAFd0WYmveGCWRkdkttiFedOGKZjvA/viewform?embedded=true"
        width="640"
        height="3257"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="Formulario de Inicio"
        scrolling="no"
        onLoad={handleSubmmit}
      >
        Cargando…
      </iframe>
    </Box>
  );
}

export default Form;
