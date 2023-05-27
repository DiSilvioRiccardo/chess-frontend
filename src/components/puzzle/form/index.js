import React from "react";
import Box from "@mui/material/Box";
import PuzzleService from "../../../services/puzzleservice";

function Form() {
  var page = 0;

  function submitForm() {
    PuzzleService.submitForm();
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function handleSubmmit(e) {
    console.log(page); 
    if (page >= 40) {
      timeout(10000).then(() => {
        console.log("timeout done, submiting form")
        submitForm();
        window.location.reload();
      });
    }
    page++;
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
        src="https://docs.google.com/forms/d/e/1FAIpQLSfFCB_QDaOQLVdl2gBY0aO1v8kbfKfDjq-QmdNXdheB4AWRRQ/viewform?embedded=true"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="Formulario de Inicio"
        onLoad={handleSubmmit}
      >
        Cargando…
      </iframe>
    </Box>
  );
}

export default Form;
