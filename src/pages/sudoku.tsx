'use client';


import { useState } from 'react';
import {
    checkInBox,
    getBoxCount,
    getRemainingPointers,
    boxes3x3,
    checkInvalidMove,
    findAllSelected
} from '@/utils/sudoku';


const Board = (
    { matrix, selectedCell, handleSudokuCellClick }:
        {
            matrix: number[]
            selectedCell: { row: number, col: number, box: number };
            handleSudokuCellClick: (row: number, column: number) => void
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
                            ${i === selectedCell.row && j === selectedCell.col ? 'border-2 border-blue-500 bg-blue-300' : 'border-gray-400'}
                            ${i === selectedCell.row || j === selectedCell.col || checkInBox(boxes3x3[selectedCell.box], i * 9 + j) ? 'bg-blue-100 ' :
                                (getSelectedCells.includes(i * 9 + j) ? 'bg-blue-100' : 'bg-gray-300')
                            } 
                            ${invalidCells.includes(i * 9 + j) ? 'text-red-700 text-2xl' : ''}
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

    function restartGame() {
        setSelectedCell({ row: -1, col: -1, box: -1 });
        setMatrix(Array(91).fill(0));
        setPointer(-1);
        setRemainingPointers(Array(9).fill(9));
    }

    function handlePointerClick(value: number) {
        if (remainingPointers[value - 1] === 0) return;
        const newMatrix = matrix.slice();
        newMatrix[selectedCell.row * 9 + selectedCell.col] = value;
        setMatrix(newMatrix);
        setPointer(value - 1);
        setRemainingPointers(getRemainingPointers(newMatrix));
    }

    const handleSudokuCellClick = (row: number, column: number) => {
        const box = getBoxCount(row * 9 + column);
        setSelectedCell({ row: row, col: column, box });
    };

    return (
        <>
            <div>Work in progress...</div>
            <div className="flex justify-center mb-2">
                <button onClick={restartGame}>
                    New Game
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex w-full justify-center">
                    <Board matrix={matrix} selectedCell={selectedCell} handleSudokuCellClick={handleSudokuCellClick} />
                </div>
                <div className="flex flex-row md:w-1/2 md:flex-col justify-around gap-0.5">
                    {Array.from({ length: 9 }, (_, index) => (
                        <div
                            key={index}
                            className={`w-1/12 md:w-1/3 flex flex-col md:flex-row justify-center content-center
                                  border  cursor-pointer hover:bg-sky-200
                                 ${pointer === index ? 'bg-blue-300 border-blue-600 border-2' : 'bg-gray-300 border-gray-400'}
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

        </>
    );
};

export default Game;
