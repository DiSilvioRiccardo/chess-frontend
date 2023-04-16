import './App.css';
import { Chessboard } from "react-chessboard";
import { useState } from "react";
import Chess from 'chess.js'


function PuzzleSolver(){
  const [lastMove, setLastMove] = useState("");
  return (
    <div>
      <p>{lastMove}</p>
      <CustomChessboard setLastMove={setLastMove}/>
    </div>
  );
}


function CustomChessboard({setLastMove}){
  const [game, setGame] = useState(new Chess());
  const [squareStyles, setSquareStyles] = useState({});
  //const [nextMoveSquares, setNextMoveSquares] = useState({});
  const [sourceSquare, setSourceSquare] = useState(null);

  function makeAMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    if (result != null){
      setLastMove(result.san);
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

  function onSquareClick(square){
      setSquareStyles({});
      if (sourceSquare == null){
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

  function putCircleOnNextMoveSquares(square){
    const moves = game.moves({
      square,
      verbose: true,
    });
    let squareStylesCopy = {...squareStyles};
    moves.forEach(move => {
      if (squareStylesCopy[move.to] === undefined) {
        squareStylesCopy[move.to] = {background: "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)", borderRadius: "50%"}
      }else{
        squareStylesCopy[move.to].background = "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)";
        squareStylesCopy[move.to].borderRadius = "50%";
      }
    })
    setSquareStyles(squareStylesCopy);

  }

  function onSquareRightClick(square){
    setSquareStyles({
      ...squareStyles,
        [square]: squareStyles[square]?.backgroundColor === undefined ? {backgroundColor: "rgba(0, 0, 255, 0.4)"} : undefined
      }
    );
}
  

  return <Chessboard 
      position={game.fen()} 
      onPieceDrop={onDrop} 
      onSquareClick={onSquareClick} 
      onSquareRightClick={onSquareRightClick}
      customSquareStyles={squareStyles}/>;
}

function App() {
  return (
    <div class="chessboard-div">
      <PuzzleSolver/>
    </div>
  );
}
export default App;
