import { useState } from "react";
import { useStopwatch } from "react-timer-hook";

import Grid from "@mui/material/Unstable_Grid2";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

import PuzzleService from "../../../services/puzzleservice";

/*
El componente utiliza varias bibliotecas de interfaz de usuario de Material-UI y dependencias externas como react-timer-hook. 
Veamos el desglose del código:

Se importan los módulos y componentes necesarios, como useState de React, useStopwatch de react-timer-hook, y 
varios componentes de interfaz de usuario de Material-UI como Grid, Alert, Paper, Radio, RadioGroup, FormControlLabel, FormControl, 
FormLabel, Button, Box y Snackbar.

El componente Quiz se define como una función que recibe props como argumento.

Se inicializan varias variables de estado utilizando el hook useState. Estas variables de estado se utilizan para almacenar y 
gestionar el estado del cuestionario y los resultados.

La función useStopwatch del hook useStopwatch se utiliza para iniciar un temporizador que cuenta los segundos y minutos 
transcurridos desde que se carga el componente.

La función formatTime se utiliza para formatear el tiempo en minutos y segundos en un formato de dos dígitos.

La función handleRadioChange se ejecuta cuando se cambia la opción seleccionada en el cuestionario y actualiza el valor 
seleccionado en el estado.

La función handleSubmit se ejecuta cuando se envía el formulario de respuestas del cuestionario. Realiza las siguientes acciones:

Restablece los mensajes de "correcto" e "incorrecto" a falso.
Verifica si la respuesta seleccionada (value) coincide con la solución correcta del rompecabezas (puzzle.correct_solution).
Si la respuesta es correcta y aún no se ha respondido, pausa el temporizador, envía los resultados del rompecabezas al servidor utilizando PuzzleService.sendLogicPuzzleResult, marca el cuestionario como respondido y espera 1.5 segundos antes de recargar la página.
Si la respuesta es correcta, también muestra un mensaje de "correcto".
Si la respuesta es incorrecta y aún no se ha respondido, envía los resultados del rompecabezas al servidor utilizando 
PuzzleService.sendLogicPuzzleResult y marca el cuestionario como respondido.
Muestra un mensaje de "incorrecto".
La función setCognitiveDevelopment devuelve un componente Alert de Material-UI que muestra el desarrollo cognitivo basado en la 
calificación (rating) del perfil del usuario.

La función handleNewGameClick se ejecuta cuando se hace clic en el botón "New Game" y recarga la página.

La función handleClose se ejecuta cuando se cierra el Snackbar de "correcto" o "incorrecto". Restablece los mensajes de "correcto" e 
"incorrecto" a falso y, si la respuesta es correcta, espera 1 segundo antes de llamar a handleNewGameClick para iniciar un nuevo juego.

La función sleep devuelve una promesa que se resuelve después de un período de tiempo especificado en milisegundos.

El componente Quiz devuelve el JSX que representa la interfaz de usuario del cuestionario. Utiliza los componentes de Material-UI 
para mostrar la información del cuestionario, las opciones de respuesta y los botones de envío. También muestra Snackbars para 
mostrar los mensajes de "correcto" e "incorrecto".
*/

function Quiz(props) {
  const puzzle = props.puzzle;

  const solutions = puzzle.solutions.split(" ");

  const [answers] = useState([...solutions]);
  const [value, setValue] = useState("");
  const [openCorrect, setOpenCorrect] = useState(false);
  const [openIncorrect, setOpenIncorrect] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [profile] = useState(props.profile);

  const { seconds, minutes, totalSeconds, pause } = useStopwatch({
    autoStart: true,
  });

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  const handleRadioChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setOpenCorrect(false);
    setOpenIncorrect(false);

    if (value === puzzle.correct_solution) {
      if (!answered) {
        pause();
        PuzzleService.sendLogicPuzzleResult({
          time: totalSeconds,
          correct: true,
        });
        setAnswered(true);
        sleep(1500).then(() => {
          window.location.reload(false);
        });
      }
      pause();
      setOpenCorrect(true);
    } else {
      if (!answered) {
        PuzzleService.sendLogicPuzzleResult({
          puzzle: puzzle.id,
          time: totalSeconds,
          correct: false,
        });
        setAnswered(true);
      }
      setOpenIncorrect(true);
    }
  };

  const setCognitiveDevelopment = (rating) => {
    if (rating < 700) {
      return (
        <Alert variant="filled" severity="success">
          Desarrollo cognitivo: Atención | Logico-Matematico | Reorganizacion
        </Alert>
      );
    } else if (rating < 1500) {
      return (
        <Alert variant="filled" severity="success">
          Desarrollo cognitivo: Planificacion | Resolucion de problemas |
          Reorganizacion
        </Alert>
      );
    } else if (rating > 2000) {
      return (
        <Alert variant="filled" severity="success">
          Desarrollo cognitivo: Evaluacion | Comprensión | Pensamiento lateral
        </Alert>
      );
    }
  };

  const handleNewGameClick = () => {
    window.location.reload(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCorrect(false);
    setOpenIncorrect(false);

    if (value === puzzle.correct_solution) {
      sleep(1000).then(() => {
        handleNewGameClick();
      });
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <Grid container spacing={2} sx={{ mt: "5%" }}>
      <Grid xs={4}>
        <Grid container direction={"column"} spacing={2}>
          <Grid xs={2}>{setCognitiveDevelopment(profile.elo)}</Grid>
          <Grid xs={2}>
            <Alert variant="filled" severity="info">
              Tiempo transcurrido: {formatTime(minutes)}:{formatTime(seconds)}
            </Alert>
          </Grid>
          <Grid xs={2}></Grid>
          <Grid xs={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleNewGameClick}
            >
              New Game
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={8}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel id="question">{puzzle.problem_statement}</FormLabel>
              <RadioGroup onChange={handleRadioChange}>
                {answers.map((answer, index) => {
                  return (
                    <FormControlLabel
                      value={answer}
                      id={"Respuesta " + index}
                      key={index}
                      control={<Radio />}
                      label={answer}
                    />
                  );
                }, this)}
              </RadioGroup>
              <Box sx={{ paddingTop: "30px" }}>
                <Button
                  variant="contained"
                  id="submit"
                  color="success"
                  type="submit"
                  sx={{ width: "180px" }}
                >
                  Enviar
                </Button>
              </Box>
            </FormControl>
          </form>
        </Paper>
      </Grid>
      <Snackbar
        open={openCorrect}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Pregunta contestada correctamente!, Felitaciones!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openIncorrect}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Pregunta contestada incorrectamente!, Sigue intentando!
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Quiz;
