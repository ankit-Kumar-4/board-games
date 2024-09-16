import { useState, useEffect } from "react"
import Dropdown from "@/components/Dropdown";
import Head from "next/head";
import ProtectedRoute from '@/components/ProtectedRoute';
import { joinGame, createGame, makeMove, restartGame } from '@/lib/dots-n-boxes';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { generateRandomString } from "@/utils/common-functions";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleOverlayClick}>
            <div className="bg-white p-6 rounded shadow-lg">
                {children}
            </div>
        </div>
    );
};

const Dot = () => {
    return (
        <div
            className="bg-black w-2 h-2 rounded-full"
        />
    )
}

const Dash = ({ index, value, dashClick }: {
    index: number, value: number,
    dashClick: (index: number, value: number) => any
}) => {
    return (
        <div
            className={`h-2 w-12  ${value === null ? 'bg-gray-300' : (value === 0 ? 'bg-blue-500' : 'bg-red-600')}`}
            onClick={() => dashClick(index, value)}
        ></div>
    )
}

const Stroke = ({ index, value, strokeClick }: {
    index: number, value: number,
    strokeClick: (index: number, value: number) => any
}) => {
    return (
        <div
            className={`w-2 h-12  ${value === null ? 'bg-gray-300' : (value === 0 ? 'bg-blue-500' : 'bg-red-600')}`}
            onClick={() => strokeClick(index, value)}
        ></div>
    )
}

const Box = ({ value }: {
    value: number
}) => {
    return (
        <div
            className={`border border-transparent ${value === null ? '' : (value === 0 ? 'bg-blue-400' : 'bg-red-500')}`}
        />
    )
}

function getBoxNeighbours(row: number, column: number, index: number) {
    if (index < 0) return [index, -1, -1, -1, -1];

    const dashCount = (row + 1) * column;
    const strokeCount = row * (column + 1);

    const i = Math.floor(index / column);
    const j = index % column;

    const d1 = (i * column) + j;
    const d2 = i === row ? -1 : ((i + 1) * column) + j;

    const s1 = (i * (column + 1)) + j;
    const s2 = j === column ? -1 : (i * (column + 1)) + j + 1;

    return [index, d1, d2, s1, s2];
}

function getDashBoxIndex(row: number, column: number, index: number) {
    const i = Math.floor(index / column);
    const j = index % column;

    const b1 = i == 0 ? -1 : ((i - 1) * column) + j;
    const b2 = i === row ? -1 : (i * column) + j;

    const result = [];
    result.push(getBoxNeighbours(row, column, b1));
    result.push(getBoxNeighbours(row, column, b2));
    return result;
}

function getStrokeBoxIndex(row: number, column: number, index: number) {
    const i = Math.floor(index / (column + 1));
    const j = index % (column + 1);

    const b1 = j == 0 ? -1 : (i * column) + j - 1;
    const b2 = j === column ? -1 : (i * column) + j;

    const result = [];
    result.push(getBoxNeighbours(row, column, b1));
    result.push(getBoxNeighbours(row, column, b2));
    return result;
}

function getWinner(boxes: number[], playerCount: number) {
    const boxCounts = Array(playerCount).fill(0);
    let remaining = 0;
    for (const cell of boxes) {
        if (cell === null) {
            remaining++;
        } else {
            boxCounts[cell]++;
        }
    }

    let max = -1;
    let winner = null;
    let winnerCount = 0;

    for (let i = 0; i < playerCount; i++) {
        if (boxCounts[i] > max) {
            max = boxCounts[i];
            winner = i;
        }
    }
    for (const w of boxCounts) {
        if (max === w) {
            winnerCount++;
        }
    }
    if (remaining > 0) {
        winner = null;
    } else if (winnerCount > 1) {
        winner = -1;
    }
    return {
        remaining, potentialWinner: winner
    }
}

const Board = ({ row, column, dashes, strokes, boxes, dashClick, strokeClick }:
    {
        row: number; column: number, dashes: number[], strokes: number[], boxes: number[],
        dashClick: (index: number, value: number) => any,
        strokeClick: (index: number, value: number) => any,
    }) => {
    const board = [];
    let d = 0;
    let s = 0;
    let b = 0;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            const key = i * column + j;
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    board.push(<Dot key={key} />);
                } else {
                    board.push(<Dash key={key} index={d} value={dashes[d]}
                        dashClick={dashClick} />);
                    d++;
                }
            } else {
                if (j % 2 == 0) {
                    board.push(<Stroke key={key} index={s} value={strokes[s]}
                        strokeClick={strokeClick} />);
                    s++;
                } else {
                    board.push(<Box key={key} value={boxes[b]} />);
                    b++;
                }
            }
        }
    }

    return (
        <div className={`grid gap-0 content-center justify-center m-3`}
            style={{
                gridTemplateColumns: `repeat(${column}, auto)`,
                gridTemplateRows: `repeat(${row}, auto)`,
            }}>
            {board}
        </div>
    );
}

