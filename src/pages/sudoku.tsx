'use client';


import { useEffect, useState } from 'react';
import { FaTrash, FaUndo } from 'react-icons/fa';
import Head from 'next/head';

import {
    checkInBox,
    getBoxCount,
    getRemainingPointers,
    boxes3x3,
    checkInvalidMove,
    findAllSelected,
    getNewSudokuBoard,
    getFilledStatus,
    formatTime
} from '@/utils/sudoku';

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

interface TimerProps {
    seconds: number;
    setSeconds: React.Dispatch<React.SetStateAction<number>>;
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    stopCondition: boolean;
}

const Timer: React.FC<TimerProps> = ({ seconds, setSeconds, isRunning, stopCondition }) => {
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && !stopCondition) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, stopCondition, setSeconds]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div>
            <h1>Timer: {formatTime(seconds)}</h1>
        </div>
    );
};

const Board = (
    { matrix, selectedCell, handleSudokuCellClick, originalMatrix }:
        {
            matrix: number[]
            selectedCell: { row: number, col: number, box: number };
            handleSudokuCellClick: (row: number, column: number) => void;
            originalMatrix: number[]
        }) => {

    const invalidCells = checkInvalidMove(matrix);
    const getSelectedCells = findAllSelected(matrix, matrix[selectedCell.row * 9 + selectedCell.col]);

    const cells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells.push(
                (
                    <div
                        key={i * 9 + j}
                        className={`w-8 h-8 md:w-16 md:h-16 flex items-center justify-center  border 
                            ${i % 3 === 0 ? 'border-t-2 border-t-black' : ''}  ${j % 3 === 0 ? 'border-l-2 border-l-black' : ''}
                            ${i === selectedCell.row && j === selectedCell.col ? 'border-2 border-yellow-500 bg-blue-400' : 'border-gray-400'}
                            ${getSelectedCells.includes(i * 9 + j) ? 'bg-blue-300' :
                                i === selectedCell.row || j === selectedCell.col || checkInBox(boxes3x3[selectedCell.box], i * 9 + j) ?
                                    'bg-blue-100 ' : 'bg-transparent border-gray-400'}
                            ${invalidCells.includes(i * 9 + j) ? 'text-red-700' : originalMatrix[i * 9 + j] ? 'text-2xl' : 'text-green-800'}
                            ${originalMatrix[i * 9 + j] ? 'text-2xl' : ''}
                            `}

                        onClick={() => handleSudokuCellClick(i, j)}
                    >
                        {matrix[i * 9 + j] ? matrix[i * 9 + j] : null}
                    </div >
                )
            )
        }
    }

    return (
        <div >
            <div className="grid grid-cols-9 ">
                {cells}
            </div>
        </div>
    );
};

