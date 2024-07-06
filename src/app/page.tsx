"use client";
import { useState } from "react";

type SquareValue = 'X' | 'O' | null;

function Square({ value, onSquareClick, isGreen }: { value: SquareValue; onSquareClick: any, isGreen: boolean }) {
  return (
    <button className={`square ${isGreen ? 'square-green' : ''}`} onClick={onSquareClick} >
      {value}
    </button>
  )
}


function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean; squares: Array<SquareValue>; onPlay: (items: SquareValue[]) => void; }) {

  function handleClick(i: number) {

    debugger;
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }


  const winner = calculateWinner(squares);
  let status = '';
  if (winner) {
    status = `Winner: ${squares[winner[0]]}`;
  } else {
    status = `Next Player: ${xIsNext ? 'X' : 'O'}`;
    if (!squares.includes(null)) {
      status = 'Game is draw!';
    }
  }


  const renderSquare = (i: number, isGreen: boolean) => (
    <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isGreen={isGreen} />
  );

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const boardColumns = [];
    for (let col = 0; col < 3; col++) {
      let isGreen = false;
      if (winner?.includes(row * 3 + col)) {
        isGreen = true;
      }
      boardColumns.push(renderSquare(row * 3 + col, isGreen));
    }
    boardRows.push(
      <div key={row} className="board-row">
        {boardColumns}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>)
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  let xIsNext = currentMove % 2 == 0;

  function handlePlay(nextSquares: Array<SquareValue>) {
    const nextHistory = [...history.splice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move: number) => {
    let description = '';
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start'
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares: Array<SquareValue>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}