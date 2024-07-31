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
            cells.push(
                (
                    <div
                        key={i * 9 + j}
                        className={`w-8 h-8 md:w-16 md:h-16 flex items-center justify-center bg-gray-300 border border-gray-400
                            ${i % 3 === 0 ? 'border-t-2' : ''}  ${j % 3 === 0 ? 'border-l-2' : ''}
                            ${i === selectedCell.x ? 'bg-blue-100 ' : ''} 
                            ${j === selectedCell.y ? 'bg-blue-100 ' : ''}
                            ${i === selectedCell.x && j === selectedCell.y ? 'border-2 border-blue-500 ' : ''}
                            
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
    function restartGame() {
        setSelectedCell({ x: -1, y: -1 });
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
                <div className="flex-auto md:w-1/2 content-center">
                    <div className="flex flex-row flex-wrap md:flex-col justify-around gap-0.5">
                        {Array.from({ length: 9 }, (_, index) => (
                            <div
                                key={index}
                                className="w-1/12 md:w-full flex items-center justify-center bg-gray-300 border border-gray-400"
                            >
                                <div className="flex flex-col flex-wrap md:flex-row justify-around gap-0.5">
                                    <div>{index + 1}</div>
                                    <div>2</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
};

export default Game;
