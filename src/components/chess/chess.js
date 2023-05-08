import "./chess.css";
import { Chessboard } from "react-chessboard";
import { useState, useEffect, useRef } from "react";
import Chess from "chess.js";

import PuzzleService from "../../services/puzzleservice";

function PuzzleSolver(props) {
  const [lastMove, setLastMove] = useState("");
  const [turn, setTurn] = useState(props.fen.split(" ")[1] === "w" ? "b" : "w");
  const [game, setGame] = useState(new Chess(props.fen));
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [tries, setTries] = useState(0);
  const orientation = props.fen.split(" ")[1] === "w" ? "black" : "white";

  function increaseTries() {
    setTries(tries + 1);
  }

  const handleChildStateChange = (game) => {
    setGame(game);
  };

  const handleNewGameClick = () => {
    setGame(new Chess(props.fen));
    setLastMove("");
  };

  return (
    <div className="chessboard-container">
      <p>{lastMove}</p>
      {game.in_checkmate() ? (
        <div class="checkmate">
          <span>Checkmate!</span>
        </div>
      ) : null}
      <div className="new-game-button-container">
        <button className="new-game-button" onClick={handleNewGameClick}>
          New Game
        </button>
      </div>
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
      <p>
        {tries} {puzzleSolved.toString()}
      </p>
    </div>
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

  let inputElement = useRef();

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
    console.log("after initial moves", movesArray);
  }, []);

  function makeAMove(move, isInitialMove = false) {
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
      console.log("incorrect move");
      console.log(move.from);
      console.log(movesArray[0].substring(0, 2));
      console.log(move.to);
      console.log(movesArray[0].substring(2, 4));
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
    console.log(movesArray);

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

function ResultsContainer() {}

function App() {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [moves, setMoves] = useState(null);

  const requestPuzzle = async () => {
    const response = await PuzzleService.getPuzzle();
    console.log(response)

    setGame(response.fen);
    setMoves(response.moves);
    setLoading(false);
  };

  useEffect(() => {
    requestPuzzle();
  }, []);

  return (
    <div class="chessboard-div">
      {loading ? (
        <div class="loading">
          <span>Loading...</span>
        </div>
      ) : (
        <PuzzleSolver fen={game} moves={moves} />
      )}
    </div>
  );
}
export default App;