const Game: React.FC = () => {
    const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1, box: -1 });
    const [matrix, setMatrix] = useState(Array(91).fill(0));
    const [pointer, setPointer] = useState(-1);
    const [remainingPointers, setRemainingPointers] = useState(Array(9).fill(9));
    const [originalMatrix, setOriginalMatrix] = useState(Array(81).fill(0));
    const [gameOver, setGameOver] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    function restartGame() {
        const matrix = getNewSudokuBoard();
        setMatrix(matrix);
        setOriginalMatrix(matrix);
        setSelectedCell({ row: -1, col: -1, box: -1 });
        setPointer(-1);
        setRemainingPointers(getRemainingPointers(matrix));
        setGameOver(false);
        setIsRunning(true);
        setSeconds(0);
    }

    function handlePointerClick(value: number) {
        if (remainingPointers[value - 1] === 0) return;
        if (originalMatrix[selectedCell.row * 9 + selectedCell.col]) return;

        const newMatrix = matrix.slice();
        newMatrix[selectedCell.row * 9 + selectedCell.col] = value;
        setMatrix(newMatrix);
        setPointer(value - 1);
        setRemainingPointers(getRemainingPointers(newMatrix));
        if (getFilledStatus(newMatrix) && checkInvalidMove(newMatrix).length === 0) {
            setGameOver(true);
        }
    }

    const handleSudokuCellClick = (row: number, column: number) => {
        const box = getBoxCount(row * 9 + column);
        setSelectedCell({ row: row, col: column, box });
    };

    const handleSudokuCellErase = () => {
        if (originalMatrix[selectedCell.row * 9 + selectedCell.col]) return;
        const newMatrix = matrix.slice();
        newMatrix[selectedCell.row * 9 + selectedCell.col] = 0;
        setMatrix(newMatrix);
        setRemainingPointers(getRemainingPointers(newMatrix));
    }

    useEffect(() => {
        const matrix = getNewSudokuBoard();
        setMatrix(matrix);
        setOriginalMatrix(matrix);
        setRemainingPointers(getRemainingPointers(matrix));
    }, []);

    return (
        <>
            <Head>
                <title>Sudoku - Board Games by Ankit</title>
                <meta name="description" content="Enjoy the classic Sudoku game online. Challenge your logic and problem-solving skills with puzzles ranging from easy to expert difficulty. Play Sudoku for free now!" />
                <meta name="keywords" content="sudoku, online sudoku, free sudoku, sudoku by ankit, ankit" />
                <meta name="author" content="Ankit Kumar" />
                <meta property="og:title" content="Sudoku - Board Games by Ankit" />
                <meta property="og:description" content="Enjoy the classic Sudoku game online. Challenge your logic and problem-solving skills with puzzles ranging from easy to expert difficulty. Play Sudoku for free now!" />
                <meta property="og:image" content="https://example.com/og-image.jpg" />
                <meta property="og:url" content="https://games-by-ankit.vercel.app/sudoku" />
                <link rel="canonical" href="https://games-by-ankit.vercel.app/sudoku" />
            </Head>

            <div className="flex justify-center mb-2">
                <div className='p-1 text-pretty text-2xl'>
                    <Timer
                        seconds={seconds}
                        setSeconds={setSeconds}
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        stopCondition={gameOver}
                    />
                </div>
                <button onClick={restartGame}>
                    New Game
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex w-full justify-center">
                    <Board matrix={matrix} selectedCell={selectedCell} handleSudokuCellClick={handleSudokuCellClick} originalMatrix={originalMatrix} />
                </div>
                <div className="flex flex-row md:w-1/12 md:pl-3 md:flex-col justify-around">
                    <div className='w-2'>
                        Erase <FaTrash className="text-gray-500 text-3xl" onClick={handleSudokuCellErase} />
                    </div>
                    <div className='w-2 opacity-0'>
                        Undo <FaUndo className="text-gray-500 text-3xl" />
                    </div>
                </div>

                <div className="flex flex-row md:w-1/2 md:flex-col justify-around gap-0.5">
                    {Array.from({ length: 9 }, (_, index) => (
                        <div
                            key={index}
                            className={`w-1/12 md:w-1/3 flex flex-col md:flex-row justify-center content-center
                            border  cursor-pointer hover:bg-sky-200
                            ${pointer === index ? 'bg-blue-300 border-blue-600 border-2' : 'bg-transparent border-gray-400'}
                            ${remainingPointers[index] ? '' : 'opacity-0'}
                            `}
                            onClick={() => handlePointerClick(index + 1)}
                        >
                            <div className="flex justify-center items-center h-full w-full">

                                <div className='text-xl'>{index + 1}</div>
                            </div>
                            <div className="flex justify-center items-center h-full w-full">
                                <div className='text-gray-500'>{remainingPointers[index]}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={gameOver} onClose={() => { setGameOver(false); setIsRunning(false) }}>
                <h2>Game Over</h2>
                <p>Your final score is: {formatTime(seconds)} </p>
                <button onClick={restartGame} className="mt-4 p-2 bg-blue-500 text-white rounded">New Game</button>
            </Modal>
        </>
    );
};

export default Game;
