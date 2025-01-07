import { useState, useEffect } from "react";

const row = 4;
const column = 8;

const unused_dashes = [0, 1, 6, 7, 8, 9, 14, 15, 24, 25, 30, 31, 32, 33, 38, 39];
const unused_strokes = [1, 7, 28, 34];
const unused_dots = [1, 7, 9, 17, 27, 35, 37, 43];

const Dot = ({ index }: { index: number }) => {
    return (
        <div
            className={`w-8 h-8 rounded-full
                ${unused_dots.includes(index) ? '' : 'bg-black'}`}
        />
    )
}

const Dash = ({ index, value, highlight }: {
    index: number, value: number, highlight: boolean
}) => {
    return (
        <div
            className={`h-8 w-36 ${highlight ? 'border-2 border-black' : ''} 
                ${unused_dashes.includes(index) ? '' :
                    (value === null ? 'bg-white' : (value === 0 ? 'bg-blue-500' : 'bg-red-600'))}
            `}
        ></div>
    )
}

const Stroke = ({ index, value, highlight }: {
    index: number, value: number, highlight: boolean
}) => {
    return (
        <div
            className={`w-8 h-36 ${highlight ? 'border-2 border-black' : ''} 
                ${unused_strokes.includes(index) ? '' : (value === null ? 'bg-white' : (value === 0 ? 'bg-blue-500' : 'bg-red-600'))}
            `}
        ></div>
    )
}

const Box = () => {
    return (
        <div
            className={`border border-transparent`}
        />
    )
}


const Board = ({ row, column, dashes, strokes }:
    {
        row: number; column: number, dashes: number[], strokes: number[],
    }) => {
    const board = [];
    let d = 0;
    let s = 0;
    let b = 0;
    let dt = 0;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            const key = i * column + j;
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    board.push(<Dot key={key} index={dt} />);
                    dt++;
                } else {
                    board.push(<Dash key={key} index={d} highlight={false} value={dashes[d]} />);
                    d++;
                }
            } else {
                if (j % 2 == 0) {
                    board.push(<Stroke key={key} index={s} highlight={false} value={strokes[s]} />);
                    s++;
                } else {
                    board.push(<Box key={key} />);
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
    const [dashes, setDashes] = useState(Array(40).fill(null));
    const [strokes, setStrokes] = useState(Array(36).fill(null));


    return (
        <>
            <>Work in progress...</>
            <div className="flex flex-col items-center justify-center h-full w-full overflow-scroll ">
                <div className="m-2"></div>
                <Board row={2 * row + 1} column={2 * column + 1} dashes={dashes} strokes={strokes} />
            </div>
        </>
    )
}