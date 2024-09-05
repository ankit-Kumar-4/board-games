import React, { useState, useEffect } from "react";
import styles from "@/styles/snake-n-ladder.module.css";
import Xarrow from "react-xarrows";
import Dice from 'react-dice-roll';
import Head from "next/head";
import ProtectedRoute from '@/components/ProtectedRoute';
import { joinGame, createGame, makeMove, rematchGame, updateScore } from '@/lib/snake-n-ladder';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { generateRandomString } from "@/utils/common-functions";


const snakes: {
  [key: number]: number;
} = {
  99: 9,
  93: 51,
  90: 11,
  87: 37,
  77: 17,
  65: 22,
  60: 19,
  52: 27,
  46: 6,
  32: 5
};

const ladders: {
  [key: number]: number;
} = {
  7: 26,
  13: 55,
  21: 78,
  36: 64,
  44: 75,
  47: 68,
  50: 92,
  61: 96,
  66: 83,
  67: 86
};

type playerTurn = {
  player_id: number;
  dicenumber: number;
  last_position: number;
}


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
      </div>
    </div>
  );
};

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
          strokeWidth: 4,
          headSize: 5,
          dashness: { strokeLen: 4, nonStrokeLen: 1, animation: 1 },
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

function lastArrow(lastTwoTurn: playerTurn[], currentPostition: number[]) {
  return (
    <div >
      <Xarrow
        color="#0000e0"
        curveness={0}
        strokeWidth={3}
        headSize={4}
        start={lastTwoTurn[1].last_position + ''}
        end={currentPostition[lastTwoTurn[1].player_id] + ''}
        startAnchor={"middle"}
        endAnchor={"middle"}
      />
    </div>
  );
}

function fillArrow() {
  const arrows = [];
  for (const [key, value] of Object.entries(snakes)) {
    arrows.push(Arrows(`${key}`, `${value}`, "snake"));
  }
  for (const [key, value] of Object.entries(ladders)) {
    arrows.push(Arrows(`${key}`, `${value}`, "ladder"));
  }
  return arrows;
}

const homeStart = (step: number, playerPosition: number[]) => {
  const result = [];
  for (let i = 0; i < playerPosition.length; i++) {
    if (step === playerPosition[i]) {
      result.push(
        <div
          className={`${styles.circle} ${styles["player" + (i + 1)]} ${styles["circle-show"]}`}
        ></div>
      )
    } else {
      result.push(
        <div
          className={`${styles.circle} ${styles["playerq" + (i + 1)]} ${styles["circle-show"]}`}
        ></div>
      )
    }
  }
  return (
    <>
      {result}
    </>
  );
};

const Cell = ({ step, playerId }: { step: number; playerId: number[] }) => {
  let color = "";
  if (step in snakes || Object.values(snakes).includes(step)) {
    color = styles["snake-cell"];
  } else if (step in ladders || Object.values(ladders).includes(step)) {
    color = styles["ladder-cell"];
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
      if ([1, 100].includes(cellNumber)) {
        board.push((
          <div
            key={cellNumber}
            id={`${cellNumber}`}
            className={styles.cell + ' ' + styles[cellNumber === 1 ? 'start' : 'home']}>
            {homeStart(cellNumber, chaal)}
          </div>
        ));
      } else {
        board.push(<Cell step={cellNumber} playerId={chaal}></Cell>);
      }
    }
  }

  //   return (
  //     <div className="flex justify-center items-start p-2 box-border h-screen">
  //       <div className={styles["image-board"]} />
  //     </div>
  //   );

  return (
    <div className="flex justify-center items-start p-2 box-border">
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
  currentPlayer: number,
  playerCount: number
) {
  let nextPlayer = (currentPlayer + 1) % playerCount;
  const count = playerPosition.reduce((acc, e) => e === 100 ? 1 + acc : acc, 0);
  if (count > 3) {
    return nextPlayer;
  }
  while (playerPosition[nextPlayer] === 100) {
    nextPlayer = (nextPlayer + 1) % playerCount;
  }
  return nextPlayer;
}


const Table = ({ data }: { data: string[]; }) => {
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
            <td>{row}</td>
          </tr>
        ))}
      </tbody>
    </table >
  );
};

function checkPlayerCapture(playerPosition: number[], currentPostition: number) {
  for (let i = 0; i < playerPosition.length; i++) {
    if (playerPosition[i] === currentPostition && ![100, 1].includes(currentPostition)) {
      return i;
    }
  }
  return -1;
}


