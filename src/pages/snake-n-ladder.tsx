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
        color={type === "snake" ? "darkred" : "darkgreen"}
        curveness={type === "snake" ? 0.5 : 0}
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

const homeStart = (playerId: number) => {
  return (
    <>
      <div
        className={`${styles.circle} ${styles["player1"]} ${styles["circle-show"]}`}
      ></div>
      <div
        className={`${styles.circle} ${styles["player2"]}  ${styles["circle-show"]}`}
      ></div>
      <div
        className={`${styles.circle} ${styles["player3"]} ${styles["circle-show"]}`}
      ></div>
      <div
        className={`${styles.circle} ${styles["player4"]} ${styles["circle-show"]}`}
      ></div>
    </>
  );
};

const Cell = ({ step, playerId }: { step: number; playerId: number[] }) => {
  let color = "";
  if (snakes.some((pair) => pair.includes(step))) {
    color = styles["snake-cell"];
  } else if (ladders.some((pair) => pair.includes(step))) {
    color = styles["ladder-cell"];
  }

  let show = <></>;
  if (playerId[0] === step) {
    show = <div className={styles["circle.player1"]}></div>;
  }
  if (playerId[1] === step) {
    show = <div className={styles["circle.player2"]}></div>;
  }
  if (playerId[2] === step) {
    show = <div className={styles["circle.player3"]}></div>;
  }
  if (playerId[3] === step) {
    show = <div className={styles["circle.player4"]}></div>;
  }

  return (
    <div key={step} id={`${step}`} className={styles.cell + " " + color}>
      <div
        className={`${styles["cell-content"]} 
      ${playerId[0] === step ? styles.player1 : ""}
      ${playerId[1] === step ? styles.player2 : ""}
      ${playerId[2] === step ? styles.player3 : ""}
      ${playerId[3] === step ? styles.player4 : ""}
      `}
      >
        {step}
      </div>
    </div>
  );
};

function getCellNumber(i: number, j: number) {
  if (i % 2 === 0) {
    j = 9 - j;
  }
  return i * 10 + j;
}

function Board({
  chaal,
}: Readonly<{
  chaal: Array<number>;
}>) {
  const board = [];
  for (let i = 9; i >= 0; i--) {
    for (let j = 9; j >= 0; j--) {
      const cellNumber = getCellNumber(i, j) + 1;
      board.push(<Cell step={cellNumber} playerId={chaal}></Cell>);
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
}

function getNextPlayerTurn(
  playerPosition: Array<number>,
  currentPlayer: number
) {
  let nextPlayer = (currentPlayer + 1) % 4;
  const count = playerPosition.reduce((acc, e) => e === 100 ? 1 + acc : acc, 0);
  if (count > 3) {
    return nextPlayer;
  }
  while (playerPosition[nextPlayer] === 100) {
    nextPlayer = (nextPlayer + 1) % 4;
  }
  return nextPlayer;
}


const Table = ({ data }: { data: number[]; }) => {
  return (
    <table className={`${styles.table} ${styles['game-info']}`}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{'Player-' + (index + 1)}</td>
          </tr>
        ))}
      </tbody>
    </table >
  );
};

export default function Game() {
  const [playerPosition, setPlayerPosition] = useState(Array(4).fill(0));
  const [diceNumber, setDiceNumber] = useState<number>(0);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [status, setStatus] = useState("");
  const [ranking, setRanking] = useState<number[]>([]);

  function rollDice() {
    const count = playerPosition.reduce((acc, e) => e === 100 ? 1 + acc : acc, 0);
    if (count >= 3) {
      return;
    }
    const diceNumber = Math.ceil(Math.random() * 6);
    const nextPlayer = getNextPlayerTurn(playerPosition, playerTurn);
    setDiceNumber(diceNumber);
    setPlayerTurn(nextPlayer);
    if (playerPosition[playerTurn] + diceNumber > 100) {
      setStatus(
        `Cannot move. Please roll ${100 - playerPosition[playerTurn]} or lower`
      );
      return;
    } else if (playerPosition[playerTurn] + diceNumber === 100) {
      setStatus(
        `Player-${playerTurn + 1} takes ${diceNumber} steps and reached Home!`
      );
      setRanking([...ranking, playerTurn + 1]);
    } else {
      setStatus(`Player-${playerTurn + 1} takes ${diceNumber} steps`);
    }
    const nextPlayerPositions = playerPosition.slice();
    nextPlayerPositions[playerTurn] += diceNumber;
    setPlayerPosition(nextPlayerPositions);
  }

  return (
    <>
      <Board
        chaal={playerPosition}
      ></Board>
      <div className={styles["game-row1"]}>
        <button onClick={rollDice}>Roll dice!</button>
        <button>{diceNumber}</button>
        <div className={`${styles["player" + (playerTurn + 1)]}`}>
          {`Turn of Player-${playerTurn + 1}`}
        </div>
      </div>
      <div className={styles["game-row1"]}>
        {status}
      </div>
      {
        ranking.length > 0
          ? (<div className={styles["game-row"]}>
            <Table data={ranking} />
          </div>)
          : ''
      }
    </>
  );
}
