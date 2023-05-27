import "./chess.css";
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";

import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";

import Chess from "chess.js";
import { useAuth } from "../../../common/authHook";
import PuzzleService from "../../../services/puzzleservice";

function PuzzleSolver(props) {
  const [lastMove, setLastMove] = useState("");
  const [turn, setTurn] = useState(props.fen.split(" ")[1] === "w" ? "b" : "w");
  const [game, setGame] = useState(new Chess(props.fen));
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [tries, setTries] = useState(0);
  const [rating] = useState(props.rating);

  const orientation = props.fen.split(" ")[1] === "w" ? "black" : "white";

  const { seconds, minutes, totalSeconds, pause } = useStopwatch({
    autoStart: true,
  });

  function increaseTries() {
    setTries(tries + 1);
  }

  const handleTimeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleChildStateChange = (game) => {
    setGame(game);
  };

  const handleNewGameClick = () => {
    window.location.reload(false);
  };

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  useEffect(() => {
    if (puzzleSolved) {
      handleTimeout(3000).then(() => {
        window.location.reload(false);
      });
    }
  }, [puzzleSolved]);

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

  useEffect(() => {
    if (puzzleSolved) {
      pause();
      const result = {
        puzzleId: props.puzzleId,
        time: totalSeconds,
        tries: tries,
      };
      PuzzleService.SendChessPuzzleResult(result);
    }
  }, [puzzleSolved]);

  const myTheme = createTheme({
    palette: {
      black: {
        main: "#000000",
        light: "#000000",
        secondary: "#FFFFFF",
      },
      white: {
        main: "#FFFFFF",
        light: "#FFFFFF",
        secondary: "#000000",
      },
    },
  });

  return (
    <Grid container spacing={2} sx={{ mt: "5%" }}>
      <Grid item xs={4}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item xs={2}>
            {setCognitiveDevelopment(rating)}
          </Grid>
          <Grid item xs={2}>
            <ThemeProvider theme={myTheme}>
              {game.turn() === "b" ? (
                <Alert variant="filled" severity="success" color="black">
                  Le tocan a las negras!
                </Alert>
              ) : (
                <Alert variant="outlined" severity="info">
                  Le tocan a las blancas!
                </Alert>
              )}
            </ThemeProvider>
          </Grid>

          { puzzleSolved ? (
            <Grid item xs={2}>
              <Alert variant="outlined" severity="success">
                Puzzle Resuelto!, Intentos fallidos: {tries}
              </Alert>
            </Grid>
          ) : null}
          <Grid item xs={2}>
            <Alert variant="filled" severity="info">
              Movimiento reciente: {lastMove}
            </Alert>
          </Grid>
          <Grid item xs={2}>
            <Alert variant="filled" severity="info">
              Tiempo transcurrido: {formatTime(minutes)}:{formatTime(seconds)}
            </Alert>
          </Grid>

          {game.in_checkmate() ? (
            <Grid item xs={2}>
              <Alert variant="outlined" severity="error">
                Checkmate!
              </Alert>
            </Grid>
          ) : null}

          {game.in_draw() ? (
            <Grid item xs={2}>
              <Alert severity="success" color="info">
                Empate!
              </Alert>
            </Grid>
          ) : null}

          {game.in_stalemate() ? (
            <Grid item xs={2}>
              <Alert severity="success" color="info">
                Stalemate!
              </Alert>
            </Grid>
          ) : null}

          <Grid item xs={2}>
            <Alert variant="outlined" severity="success">
              Movimientos intentado: {tries}
            </Alert>
          </Grid>
          <Grid item xs={2}>
            <div className="new-game-button-container">
              <Button
                variant="contained"
                color="success"
                onClick={handleNewGameClick}
              >
                New Game
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={8}
        sx={{
          backgroundColor: "#000000",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          width: "600px",
          height: "600px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <CustomChessboard
            setLastMove={setLastMove}
            setTurn={setTurn}
            turn={turn}
            game={game}
            setGame={setGame}
            onChildStateChange={handleChildStateChange}
            moves={props.moves}
            orientation={orientation}
            increaseTries={increaseTries}
            setPuzzleSolved={setPuzzleSolved}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
//{ setLastMove, setTurn, turn, game, setGame, onChildStateChange, moves, orientation }
function CustomChessboard({
  setLastMove,
  setTurn,
  turn,
  game,
  setGame,
  onChildStateChange,
  moves,
  orientation,
  setPuzzleSolved,
  increaseTries,
}) {
  const [squareStyles, setSquareStyles] = useState({});
  const [sourceSquare, setSourceSquare] = useState(null);
  const [movesArray, setMovesArray] = useState(moves.split(" "));

  let chessboard = (
    <Chessboard
      position={game.fen()}
      onPieceDrop={onDrop}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
      customSquareStyles={squareStyles}
      boardOrientation={orientation}
    />
  );

  useEffect(() => {
    setTimeout(() => {
      makeAMove(
        {
          from: movesArray[0].substring(0, 2),
          to: movesArray[0].substring(2, 4),
        },
        true
      );
    }, 500);
  }, []);

  function makeAMove(move, isInitialMove = false) {
    if (movesArray.length === 0) {
      setPuzzleSolved(true);
      return;
    }

    let gameCopy = new Chess(game.fen());

    let result = gameCopy.move(move);

    setGame(gameCopy);
    onChildStateChange(gameCopy);

    if ((result != null) & !isInitialMove) {
      setLastMove(result.san);
    }

    //incorrect move in puzzle
    if (
      move.from !== movesArray[0].substring(0, 2) ||
      move.to !== movesArray[0].substring(2, 4)
    ) {
      result != null
        ? increaseTries()
        : console.log("null result, not increasing tries");
      gameCopy = new Chess(game.fen());
      result = gameCopy.undo();
      setTimeout(() => setGame(gameCopy), 500);
      return result;
    }

    let movesArrayCopy = movesArray;
    movesArrayCopy.shift();
    setMovesArray(movesArrayCopy);

    if (!isInitialMove & (movesArray.length > 0)) {
      console.log("making response for other side");
      console.log(movesArray[0]);
      gameCopy.move({
        from: movesArray[0].substring(0, 2),
        to: movesArray[0].substring(2, 4),
      });
      setGame(gameCopy);
      movesArrayCopy.shift();
      setMovesArray(movesArrayCopy);
      console.log("after making response for other side", movesArray);
    } else if (movesArray.length === 0) {
      setPuzzleSolved(true);
    }
    return result;
  }

  function onDrop(initialSquare, targetSquare) {
    const move = makeAMove({
      from: initialSquare,
      to: targetSquare,
      promotion: "q",
    });

    //State does not update without calling this, no idea why
    onSquareClick(null);
    // illegal move
    if (move === null) return false;
    return true;
  }

  function onSquareClick(square) {
    if (square == null) {
      setSourceSquare(null);
    }
    setSquareStyles({});
    if (sourceSquare == null) {
      setSourceSquare(square);
      putCircleOnNextMoveSquares(square);
    } else {
      const move = makeAMove({
        from: sourceSquare,
        to: square,
        promotion: "q",
      });
      setSourceSquare(null);
      setSquareStyles({});
    }
  }

  function putCircleOnNextMoveSquares(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });

    const squareStylesCopy = { ...squareStyles };

    moves.forEach((move) => {
      const { to } = move;

      if (squareStylesCopy[to] === undefined) {
        squareStylesCopy[to] = {
          background:
            "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)",
          borderRadius: "50%",
        };
      } else {
        squareStylesCopy[to].background =
          "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)";
        squareStylesCopy[to].borderRadius = "50%";
      }
    });

    setSquareStyles(squareStylesCopy);
  }

  function onSquareRightClick(square) {
    setSquareStyles({
      ...squareStyles,
      [square]:
        squareStyles[square]?.backgroundColor === undefined
          ? { backgroundColor: "rgba(0, 0, 255, 0.4)" }
          : undefined,
    });
  }

  return chessboard;
}

function App(props) {
  const [game] = useState(props.fen);
  const [moves] = useState(props.moves);
  const [puzzleId] = useState(props.puzzleId);
  const [rating] = useState(props.rating);

  const { auth } = useAuth();
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {auth ? (
        <div class="chessboard-div">
          <PuzzleSolver
            fen={game}
            moves={moves}
            puzzleId={puzzleId}
            rating={rating}
          />
        </div>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={redirectToLogin}
        >
          Need to be logged in to see this page
        </Backdrop>
      )}
    </>
  );
}
export default App;