export default function Game() {
  const [playerPosition, setPlayerPosition] = useState<number[]>(Array(4).fill(1));
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  const [status, setStatus] = useState("");
  const [ranking, setRanking] = useState<string[]>([]);
  const [lastTwoTurn, setLastTwoTurn] = useState<playerTurn[]>([
    { player_id: 0, dicenumber: 0, last_position: 1 },
    { player_id: 0, dicenumber: 0, last_position: 1 }
  ]);
  const [playerCount, setPlayerCount] = useState(4);
  const [expanded, setExpanded] = useState(false);

  const [playOnline, setPlayOnline] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [gameData, setGameData] = useState<any>({});
  const [currentUid, setCurrentUid] = useState('');

  useEffect(() => {
    if (isMultiplayer) {
      if (!currentUid.length && auth.currentUser?.uid) {
        setCurrentUid(auth.currentUser.uid);
      }
      const gamesRef = collection(db, "snl");
      const q = query(gamesRef, where("chatroomId", "==", roomId));
      const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
        let data: any = {};
        querySnapshot.forEach((doc: any) => {
          data = doc.data();
        });
        setGameData({ ...data, currentUid });
        setPlayerPosition(data.playerPosition);
        setPlayerTurn(data.playerTurn);
        setStatus(data.status);
        setRanking(data.ranking);
        setLastTwoTurn(data.lastTwoTurn);
        setPlayerCount(data.playerCount);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isMultiplayer, roomId, currentUid]);

  async function restartGame() {
    setPlayerPosition(Array(playerCount).fill(1))
    setPlayerTurn(0)
    setStatus("")
    setRanking([])
    setLastTwoTurn([
      { player_id: 0, dicenumber: 0, last_position: 1 },
      { player_id: 0, dicenumber: 0, last_position: 1 }
    ])
    if (isMultiplayer) {
      await rematchGame(roomId);
    }
  }

  const handleButtonClick = (level: number) => {
    if (expanded) {
      setPlayerCount(level);
      restartGame();
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  function getPlayerName(gameData: any, playerTurn: number) {
    if (playerTurn === 0) {
      return gameData.player1 || {};
    }
    if (playerTurn === 1) {
      return gameData.player2 || {};
    }
    if (playerTurn === 2) {
      return gameData.player3 || {};
    }
    if (playerTurn === 3) {
      return gameData.player4 || {};
    }
    return {}
  }

  async function rollDice(diceNumber: number) {
    const count = playerPosition.reduce((acc, e) => e === 100 ? 1 + acc : acc, 0);
    if (count >= 3) {
      return;
    }
    if (isMultiplayer) {
      if (!gameData.player2.id) {
        alert('Waiting for second player to join');
        return;
      } else if (!gameData.player3.id && gameData.playerCount > 2) {
        alert('Waiting for third player to join');
        return;
      } else if (!gameData.player4.id && gameData.playerCount > 3) {
        alert('Waiting for fourth player to join');
        return;
      }
    }

    const newLastTwoTurn = [lastTwoTurn[1], { player_id: playerTurn, dicenumber: diceNumber, last_position: playerPosition[playerTurn] }];
    setLastTwoTurn(newLastTwoTurn);
    let nextPlayer = getNextPlayerTurn(playerPosition, playerTurn, playerCount);

    const nextPlayerPositions = playerPosition.slice();
    nextPlayerPositions[playerTurn] += diceNumber;

    let newStatus = '';

    if (lastTwoTurn[0].player_id === lastTwoTurn[1].player_id && lastTwoTurn[0].dicenumber && lastTwoTurn[1].dicenumber &&
      lastTwoTurn[0].player_id === playerTurn && diceNumber === lastTwoTurn[0].dicenumber
    ) {
      if (isMultiplayer) {
        newStatus = `${getPlayerName(gameData, playerTurn).name} void move, 3 consecutive 6.`;
      } else {
        newStatus = `Player-${playerTurn + 1} void move, 3 consecutive 6.`;
      }
      setStatus(newStatus);
      setPlayerTurn(nextPlayer);
      if (isMultiplayer) {
        await makeMove(roomId, newStatus, nextPlayer, newLastTwoTurn, [], []);
      }
      return;
    }
    if (playerPosition[playerTurn] === 1 && ![1, 6].includes(diceNumber)) {
      if (isMultiplayer) {
        newStatus = `${getPlayerName(gameData, playerTurn).name} needs to roll 1 or 6 to start.`;
      } else {
        newStatus = `Player-${playerTurn + 1} needs to roll 1 or 6 to start.`;
      }
      setStatus(newStatus);
      setPlayerTurn(nextPlayer);
      if (isMultiplayer) {
        await makeMove(roomId, newStatus, nextPlayer, newLastTwoTurn, [], []);
      }
      return;
    }
    if (playerPosition[playerTurn] + diceNumber > 100) {
      if (isMultiplayer) {
        newStatus = `${getPlayerName(gameData, playerTurn).name} couldn't move, needs to roll ${100 - playerPosition[playerTurn]} or lower`;
      } else {
        newStatus = `Player-${playerTurn + 1} couldn't move, needs to roll ${100 - playerPosition[playerTurn]} or lower`;
      }
      setStatus(newStatus);
      setPlayerTurn(nextPlayer);
      if (isMultiplayer) {
        await makeMove(roomId, newStatus, nextPlayer, newLastTwoTurn, [], []);
      }
      return;
    }

    let newRanking: any = [];
    if (playerPosition[playerTurn] + diceNumber === 100) {
      if (isMultiplayer) {
        newStatus = `Last Move: ${getPlayerName(gameData, playerTurn).name} took ${diceNumber} steps and reached Home!`;
      } else {
        newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps and reached Home!`;
      }
      setRanking([...ranking, 'Player-' + (playerTurn + 1)]);
      newRanking = [...ranking, getPlayerName(gameData, playerTurn).name];
    } else if (playerPosition[playerTurn] + diceNumber in ladders) {
      if (diceNumber === 6) {
        nextPlayer = playerTurn;
      }
      if (isMultiplayer) {
        newStatus = `Last Move: ${getPlayerName(gameData, playerTurn).name} took ${diceNumber} steps and climbs ladder!`;
      } else {
        newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps and climbs ladder!`;
      }
      nextPlayerPositions[playerTurn] = ladders[playerPosition[playerTurn] + diceNumber];
    } else if (playerPosition[playerTurn] + diceNumber in snakes) {
      if (diceNumber === 6) {
        nextPlayer = playerTurn;
      }
      if (isMultiplayer) {
        newStatus = `Last Move: ${getPlayerName(gameData, playerTurn).name} took ${diceNumber} steps and got bit by snake!`;
      } else {
        newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps and got bit by snake!`;
      }
      nextPlayerPositions[playerTurn] = snakes[playerPosition[playerTurn] + diceNumber];
    } else {
      if (diceNumber === 6) {
        nextPlayer = playerTurn;
      }
      if (isMultiplayer) {
        newStatus = `Last Move: ${getPlayerName(gameData, playerTurn).name} took ${diceNumber} steps`;
      } else {
        newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps`;
      }
    }


    const capturedPlayer = checkPlayerCapture(playerPosition, nextPlayerPositions[playerTurn]);
    if (capturedPlayer >= 0) {
      newStatus += ` and captured Player-${capturedPlayer + 1}`;
      nextPlayerPositions[capturedPlayer] = 1;
      nextPlayer = playerTurn;
    }
    setStatus(newStatus);
    setPlayerPosition(nextPlayerPositions);
    setPlayerTurn(nextPlayer);
    if (isMultiplayer) {
      await makeMove(roomId, newStatus, nextPlayer, newLastTwoTurn, nextPlayerPositions, newRanking);
    }

  }

  async function handleCreateRoom() {
    const game_id = generateRandomString();
    const result = await createGame(game_id, playerCount);
    if (!result) {
      alert('Failed to create room');
      return;
    }
    setRoomId(game_id);
    setPlayOnline(false);
    setIsMultiplayer(true);
    alert('Please share the Game ID to a friend: ' + game_id)
  }

  async function handleJoinRoom() {
    const result = await joinGame(roomId);
    if (!result) {
      alert('Please enter valid Game Id');
      return;
    }
    setPlayOnline(false);
    setIsMultiplayer(true);
  }

  function checkCurrentTurn() {
    if (!isMultiplayer) return true;
    if (gameData.player1?.id === gameData.currentUid && playerTurn === 0) {
      return true;
    }
    if (gameData.player2?.id === gameData.currentUid && playerTurn === 1) {
      return true;
    }
    if (gameData.player3?.id === gameData.currentUid && playerTurn === 2) {
      return true;
    }
    if (gameData.player4?.id === gameData.currentUid && playerTurn === 3) {
      return true;
    }
    return false;
  }

  return (
    <>
      <Head>
        <title>Snake and Ladders - Board Games by Ankit</title>
        <meta name="description" content="Play the classic Snake and Ladders game online. Roll the dice, climb the ladders, and avoid the snakes in this fun and challenging board game. Enjoy Snake and Ladders for free now!" />
        <meta name="keywords" content="snake and ladders, online snake and ladders, free snake and ladders, board games, snake and ladders by ankit, ankit" />
        <meta name="author" content="Ankit Kumar" />
        <meta property="og:title" content="Snake and Ladders - Classic Board Game Online" />
        <meta property="og:description" content="Play the classic Snake and Ladders game online. Roll the dice, climb the ladders, and avoid the snakes in this fun and challenging board game. Enjoy Snake and Ladders for free now!" />
        <meta property="og:image" content="https://example.com/og-snake-ladders.jpg" />
        <meta property="og:url" content="https://example.com/snake-ladders" />
        <link rel="canonical" href="https://games-by-ankit.vercel.app/snake-n-ladder" />
      </Head>

      <ProtectedRoute>

        <div className="flex justify-center">
          <label className="text-gray-700 font-semibold content-center justify-center">Number of Players:</label>
          {!expanded ? (
            // Single button view
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded"
              onClick={() => setExpanded(true)}
            >
              {playerCount !== null ? playerCount : "Number of Players: "}
            </button>
          ) : (
            // Expanded button view with animation
            <div className="flex space-x-2">
              {[2, 3, 4].map((level) => (
                <button
                  key={level}
                  className={`w-full py-2  ${playerCount === level ? "bg-green-400" : "bg-gray-300"
                    } text-white rounded`}
                  onClick={() => handleButtonClick(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
          {!isMultiplayer || gameData.player1?.id === currentUid ? <button onClick={restartGame} className="ml-5">
            New Game
          </button> : ''}

        </div>
        <div>
          {isMultiplayer ? '' : <button onClick={() => setPlayOnline(!playOnline)}>Play Online</button>}
          {isMultiplayer && roomId ? <div>Game Id: {roomId}</div> : ''}
          {playOnline ?
            <Modal isOpen={playOnline} onClose={() => { setPlayOnline(false) }}>
              <div className="flex-col justify-around mb-4">
                <button
                  className={`w-full py-2 " : ""
                                        }`}
                  onClick={() => handleCreateRoom()}
                >
                  Create Game
                </button>
                <div className='text-center m-5'>OR</div>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => {
                    const newValue = e.target.value.toUpperCase();
                    if (/^[A-Z0-9]*$/.test(newValue) && newValue.length <= 5) {
                      setRoomId(newValue);
                    }
                  }}
                  className="flex-grow p-2 w-full border rounded"
                  pattern="[A-Z0-9]{5}"
                />
                <button
                  className={`w-full py-2 `}
                  onClick={() => handleJoinRoom()}
                >
                  Join Game with ID
                </button>
              </div>
            </Modal>
            : ''
          }
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-grow w-full">
            <Board
              chaal={playerPosition}
            ></Board>
          </div>
          <div className="flex-auto md:w-1/2 p-4 content-center">
            <div className={styles["game-row1"]}>
              {status.length > 0 ? <div className={`${styles["player" + (lastTwoTurn[1].player_id + 1)]} ${styles['player-turn']}`}>
                {status}
              </div> : ''}
            </div>
            <div className={styles["game-row1"]}>
              <div className={`${styles["player" + (playerTurn + 1)]} ${styles['player-turn']}`}>
                {!isMultiplayer ? `Turn of Player-${playerTurn + 1}` : `Turn of ${getPlayerName(gameData, playerTurn).name}`}
              </div>
              {checkCurrentTurn() ?
                <Dice onRoll={(value) => rollDice(value)} size={33}
                  faces={['/dice1.png', '/dice2.png', '/dice3.png', '/dice4.png', '/dice5.png', '/dice6.png']}
                /> :
                ''
              }
            </div>
            {lastArrow(lastTwoTurn, playerPosition)}
            {
              ranking.length > 0
                ? (<div className={styles["game-row"]}>
                  <Table data={ranking} />
                </div>)
                : ''
            }
          </div>
        </div>
      </ProtectedRoute>

    </>
  );
}
