"use client";
import { useState } from "react";

function Square() {
  let [squareValue, updateSquareValue] = useState("");

  function handleClick() {
    updateSquareValue("X")
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {squareValue}
    </button>
  )
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>)
}
