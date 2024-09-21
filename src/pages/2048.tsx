'use client';

import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useHotkeys } from 'react-hotkeys-hook';
import Head from 'next/head';


type SquareValue = number | 0;
const undoTrigger = 512;

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
                <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded">Close</button>
            </div>
        </div>
    );
};


function getNewCellValue() {
    const random = Math.random();

    if (random < 0.01) {
        return 8;
    } else if (random < 0.11) {
        return 4;
    } else {
        return 2;
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}


function compareMatrix(matrixA: number[], matrixB: number[]) {
    for (let i = 0; i < matrixA.length; i++) {
        if (matrixA[i] !== matrixB[i]) {
            return false;
        }
    }
    return true;
}

function checkGameOver(matrix: number[], boardSize: number) {
    let left = false;
    let right = false;
    let up = false;
    let down = false;

    let newMatrix = matrix.slice();
    for (let i = 0; i < matrix.length; i += boardSize) {
        let x = i;
        let y = i + 1;
        while (y - i < boardSize) {
            if (x === y) {
                y++;
            } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                y++;
            } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                newMatrix[x] = newMatrix[y];
                newMatrix[y] = 0;
                y++;
            } else if (newMatrix[y] === 0) {
                y++;
            } else if (newMatrix[x] !== newMatrix[y]) {
                x++;
            } else {
                newMatrix[x] = 2 * newMatrix[y];
                newMatrix[y] = 0;
                x++;
                y++;
            }
        }
    }
    left = compareMatrix(matrix, newMatrix);
    newMatrix = matrix.slice()

    for (let i = 3; i < matrix.length; i = i + boardSize) {
        let x = i;
        let y = i - 1;
        while (i - y < boardSize) {
            if (x === y) {
                y--;
            } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                y--;
            } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                newMatrix[x] = newMatrix[y];
                newMatrix[y] = 0;
                y--;
            } else if (newMatrix[y] === 0) {
                y--;
            } else if (newMatrix[x] !== newMatrix[y]) {
                x--;
            } else {
                newMatrix[x] = 2 * newMatrix[y];
                newMatrix[y] = 0;
                x--;
                y--;
            }
        }
    }
    right = compareMatrix(matrix, newMatrix);
    newMatrix = matrix.slice()

    for (let i = 0; i * i < matrix.length; i++) {
        let x = i;
        let y = i + boardSize;
        while (y < matrix.length) {
            if (x === y) {
                y += boardSize;
            } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                y += boardSize;
            } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                newMatrix[x] = newMatrix[y];
                newMatrix[y] = 0;
                y += boardSize;
            } else if (newMatrix[y] === 0) {
                y += boardSize;
            } else if (newMatrix[x] !== newMatrix[y]) {
                x += boardSize;
            } else {
                newMatrix[x] = 2 * newMatrix[y];
                newMatrix[y] = 0;
                x += boardSize;
                y += boardSize;
            }
        }
    }
    up = compareMatrix(matrix, newMatrix);
    newMatrix = matrix.slice()

    for (let i = matrix.length - 1; matrix.length - i <= boardSize; i--) {
        let x = i;
        let y = i - boardSize;
        while (y >= 0) {
            if (x === y) {
                y -= boardSize;
            } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                y -= boardSize;
            } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                newMatrix[x] = newMatrix[y];
                newMatrix[y] = 0;
                y -= boardSize;
            } else if (newMatrix[y] === 0) {
                y -= boardSize;
            } else if (newMatrix[x] !== newMatrix[y]) {
                x -= boardSize;
            } else {
                newMatrix[x] = 2 * newMatrix[y];
                newMatrix[y] = 0;
                x -= boardSize;
                y -= boardSize;
            }
        }
    }
    down = compareMatrix(matrix, newMatrix);

    if (left && right && up && down) {
        return true;
    }
    return false;
}


function getCells(boardSize: number, matrix: SquareValue[]) {
    const size = boardSize * boardSize;
    const result = [];
    for (let i = 0; i < size; i++) {
        let cell_color = 'bg-white';
        switch (matrix[i]) {
            case 0:
                cell_color = 'bg-white';
                break;
            case 2:
                cell_color = 'bg-cell2';
                break;
            case 4:
                cell_color = 'bg-cell4';
                break;
            case 8:
                cell_color = 'bg-cell8';
                break;
            case 16:
                cell_color = 'bg-cell16';
                break;
            case 32:
                cell_color = 'bg-cell32';
                break;
            case 64:
                cell_color = 'bg-cell64';
                break;
            case 128:
                cell_color = 'bg-cell128';
                break;
            case 256:
                cell_color = 'bg-cell256';
                break;
            case 512:
                cell_color = 'bg-cell512';
                break;
            case 1024:
                cell_color = 'bg-cell1024';
                break;
            case 2048:
                cell_color = 'bg-cell2048';
                break;
            case 4096:
                cell_color = 'bg-cell4096';
                break;
            default:
                cell_color = 'bg-yellow-300';
                break;
        }
        result.push(
            (<div
                key={i}
                id={i + ''}
                className={`relative flex text-xl md:text-4xl items-center justify-center ${cell_color} border-2 border-black ` + (matrix[i] === 0 ? 'text-white' : '')}
            >
                {matrix[i]}
            </div>)
        );
    }
    switch (boardSize) {
        case 4:
            return (
                <div className={`grid grid-cols-4 gap-0 h-full w-full bg-black`}>
                    {result}
                </div>
            );
        case 6:
            return (
                <div className={`grid grid-cols-6 gap-0 h-full w-full bg-black`}>
                    {result}
                </div>
            );
        case 8:
            return (
                <div className={`grid grid-cols-8 gap-0 h-full w-full bg-black`}>
                    {result}
                </div>
            );
        default:
            break;
    }
    return (
        <div className={`grid grid-cols-6 gap-0 h-full w-full bg-black`}>
            {result}
        </div>
    );
}


