import "./chess.css";
import { Chessboard } from "react-chessboard";
import { useState } from "react";
import Chess from "chess.js";

function PuzzleSolver(props) {
  const [lastMove, setLastMove] = useState("");
  const [turn, setTurn] = useState("w");
  const [game, setGame] = useState(new Chess("r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24"));

  const handleChildStateChange = (game) => {
    setGame(game);
  };

  const handleNewGameClick = () => {
    setGame(new Chess("r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24"));
    setTurn("w");
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
      <div className={`turn-indicator ${turn === "w" ? "white" : "black"}`}>
        {turn === "w" ? "White plays" : "Black plays"}
      </div>
      <div className="new-game-button-container">
        <button className="new-game-button" onClick={handleNewGameClick}>
          New Game
        </button>
      </div>
      <CustomChessboard
        setLastMove={setLastMove}
        setTurn={setTurn}
        turn={turn}
        game = {game}
        setGame = {setGame}
        onChildStateChange={handleChildStateChange}
      />
    </div>
  );
}

function CustomChessboard({ setLastMove, setTurn, turn, game, setGame, onChildStateChange }) {
  const [squareStyles, setSquareStyles] = useState({});
  const [sourceSquare, setSourceSquare] = useState(null);

  function makeAMove(move) {
    const gameCopy = new Chess(game.fen());
    
    const result = gameCopy.move(move);
    setGame(gameCopy);
    onChildStateChange(gameCopy);
    if (result != null) {
      setLastMove(result.san);
      setTurn(turn === "w" ? "b" : "w");
    }
    return result;
  }

  function onDrop(initialSquare, targetSquare) {
    const move = makeAMove({
      from: initialSquare,
      to: targetSquare,
      promotion: "q",
    });

    // illegal move
    if (move === null) return false;
    return true;
  }

  function onSquareClick(square) {
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

  return (
    <Chessboard
      position={game.fen()}
      onPieceDrop={onDrop}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
      customSquareStyles={squareStyles}
    />
  );
}

function App() {
  return (
    <div class="chessboard-div">
      <PuzzleSolver />
    </div>
  );
}
export default App;
