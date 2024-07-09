import React, { useState, useEffect } from "react";
import styles from "@/styles/snake-n-ladder.module.css";
import Xarrow from "react-xarrows";

const snakes = [
  [99, 9],
  [93, 51],
  [90, 11],
  [87, 37],
  [77, 17],
  [65, 22],
  [60, 19],
  [52, 27],
  [46, 6],
];
const ladders = [
  [7, 26],
  [13, 55],
  [21, 78],
  [36, 64],
  [44, 75],
  [47, 68],
  [50, 92],
  [61, 96],
  [66, 83],
  [67, 86],
];

function Arrows(startId: string, endId: string, type: "snake" | "ladder") {
  return (
    <div className={styles["green-arrow"]}>
      <Xarrow
        color={type === "snake" ? "red" : "green"}
        curveness={type === "snake" ? 0.3 : 0}
        tailSize={4}
        showTail={type === "snake"}
        tailShape={"circle"}
        showHead={type === "snake"}
        headSize={4}
        start={startId}
        end={endId}
        dashness={{ strokeLen: 5, nonStrokeLen: 15, animation: 0.1 }}
        strokeWidth={type === "snake" ? 4 : 20}
      />
    </div>
  );
}

function fillArrow() {
  const arrows = [];
  for (const sn of snakes) {
    arrows.push(Arrows(`${sn[0]}`, `${sn[1]}`, "snake"));
  }
  for (const la of ladders) {
    arrows.push(Arrows(`${la[0]}`, `${la[1]}`, "ladder"));
  }
  return arrows;
}

const Cell = ({ step }: { step: number }) => {
  return (
    <div key={step} id={`${step}`} className={styles.cell}>
      {step}
    </div>
  );
};

function getCellNumber(i: number, j: number) {
  if (i % 2 === 0) {
    j = 9 - j;
  }
  return i * 10 + j;
}

const Board = () => {
  const board = [];
  for (let i = 9; i >= 0; i--) {
    for (let j = 9; j >= 0; j--) {
      board.push(<Cell step={getCellNumber(i, j) + 1}></Cell>);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.board}>{board}</div>
      {fillArrow()}
    </div>
  );
};

export default Board;
