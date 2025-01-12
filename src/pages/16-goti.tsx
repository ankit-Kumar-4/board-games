import { useState, useEffect } from "react";
import Xarrow from "react-xarrows";

const row = 4;
const column = 8;

const unused_dashes = [0, 1, 6, 7, 8, 9, 14, 15, 24, 25, 30, 31, 32, 33, 38, 39];
const unused_strokes = [1, 7, 28, 34];
const unused_dots = [1, 7, 9, 17, 27, 35, 37, 43];

const Dot = ({ index }: { index: number }) => {
    return (
        <div id={`${index}`}
            className={`w-2 h-2 md:w-8 md:h-8 rounded-full z-20
                ${unused_dots.includes(index) ? '' : 'bg-black'}`}
        ></div>
    )
}

const Dash = ({ index, value, highlight }: {
    index: number, value: number, highlight: boolean
}) => {
    return (
        <div
            className={`h-2 w-8 md:h-8 md:w-36 ${highlight ? 'border-2 border-black' : ''} 
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
            className={`w-2 h-8 md:w-8 md:h-36 ${highlight ? 'border-2 border-black' : ''} 
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


function Arrow(start: string, end: string) {
    const [arrowParams, setArrowParams] = useState({
        strokeWidth: 28,
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setArrowParams({
                    strokeWidth: 7,
                });
            } else {
                setArrowParams({
                    strokeWidth: 28,
                });
            }
        };

        handleResize(); // Set initial values based on the current window size
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <div className="z-10">
            <Xarrow
                color="#ffffff"
                curveness={0}
                strokeWidth={arrowParams.strokeWidth}
                headSize={0}
                start={start}
                end={end}
                startAnchor={"middle"}
                endAnchor={"middle"}
            />
        </div>
    );
}

function fillArrow() {
    const arrows = [];
    arrows.push(Arrow(`0`, `10`));
    arrows.push(Arrow(`0`, `18`));
    arrows.push(Arrow(`10`, `20`));
    arrows.push(Arrow(`18`, `36`));
    arrows.push(Arrow(`20`, `28`));
    arrows.push(Arrow(`28`, `36`));
    arrows.push(Arrow(`8`, `16`));
    arrows.push(Arrow(`8`, `26`));
    arrows.push(Arrow(`16`, `24`));
    arrows.push(Arrow(`26`, `44`));
    arrows.push(Arrow(`34`, `44`));
    arrows.push(Arrow(`24`, `34`));
    arrows.push(Arrow(`24`, `32`));
    arrows.push(Arrow(`2`, `12`));
    arrows.push(Arrow(`12`, `22`));
    arrows.push(Arrow(`22`, `32`));
    arrows.push(Arrow(`32`, `42`));
    arrows.push(Arrow(`32`, `40`));
    arrows.push(Arrow(`6`, `14`));
    arrows.push(Arrow(`14`, `22`));
    arrows.push(Arrow(`14`, `24`));
    arrows.push(Arrow(`22`, `30`));
    arrows.push(Arrow(`30`, `38`));
    arrows.push(Arrow(`4`, `12`));
    arrows.push(Arrow(`4`, `14`));
    arrows.push(Arrow(`12`, `20`));
    arrows.push(Arrow(`20`, `30`));
    arrows.push(Arrow(`30`, `40`));
    return arrows;
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
                    console.log(key);
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
            <div className="flex flex-col items-center justify-center h-full w-full overflow-scroll">
                <Board row={9} column={17} dashes={dashes} strokes={strokes} />
                {fillArrow()}
            </div>
        </>
    )
}