const Board: React.FC = () => {
    const [matrix, setMatrix] = useState<SquareValue[]>(Array(4 * 4).fill(0));
    const [score, setScore] = useState(0);
    const [undoCount, setUndoCount] = useState(0);
    const [history, setHistory] = useState<{ matrix: SquareValue[], score: number }[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);

    const [boardSize, setBoardSize] = useState(4);
    const [expanded, setExpanded] = useState(false);

    function generateNumber(matrix: SquareValue[]) {
        const newCellValue = getNewCellValue();
        const indexes: number[] = []
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i] === 0) {
                indexes.push(i);
            }
        }
        if (indexes.length === 0) {
            return { value: 0, index: 0 };
        }
        const newIndex = getRandomInt(indexes.length);
        return { value: newCellValue, index: indexes[newIndex] };
    }

    function leftSwipe(matrix: SquareValue[]) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = 0; i < matrix.length; i += boardSize) {
            let x = i;
            let y = i + 1;
            while (y - i < boardSize) {
                if (x === y) {
                    y++;
                } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y++;
                } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y++;
                } else if (newMatrix[y] === 0) {
                    y++;
                } else if (newMatrix[x] !== newMatrix[y]) {
                    x++;
                } else {
                    newMatrix[x] = 2 * newMatrix[y];
                    newScore += 2 * newMatrix[y];
                    if (newMatrix[y] === undoTrigger) {
                        setUndoCount(undoCount + 1);
                    }
                    newMatrix[y] = 0;
                    x++;
                    y++;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual && checkGameOver(matrix, boardSize) && undoCount === 0) {
            setIsGameOver(true);
            return;
        }
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
            setHistory([...history, { matrix: matrix, score: score }]);
        }
    }

    function rightSwipe(matrix: SquareValue[]) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = boardSize - 1; i < matrix.length; i = i + boardSize) {
            let x = i;
            let y = i - 1;
            while (i - y < boardSize) {
                if (x === y) {
                    y--;
                } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y--;
                } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y--;
                } else if (newMatrix[y] === 0) {
                    y--;
                } else if (newMatrix[x] !== newMatrix[y]) {
                    x--;
                } else {
                    newMatrix[x] = 2 * newMatrix[y];
                    newScore += 2 * newMatrix[y];
                    if (newMatrix[y] === undoTrigger) {
                        setUndoCount(undoCount + 1);
                    }
                    newMatrix[y] = 0;
                    x--;
                    y--;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual && checkGameOver(matrix, boardSize) && undoCount === 0) {
            setIsGameOver(true);
            return;
        }

        if (isEqual) {
            return;
        }
        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
            setHistory([...history, { matrix: matrix, score: score }]);
        }
    }

    function upSwipe(matrix: SquareValue[]) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = 0; i * i < matrix.length; i++) {
            let x = i;
            let y = i + boardSize;
            while (y < matrix.length) {
                if (x === y) {
                    y += boardSize;
                } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y += boardSize;
                } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y += boardSize;
                } else if (newMatrix[y] === 0) {
                    y += boardSize;
                } else if (newMatrix[x] !== newMatrix[y]) {
                    x += boardSize;
                } else {
                    newMatrix[x] = 2 * newMatrix[y];
                    newScore += 2 * newMatrix[y];
                    if (newMatrix[y] === undoTrigger) {
                        setUndoCount(undoCount + 1);
                    }
                    newMatrix[y] = 0;
                    x += boardSize;
                    y += boardSize;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual && checkGameOver(matrix, boardSize) && undoCount === 0) {
            setIsGameOver(true);
            return;
        }
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
            setHistory([...history, { matrix: matrix, score: score }]);
        }
    }

    function downSwipe(matrix: SquareValue[]) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = matrix.length - 1; matrix.length - i <= boardSize; i--) {
            let x = i;
            let y = i - boardSize;
            while (y >= 0) {
                if (x === y) {
                    y -= boardSize;
                } else if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y -= boardSize;
                } else if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y -= boardSize;
                } else if (newMatrix[y] === 0) {
                    y -= boardSize;
                } else if (newMatrix[x] !== newMatrix[y]) {
                    x -= boardSize;
                } else {
                    newMatrix[x] = 2 * newMatrix[y];
                    newScore += 2 * newMatrix[y];
                    if (newMatrix[y] === undoTrigger) {
                        setUndoCount(undoCount + 1);
                    }
                    newMatrix[y] = 0;
                    x -= boardSize;
                    y -= boardSize;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual && checkGameOver(matrix, boardSize) && undoCount === 0) {
            setIsGameOver(true);
            return;
        }
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
            setHistory([...history, { matrix: matrix, score: score }]);
        }
    }


    const handlers = useSwipeable({
        onSwipedLeft: () => leftSwipe(matrix),
        onSwipedRight: () => rightSwipe(matrix),
        onSwipedUp: () => upSwipe(matrix),
        onSwipedDown: () => downSwipe(matrix),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });


    useEffect(() => {
        const newMatrix = matrix.slice();
        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setMatrix(newMatrix);
        }
    }, []);

    useHotkeys('up', () => {
        upSwipe(matrix);
    }, [matrix]);
    useHotkeys('down', () => {
        downSwipe(matrix);
    }, [matrix]);
    useHotkeys('left', () => {
        leftSwipe(matrix);
    }, [matrix]);
    useHotkeys('right', () => {
        rightSwipe(matrix);
    }, [matrix])

    const undo = () => {
        if (history.length === 0) {
            return;
        }
        const last_step = history.slice(-1)[0];
        const newHistory = history.slice(0, -1);
        setUndoCount(undoCount - 1);
        setMatrix(last_step.matrix);
        setScore(last_step.score);
        setHistory(newHistory);
    }

    const newGame = (level: number) => {
        setScore(0);
        setUndoCount(0);
        setHistory([]);
        setIsGameOver(false);
        const newMatrix = Array(level * level).fill(0);
        newMatrix[0] = 0;
        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setMatrix(newMatrix);
        }
    }

    const updateBoardSize = (level: number) => {
        newGame(level);
        setBoardSize(level);
        setExpanded(false);
    }

    return (
        <>
            <Head>
                <title>2048 - Board Games by Ankit</title>
                <meta name="description" content="Play the addictive 2048 puzzle game online. Swipe and merge tiles to reach the 2048 tile. Test your strategy and skill in this fun and challenging game. Play 2048 for free now!" />
                <meta name="keywords" content="2048, online 2048, free 2048, puzzle games, 2048 by ankit, ankit, 2048 game by ankit, board games by ankit" />
                <meta name="author" content="Ankit Kumar" />
                <meta property="og:title" content="2048 - Addictive Puzzle Game" />
                <meta property="og:description" content="Play the addictive 2048 puzzle game online. Swipe and merge tiles to reach the 2048 tile. Test your strategy and skill in this fun and challenging game. Play 2048 for free now!" />
                <meta property="og:image" content="https://example.com/og-2048.jpg" />
                <meta property="og:url" content="https://games-by-ankit.vercel.app/2048" />
                <link rel="canonical" href="https://games-by-ankit.vercel.app/2048" />

            </Head>
            <div {...handlers}
            >
                <div className="flex justify-center">
                    <p className='text-center font-extrabold text-xl text-score'>Score: {score}</p>
                    <button onClick={undo} className={`bg-orange-300 m-auto hover:bg-slate-500 ${undoCount === 0 ? 'hidden' : ''}`}>Undo Remaining: {undoCount}</button>
                    <label className="text-gray-700 font-semibold content-center justify-center ml-4">Board Size:</label>
                    {!expanded ? (
                        // Single button view
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded"
                            onClick={() => setExpanded(true)}>
                            {boardSize + 'x' + boardSize}
                        </button>
                    ) : (
                        // Expanded button view with animation
                        <div className="flex space-x-2">
                            {[4, 6, 8].map((level) => (
                                <button
                                    key={level}
                                    className={`w-full py-2  ${boardSize === level ? "bg-green-400" : "bg-gray-300"
                                        } text-white rounded`}
                                    onClick={() => updateBoardSize(level)}
                                >
                                    {level + 'x' + level}
                                </button>
                            ))}
                        </div>
                    )}
                    <button onClick={() => newGame(boardSize)} className='m-auto'>New Game</button>
                </div>
                <div className="flex flex-col items-center max-h-screen pt-8">
                    <div
                        className="relative select-none"
                        style={{
                            width: '80vw',
                            height: '80vw',
                            maxWidth: '80vh',
                            maxHeight: '80vh'
                        }}
                    >
                        {getCells(boardSize, matrix)}
                        {/* <div className={`grid grid-cols-8 gap-0 h-full w-full bg-black`}>
                            </div> */}
                    </div>
                </div>
                <Modal isOpen={isGameOver} onClose={() => setIsGameOver(false)}>
                    <h2>Game Over</h2>
                    <p>Your final score is: {score}</p>
                    <button onClick={() => newGame(boardSize)} className="mt-4 p-2 bg-blue-500 text-white rounded">New Game</button>
                </Modal>
            </div >
        </>
    );
};



export default function Home() {
    return (
        <div>
            <Board />
        </div>
    );
}
