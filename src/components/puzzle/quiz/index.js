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
          <Grid xs={2}>
            {setCognitiveDevelopment(profile.elo)}
          </Grid>
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
