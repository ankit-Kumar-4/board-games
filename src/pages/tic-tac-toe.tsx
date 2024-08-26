"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/tic-tac-toe.module.css";
import Head from "next/head";
import ProtectedRoute from '@/components/ProtectedRoute';
import { joinGame, createGame, makeMove, rematchGame, updateScore } from '@/lib/tic-tac-toe';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";


type SquareValue = 'X' | 'O' | null;
type TableRow = {
    playerX: number;
    playerO: number;
};

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

function generateRandomString(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}


const Table = ({ data, gameData }: { data: TableRow[]; gameData: any }) => {
    const sumColumn1 = data.reduce((acc, row) => acc + row.playerX, 0);
    const sumColumn2 = data.reduce((acc, row) => acc + row.playerO, 0);

    let nameX = 'Player X';
    let nameO = 'Player O';
    if (gameData.playerX) {
        nameX = gameData.nameX || gameData.playerX;
        nameO = gameData.nameO || gameData.playerO;
    }
    return (
        <table className={`${styles.table} ${styles['game-info']}`}>
            <thead>
                <tr>
                    <th>{nameX}</th>
                    <th>{nameO}</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.playerX}</td>
                        <td>{row.playerO}</td>
                    </tr>
                ))}
                <tr className={`${styles['sum-row']}`}>
                    <td >{sumColumn1}</td>
                    <td >{sumColumn2}</td>
                </tr>
            </tbody>
        </table >
    );
};


function Square({ value, onSquareClick, isGreen }: { value: SquareValue; onSquareClick: any, isGreen: boolean }) {
    return (
        <button className={`${styles.square} ${isGreen ? styles['square-green'] : ''}`} onClick={onSquareClick} >
            {value}
        </button>
    )
}


function Board({ xIsNext, squares, onPlay, handleScore, data }:
    {
        xIsNext: boolean;
        squares: Array<SquareValue>;
        onPlay: (items: SquareValue[]) => void;
        handleScore: (items: TableRow) => void;
        data: any;
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
        if (data.playerX) {
            if ((data.currentUid === data.playerX) === (squares[winner[0]] === 'X')) {
                status = `You Won :)`
            } else {
                status = 'You lost :('
            }
        }
    } else {
        status = `Next Player: ${xIsNext ? 'X' : 'O'}`;
        if (data.playerX) {
            const nameX = data.nameX || data.playerX;
            const nameO = data.nameO || data.playerO;
            status = `Next Player: ${xIsNext ? nameX + ' - X' : nameO + ' - O'}`;
        }
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
            <div key={row} className={styles['board-row']}>
                {boardColumns}
            </div>
        );
    }

    return (
        <>
            <div className={styles.status}>{status}</div>
            {boardRows}
        </>)
}

export default function Game() {
    const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [score, setScore] = useState<TableRow[]>([]);

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
            const gamesRef = collection(db, "games");
            const q = query(gamesRef, where("chatroomId", "==", roomId));
            const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
                let data = {
                    board: [],
                    currentTurn: null,
                    score: []
                };
                querySnapshot.forEach((doc: any) => {
                    data = doc.data();
                });
                setCurrentSquares(data.board);
                if (data.currentTurn !== null) {
                    setXIsNext(data.currentTurn);
                }
                setGameData({ ...data, currentUid });
                setScore(data.score);
            });

            return () => {
                unsubscribe();
            };
        }
    }, [isMultiplayer, roomId, currentUid]);

    async function handlePlay(nextSquares: Array<SquareValue>) {
        if (isMultiplayer) {
            if ((currentUid === gameData.playerX) !== xIsNext) {
                alert('Wait for your turn!');
                return;
            }
            if (!gameData.playerO) {
                alert('Waiting for second player to join the game!');
                return;
            }
        }
        setCurrentSquares(nextSquares);
        setXIsNext(!xIsNext);

        if (isMultiplayer) {
            await makeMove(roomId, nextSquares, !xIsNext);
        }
    }

    async function handleCreateRoom() {
        const game_id = generateRandomString();
        await createGame(game_id);
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

    async function jumpTo() {
        if (isMultiplayer) {
            const player = currentUid === gameData.playerX ? 'X' : 'O';
            if (player === 'X') {
                if (gameData.rematchO) {
                    setCurrentSquares(Array(9).fill(null));
                    await makeMove(roomId, Array(9).fill(null), xIsNext);
                    await rematchGame(roomId, '=');
                } else {
                    await rematchGame(roomId, player);
                }
            } else {
                if (gameData.rematchX) {
                    setCurrentSquares(Array(9).fill(null));
                    await makeMove(roomId, Array(9).fill(null), xIsNext);
                    await rematchGame(roomId, '=');
                } else {
                    await rematchGame(roomId, player);
                }
            }
        } else {
            setCurrentSquares(Array(9).fill(null));
        }
    }

    const NewGame = (
        <button onClick={() => jumpTo()}>Rematch</button>
    );

    async function handleScore(currentScore: TableRow) {
        if (isMultiplayer) {
            await updateScore(roomId, [...score, currentScore]);
        }
        setScore([...score, currentScore]);
    }


    return (
        <>
            <Head>
                <title>Tic Tac Toe - Board Games by Ankit</title>
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
                    {isMultiplayer ? (<div>
                        {currentUid === gameData.playerX ? 'You are X' : 'You are O'}
                    </div>) : ''}
                </div>
                <div className={styles.game}>
                    <div className={styles["game-row"]}>
                        <div className={styles["game-board"]}>
                            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} handleScore={handleScore} data={gameData} />
                        </div>
                        <div className={styles["game-info"]}>
                            {NewGame}
                        </div>
                    </div>
                    <div className={styles["game-row"]}>
                        <Table data={score} gameData={gameData}/>
                    </div>
                </div>
            </ProtectedRoute>
        </>
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