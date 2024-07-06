"use client";
import { useState } from "react";
import "@/app/page.module.css"

type SquareValue = 'X' | 'O' | null;
type TableRow = {
  playerX: number;
  playerO: number;
};


const Table = ({ data }: { data: TableRow[]; }) => {
  const sumColumn1 = data.reduce((acc, row) => acc + row.playerX, 0);
  const sumColumn2 = data.reduce((acc, row) => acc + row.playerO, 0);
  return (
    <table className="table game-info">
      <thead>
        <tr>
          <th>Player X</th>
          <th>Player O</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.playerX}</td>
            <td>{row.playerO}</td>
          </tr>
        ))}
        <tr className="sum-row square-green">
          <td>{sumColumn1}</td>
          <td>{sumColumn2}</td>
        </tr>
      </tbody>
    </table>
  );
};


function Square({ value, onSquareClick, isGreen }: { value: SquareValue; onSquareClick: any, isGreen: boolean }) {
  return (
    <button className={`square ${isGreen ? 'square-green' : ''}`} onClick={onSquareClick} >
      {value}
    </button>
  )
}


function Board({ xIsNext, squares, onPlay, handleScore }:
  {
    xIsNext: boolean;
    squares: Array<SquareValue>;
    onPlay: (items: SquareValue[]) => void;
    handleScore: (items: TableRow) => void;
  }) {

  const winner = calculateWinner(squares);
  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    const potentialWinner = calculateWinner(nextSquares);
    if (potentialWinner) {
      handleScore({
        playerX: nextSquares[potentialWinner[0]] === 'X' ? 1 : 0,
        playerO: nextSquares[potentialWinner[0]] === 'O' ? 1 : 0
      });
    } else if (!nextSquares.includes(null)) {
      handleScore({ playerX: 0, playerO: 0 });
    }
    onPlay(nextSquares);
  }


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
  const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handlePlay(nextSquares: Array<SquareValue>) {
    setCurrentSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function jumpTo() {
    setCurrentSquares(Array(9).fill(null));
  }

  const moves = (
    <button onClick={() => jumpTo()}>New Game!</button>
  );

  const [score, setScore] = useState<TableRow[]>([]);
  function handleScore(currentScore: TableRow) {
    setScore([...score, currentScore]);
  }


  return (
    <div className="game">
      <div className="game-row">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} handleScore={handleScore} />
        </div>
        <div className="game-info">
          {moves}
        </div>
      </div>
      <div className="game-row">
        <Table data={score} />
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