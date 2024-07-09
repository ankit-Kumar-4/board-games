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
  const [arrowParams, setArrowParams] = useState({
    tailSize: 4,
    strokeWidth: type === "snake" ? 4 : 30,
    headSize: 4,
    dashness:
      type === "snake"
        ? { strokeLen: 5, nonStrokeLen: 5, animation: 1 }
        : { strokeLen: 5, nonStrokeLen: 15, animation: 0.3 },
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setArrowParams({
          tailSize: 2,
          strokeWidth: 2,
          headSize: 2,
          dashness: { strokeLen: 5, nonStrokeLen: 0, animation: 0 },
        });
      } else {
        setArrowParams({
          tailSize: 4,
          strokeWidth: type === "snake" ? 4 : 30,
          headSize: 4,
          dashness:
            type === "snake"
              ? { strokeLen: 5, nonStrokeLen: 5, animation: 1 }
              : { strokeLen: 5, nonStrokeLen: 15, animation: 0.3 },
        });
      }
    };

    handleResize(); // Set initial values based on the current window size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [type]);

  return (
    <div className={styles.arrow}>
      <Xarrow
        color={type === "snake" ? "red" : "green"}
        curveness={type === "snake" ? 0.5 : 0}
        // startAnchor={{ position: "middle", offset: { x: 100, y: 100 } }}
        // endAnchor={{ position: "middle", offset: { x: 100, y: 100 } }}
        tailSize={arrowParams.tailSize}
        strokeWidth={arrowParams.strokeWidth}
        headSize={arrowParams.headSize}
        showTail={type === "snake"}
        tailShape={"circle"}
        showHead={type === "snake"}
        start={startId}
        end={endId}
        dashness={arrowParams.dashness}
        startAnchor={"middle"}
        endAnchor={"middle"}
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
  let color = "";
  if (snakes.some((pair) => pair.includes(step))) {
    color = styles["snake-cell"];
  } else if (ladders.some((pair) => pair.includes(step))) {
    color = styles["ladder-cell"];
  }
  return (
    <div key={step} id={`${step}`} className={styles.cell + " " + color}>
      <div className={styles["cell-content"]}>{step}</div>
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

  //   return (
  //     <div className={styles.container}>
  //       <div className={styles["image-board"]} />
  //     </div>
  //   );

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board}
        {fillArrow()}
      </div>

      {/* <div className={styles["image-board"]} /> */}
    </div>
  );
};

export default Board;
