import { useState } from "react"
import Dropdown from "@/components/Dropdown";


const Dot = () => {
    return (
        <div
            className="bg-black w-2 h-2 rounded-full"
        />
    )
}

const Dash = () => {
    return (
        <div
            className="h-[1vw] w-[6vw] bg-gray-300 "
        />
    )
}

const Stroke = () => {
    return (
        <div
            className="w-[1vw] h-[6vw] bg-gray-300"
        />
    )
}

const Box = () => {
    return (
        <div
            className="border border-transparent bg-gray-500 "
        />
    )
}

const Board = ({ row, column }: { row: number; column: number }) => {
    const board = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            const key = i * column + j;
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    board.push(<Dot key={key} />);
                } else {
                    board.push(<Dash key={key} />);
                }
            } else {
                if (j % 2 == 0) {
                    board.push(<Stroke key={key} />);
                } else {
                    board.push(<Box key={key} />);
                }
            }
        }
    }

    console.log(board.length)
    return (
        <div className={`grid gap-1 bg-amber-300`}
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