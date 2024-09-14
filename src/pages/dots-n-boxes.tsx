import { useState } from "react"
import Dropdown from "@/components/Dropdown";


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
            className={`h-2 w-12 hover:bg-purple-300 ${value === null ? 'bg-gray-300' : (value === 0 ? 'bg-blue-500' : 'bg-red-600')}`}
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
            className={`w-2 h-12 hover:bg-purple-300 ${value === null ? 'bg-gray-300' : (value === 0 ? 'bg-blue-500' : 'bg-red-600')}`}
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
    const d2 = i + 1 === row ? -1 : ((i + 1) * column) + j;

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
        <div className={`grid gap-0 content-center justify-center`}
            style={{ gridTemplateColumns: `repeat(${column}, auto)`, gridTemplateRows: `repeat(${row}, auto)` }}>
            {board}
        </div>
    );
}

export default function Game() {
    const [row, setRow] = useState(5);
    const [column, setColumn] = useState(9);
    const [dashes, setDashes] = useState(Array(54).fill(null));
    const [strokes, setStrokes] = useState(Array(50).fill(null));
    const [boxes, setBoxes] = useState(Array(45).fill(null));

    const [playerTurn, setPlayerTurn] = useState(0);

    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    function handleDashClick(index: number, value: number) {
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
        if (!updateBoxes) {
            setPlayerTurn((playerTurn + 1) % 2);
        } else {
            setBoxes(newBoxes);
        }
    }

    function handleStrokeClick(index: number, value: number) {
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

        setStrokes(newStrokes);
        if (!updateBoxes) {
            setPlayerTurn((playerTurn + 1) % 2);
        } else {
            setBoxes(newBoxes);
        }
    }

    return (
        <>
            <div className="pl-36">
                <Dropdown options={options} value={row} setValue={(value) => {
                    setRow(value);
                    setDashes(Array((value + 1) * column).fill(null));
                    setStrokes(Array(value * (column + 1)).fill(null));
                    setBoxes(Array(value * column).fill(null));
                }} />
                <Dropdown options={options} value={column} setValue={(value) => {
                    setColumn(value);
                    setDashes(Array((row + 1) * value).fill(null));
                    setStrokes(Array(row * (value + 1)).fill(null));
                    setBoxes(Array(row * value).fill(null));
                }} />
            </div>
            <div className="flex flex-col items-center justify-center max-h-screen ">
                <div className="m-2"></div>
                <Board row={2 * row + 1} column={2 * column + 1} dashes={dashes} strokes={strokes}
                    boxes={boxes} dashClick={handleDashClick} strokeClick={handleStrokeClick} />
            </div>
        </>


    )
}