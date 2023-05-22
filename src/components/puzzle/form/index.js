import React from "react";
import Box from "@mui/material/Box";
import PuzzleService from "../../../services/puzzleservice";

function Form() {
  let afterInitialLoading = false;
  var page = 0;
  var sleep = timeout(20000);

  function submitForm() {
    PuzzleService.submitForm();
  }

  function timeout(ms) {
    var timeout, promise;

    promise = new Promise(function (resolve, reject) {
      timeout = setTimeout(function () {
        resolve("timeout done");
      }, ms);
    });

    return {
      promise: promise,
      cancel: function () {
        console.log("timeout cancelled");
        clearTimeout(timeout);
      }, //return a canceller as well
    };
  }

  function handleSubmmit(e) {
    if (page >= 54) {
      sleep.cancel();
      sleep.promise.then(() => {
        submitForm();
        window.location.reload();
      });
    }
    page++;
    console.log(page); 
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
