import { useState } from "react"
import Dropdown from "@/components/Dropdown";


const Board = ({ row, column }: { row: number; column: number }) => {
    const board = [];
    const dot = (<div className="bg-black w-2 h-2 rounded-full"></div>);
    const dash = (<div className="h-0.5 bg-gray-300 w-12"></div>);
    const stroke = (<div className="w-0.5 bg-gray-300 h-12"></div>);
    const box = (<div className="border border-transparent"></div>);

    // dot - dash - dot
    // stroke - box - stroke
    // dot -dash - dot

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    board.push(dot);
                } else {
                    board.push(dash);
                }
            } else {
                if (j % 2 == 0) {
                    board.push(stroke);
                } else {
                    board.push(box);
                }
            }
        }
    }

    let rowSize = 'grid-rows-3';
    switch (row) {
        case 3:
            rowSize = 'grid-rows-3'
            break;
        case 5:
            rowSize = 'grid-rows-5'
            break;
        case 7:
            rowSize = 'grid-rows-7'
            break;
        case 9:
            rowSize = 'grid-rows-9'
            break;
        case 11:
            rowSize = 'grid-rows-11'
            break;
        default:
            rowSize = 'grid-rows-5'
            break;
    }

    let colSize = 'grid-cols-3';
    switch (column) {
        case 3:
            colSize = 'grid-cols-3'
            break;
        case 5:
            colSize = 'grid-cols-5'
            break;
        case 7:
            colSize = 'grid-cols-7'
            break;
        case 9:
            colSize = 'grid-cols-9'
            break;
        case 11:
            colSize = 'grid-cols-11'
            break;
        default:
            colSize = 'grid-cols-5'
            break;
    }

    return (
        <div className={`grid gap-0 max-h-full`}
            style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${row}, minmax(0, 1fr))` }}>
            {board}

        </div>
    );
}

export default function Game() {
    const [row, setRow] = useState(5);
    const [column, setColumn] = useState(5);

    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    return (
        <>
            <div className="pl-36">

                <Dropdown options={options} value={row} setValue={setRow} />
                <Dropdown options={options} value={column} setValue={setColumn} />
            </div>
            <div className="flex flex-col items-center justify-center max-h-screen ">
                <div className="m-2"></div>
                <Board row={2 * row + 1} column={2 * column + 1} />
            </div>
        </>


    )
}