'use client';


import { useRef, useState } from 'react';

const Board = (
    { matrix, selectedCell, setSelectedCell }:
        {
            matrix: number[]
            selectedCell: { x: number, y: number };
            setSelectedCell: any
        }) => {
    const handleCellClick = (row: number, column: number) => {
        console.log(row, column);
        setSelectedCell({ x: row, y: column })
    };

    const cells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            console.log(i, j, selectedCell.x, selectedCell.y);
            cells.push(
                (
                    <div
                        key={i * 9 + j}
                        className={`w-8 h-8 md:w-16 md:h-16 flex items-center justify-center  border 
                            ${i % 3 === 0 ? 'border-t-2' : ''}  ${j % 3 === 0 ? 'border-l-2' : ''}
                            ${i === selectedCell.x && j === selectedCell.y ? 'border-2 border-blue-500 ' : 'border-gray-400'}
                            ${i === selectedCell.x || j === selectedCell.y ? 'bg-blue-300 ' : 'bg-gray-300'} 
                            `}

                        onClick={() => handleCellClick(i, j)}
                    >
                        {matrix[i * 9 + j]}
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
    const [selectedCell, setSelectedCell] = useState({ x: -1, y: -1 });
    const [matrix, setMatrix] = useState(Array(91).fill(0));
    const [pointer, setPointer] = useState(-1);
    function restartGame() {
        setSelectedCell({ x: -1, y: -1 });
    }

    function updateCell(value: number) {
        const newMatrix = matrix.slice();
        newMatrix[selectedCell.x * 9 + selectedCell.y] = value;
        setMatrix(newMatrix);
        setPointer(value - 1);
    }
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
                    <Board matrix={matrix} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
                </div>
                <div className="flex flex-row md:w-1/2 md:flex-col justify-around gap-0.5">
                    {Array.from({ length: 9 }, (_, index) => (
                        <div
                            key={index}
                            className={`w-1/12 md:w-1/3 flex flex-col md:flex-row justify-center content-center
                                  border  cursor-pointer hover:bg-sky-200
                                 ${pointer === index ? 'bg-blue-300 border-blue-600 border-2' : 'bg-gray-300 border-gray-400'}
                                 `}
                            onClick={() => updateCell(index + 1)}
                        >
                            <div className="flex justify-center items-center h-full w-full">

                                <div className='text-xl'>{index + 1}</div>
                            </div>
                            <div className="flex justify-center items-center h-full w-full">
                                <div className='text-gray-500'>9</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default Game;