export default function Game() {
    const [row, setRow] = useState(7);
    const [column, setColumn] = useState(5);
    const [dashes, setDashes] = useState(Array(40).fill(null));
    const [strokes, setStrokes] = useState(Array(42).fill(null));
    const [boxes, setBoxes] = useState(Array(35).fill(null));
    const [status, setStatus] = useState('');

    const [playerTurn, setPlayerTurn] = useState(0);
    const [winner, setWinner] = useState<number | null>(null);

    const [playOnline, setPlayOnline] = useState(false);
    const [isMultiplayer, setIsMultiplayer] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [gameData, setGameData] = useState<any>({});
    const [currentUid, setCurrentUid] = useState('');

    const options = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    useEffect(() => {
        if (isMultiplayer) {
            if (!currentUid.length && auth.currentUser?.uid) {
                setCurrentUid(auth.currentUser.uid);
            }
            const gamesRef = collection(db, "dots-n-boxes");
            const q = query(gamesRef, where("chatroomId", "==", roomId));
            const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
                let data: any = {};
                querySnapshot.forEach((doc: any) => {
                    data = doc.data();
                });
                setBoxes(data.boxes);
                setDashes(data.dashes);
                setStrokes(data.strokes);
                setRow(data.row);
                setColumn(data.column);
                if (data.currentTurn !== null) {
                    setPlayerTurn(data.currentTurn);
                }
                setGameData({ ...data, currentUid });
                updateStatus(data.currentTurn, data.winner, { ...data, currentUid });
            });


            return () => {
                unsubscribe();
            };
        }
    }, [isMultiplayer, roomId, currentUid]);

    async function handleCreateRoom() {
        const game_id = generateRandomString();
        const result = await createGame(game_id, boxes, strokes, dashes, row, column);
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

    async function handleDashClick(index: number, value: number) {
        if (isMultiplayer) {
            if (!gameData.player2) {
                alert('Waiting for second player to join the game!');
                return;
            }
            if ((currentUid === gameData.player1) !== (playerTurn === 0)) {
                alert('Wait for your turn!');
                return;
            }
        }

        if (dashes[index] !== null) return;
        const newDashes = dashes.slice();
        newDashes[index] = playerTurn;

        const newBoxes = boxes.slice();
        let updateBoxes = false;
        const result = getDashBoxIndex(row, column, index);
        for (const box of result) {
            if (box[0] !== -1) {
                const [b1, d1, d2, s1, s2] = box;
                if (newDashes[d1] !== null && newDashes[d2] !== null &&
                    strokes[s1] !== null && strokes[s2] !== null
                ) {
                    newBoxes[b1] = playerTurn;
                    updateBoxes = true;
                }
            }
        }

        setDashes(newDashes);
        let newTurn = playerTurn;
        if (!updateBoxes) {
            setPlayerTurn((playerTurn + 1) % 2);
            newTurn = (playerTurn + 1) % 2;
        } else {
            setBoxes(newBoxes);
        }

        const { remaining, potentialWinner } = getWinner(newBoxes, 2);
        if (remaining === 0) {
            setWinner(potentialWinner);
        }
        if (isMultiplayer) {
            await makeMove(roomId, newBoxes, strokes, newDashes, newTurn, potentialWinner);
        }
        if (!isMultiplayer) {
            updateStatus(newTurn, potentialWinner, gameData);
        }
    }

    async function handleStrokeClick(index: number, value: number) {

        if (isMultiplayer) {
            if (!gameData.player2) {
                alert('Waiting for second player to join the game!');
                return;
            }
            if ((currentUid === gameData.player1) !== (playerTurn === 0)) {
                alert('Wait for your turn!');
                return;
            }
        }

        if (strokes[index] !== null) return;
        const newStrokes = strokes.slice();
        newStrokes[index] = playerTurn;

        const newBoxes = boxes.slice();
        let updateBoxes = false;
        const result = getStrokeBoxIndex(row, column, index);
        for (const box of result) {
            if (box[0] !== -1) {
                const [b1, d1, d2, s1, s2] = box;
                if (dashes[d1] !== null && dashes[d2] !== null &&
                    newStrokes[s1] !== null && newStrokes[s2] !== null
                ) {
                    newBoxes[b1] = playerTurn;
                    updateBoxes = true;
                }
            }
        }

        let newTurn = playerTurn;
        setStrokes(newStrokes);
        if (!updateBoxes) {
            setPlayerTurn((playerTurn + 1) % 2);
            newTurn = (playerTurn + 1) % 2;
        } else {
            setBoxes(newBoxes);
        }

        const { remaining, potentialWinner } = getWinner(newBoxes, 2);
        if (remaining === 0) {
            setWinner(potentialWinner);
        }

        if (isMultiplayer) {
            await makeMove(roomId, newBoxes, newStrokes, dashes, newTurn, potentialWinner);
        }
        if (!isMultiplayer) {
            updateStatus(newTurn, potentialWinner, gameData);
        }
    }

    async function handleNewGame() {
        const newDashes = Array((row + 1) * column).fill(null);
        const newStrokes = Array(row * (column + 1)).fill(null);
        const newBoxes = Array(row * column).fill(null);

        setDashes(newDashes);
        setStrokes(newStrokes);
        setBoxes(newBoxes);
        setWinner(null);
        setStatus('');
        setWinner(null);
        if (isMultiplayer) {
            await restartGame(roomId, row, column);
        }
    }

    const updateStatus = (turn: number, potentialWinner: number | null, data: any) => {
        let newStatus = ''
        if (isMultiplayer) {
            let player = turn === 0 ? data.name1 : data.name2;
            let winnerName = potentialWinner === 0 ? data.name1 : data.name2;

            if (potentialWinner === null) {
                if ((currentUid === data.player1) !== (turn === 0)) {
                    newStatus = `Turn of ${player}`
                } else {
                    newStatus = 'Your Turn!'
                }
            } else {
                if (potentialWinner === -1) {
                    newStatus = 'The game is draw :('
                } else if ((currentUid === data.player1) !== (turn === 0)) {
                    newStatus = `${winnerName} wins :(`
                } else {
                    newStatus = 'You win!'
                }
            }
        } else {
            newStatus = potentialWinner === null ? `Turn of Player - ${turn + 1}` :
                (potentialWinner !== -1 ? `Player - ${potentialWinner + 1} wins :)` : 'The game is draw :(')
        }
        setStatus(newStatus);
    }

    return (
        <>
            <Head>
                <title>Dots and Boxes - Board Games by Ankit</title>
                <meta name="description" content="Play the classic Tic Tac Toe game online. Enjoy this timeless game of Xs and Os, perfect for quick fun or challenging your friends. Play Tic Tac Toe for free now!" />
                <meta name="keywords" content="tic tac toe, online tic tac toe, free tic tac toe, classic games, tic tac toe by ankit, ankit" />
                <meta name="author" content="Ankit Kumar" />
                <meta property="og:title" content="Tic Tac Toe - Classic Game" />
                <meta property="og:description" content="Play the classic Tic Tac Toe game online. Enjoy this timeless game of Xs and Os, perfect for quick fun or challenging your friends. Play Tic Tac Toe for free now!" />
                <meta property="og:image" content="https://example.com/og-tictactoe.jpg" />
                <meta property="og:url" content="https://example.com/tic-tac-toe" />
                <link rel="canonical" href="https://games-by-ankit.vercel.app/tic-tac-toe" />

            </Head>

            <ProtectedRoute>
                {(!isMultiplayer || (currentUid === gameData.player1)) ?

                    <div className="flex content-center justify-center gap-2">
                        <div className=" text-wrap pt-2">Board:</div>
                        <Dropdown options={options} value={row} setValue={async (value) => {
                            const newDashes = Array((value + 1) * column).fill(null);
                            const newStrokes = Array(value * (column + 1)).fill(null);
                            const newBoxes = Array(value * column).fill(null);

                            setRow(value);
                            setDashes(newDashes);
                            setStrokes(newStrokes);
                            setBoxes(newBoxes);
                            setWinner(null);

                            if (isMultiplayer) {
                                await restartGame(roomId, value, column);
                            }
                        }} />
                        <p className="mt-2">x</p>
                        <Dropdown options={options} value={column} setValue={async (value) => {
                            const newDashes = Array((row + 1) * value).fill(null);
                            const newStrokes = Array(row * (value + 1)).fill(null);
                            const newBoxes = Array(row * value).fill(null);

                            setColumn(value);
                            setDashes(newDashes);
                            setStrokes(newStrokes);
                            setBoxes(newBoxes);
                            setWinner(null);

                            if (isMultiplayer) {
                                await restartGame(roomId, row, value);
                            }
                        }} />
                        <button onClick={handleNewGame} className="">New Game</button>
                    </div>
                    : ''}

                <div className="flex justify-center gap-2 mt-5">
                    {isMultiplayer ? '' : <button onClick={() => setPlayOnline(!playOnline)}>Play Online</button>}
                </div>
                <div className="flex justify-around gap-2">
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
                    {isMultiplayer ? (<div>
                        {currentUid === gameData.player1 ? 'You play as Blue' : 'You play as Red'}
                    </div>) : ''}
                </div>
                <div className="flex items-center justify-center">
                    {status}
                </div>
                <div className="flex flex-col items-center justify-center h-full w-full overflow-visible ">
                    <div className="m-2"></div>
                    <Board row={2 * row + 1} column={2 * column + 1} dashes={dashes} strokes={strokes}
                        boxes={boxes} dashClick={handleDashClick} strokeClick={handleStrokeClick} />
                </div>

            </ProtectedRoute>
        </>


    )
}