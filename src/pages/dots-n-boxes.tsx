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

    return (
        <div className={`grid grid-cols-${column} grid-rows-${row} gap-0`}>
            {board}

        </div>
    );
}

export default function Game() {
    const [row, setRow] = useState(5);
    const [column, setColumn] = useState(5);

    const options = [3, 5, 7, 9];

    return (
        <div className="flex flex-col items-center justify-center max-h-screen ">
            <Dropdown options={options} value={row} setValue={setRow}/>
            <Dropdown options={options} value={column} setValue={setColumn}/>
            <div className="m-2"></div>
            <Board row={row} column={column} />
        </div>


    )
}