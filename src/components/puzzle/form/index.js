import React from "react";
import Box from "@mui/material/Box";
import PuzzleService from "../../../services/puzzleservice";

function Form() {
  let afterInitialLoading = false;

  function submitForm() {
    PuzzleService.submitForm();
  }

  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function handleSubmmit(e) {
    if (afterInitialLoading) {
      submitForm();
      sleep(20000).then(() => {
        window.location.reload();
      });

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
        onLoad={handleSubmmit}
      >
        Cargando…
      </iframe>
    </Box>
  );
}

export default Form;
