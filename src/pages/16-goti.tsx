import { useState, useEffect } from "react";
import Xarrow from "react-xarrows";
import { getConvertedIndex } from "@/utils/16-goti";

const unused_dashes = [0, 1, 6, 7, 8, 9, 14, 15, 24, 25, 30, 31, 32, 33, 38, 39];
const unused_strokes = [1, 7, 28, 34];
const unused_dots = [1, 7, 9, 17, 27, 35, 37, 43];


const Dot = ({ index }: { index: number }) => {
    return (
        <div id={`${index}`}
            className={`w-3 h-3 md:w-8 md:h-8 rounded-full z-20
                ${unused_dots.includes(index) ? '' : 'bg-black'}`}
        ></div>
    )
}

const Dash = ({ index, value, highlight, isPortrait }: {
    index: number, value: number, highlight: boolean, isPortrait: boolean
}) => {
    let temp = unused_dashes;
    if (isPortrait) {
        temp = unused_strokes
    }
    return (
        <div
            className={`h-3 w-12 md:h-8 md:w-32 ${highlight ? 'border-2 border-black' : ''} 
                ${temp.includes(index) ? '' :
                    (value === null ? 'bg-white' : (value === 0 ? 'bg-blue-500' : 'bg-red-600'))}
            `}
        ></div>
    )
}

const Stroke = ({ index, value, highlight, isPortrait }: {
    index: number, value: number, highlight: boolean, isPortrait: boolean
}) => {
    let temp = unused_strokes;
    if (isPortrait) {
        temp = unused_dashes;
    }
    return (
        <div
            className={`w-3 h-8 md:w-8 md:h-32 ${highlight ? 'border-2 border-black' : ''} 
                ${temp.includes(index) ? '' : (value === null ? 'bg-white' : (value === 0 ? 'bg-blue-500' : 'bg-red-600'))}
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


const Board = ({ row, column, dashes, strokes, isPortrait }:
    {
        row: number; column: number, dashes: number[], strokes: number[],
        isPortrait: boolean
    }) => {

    const board = [];
    let d = 0;
    let s = 0;
    let dt = 0;

    if (isPortrait) {
        row = 17;
        column = 9;
    } else {
        row = 9;
        column = 17;
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            let key = i * column + j;
            if (isPortrait) {
                key = getConvertedIndex(i, j, row);
            }
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    let temp = dt;
                    if (isPortrait) {
                        let idx = Math.floor(dt / 5);
                        let col = dt % 5;
                        temp = getConvertedIndex(idx, col, 9);
                    }
                    board.push(<Dot key={key} index={temp} />);
                    dt++;
                } else {
                    let temp = d;
                    if (isPortrait) {
                        let idx = Math.floor(d / 4);
                        let col = d % 4;
                        temp = getConvertedIndex(idx, col, 9);
                    }
                    board.push(<Dash key={key} index={temp} highlight={false} value={dashes[d]} isPortrait={isPortrait} />);
                    d++;
                }
            } else {
                if (j % 2 == 0) {
                    let temp = s;
                    if (isPortrait) {
                        let idx = Math.floor(s / 5);
                        let col = s % 5;
                        temp = getConvertedIndex(idx, col, 8);
                    }
                    board.push(<Stroke key={key} index={temp} highlight={false} value={strokes[s]} isPortrait={isPortrait} />);
                    s++;
                } else {
                    board.push(<Box key={key} />);
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

function Arrow(start: string, end: string, isPortrait: boolean) {
    return (
        <div className="z-10">
            <Xarrow
                color="#ffffff"
                curveness={0}
                strokeWidth={isPortrait ? 7 : 28}
                headSize={0}
                start={start}
                end={end}
                startAnchor={"middle"}
                endAnchor={"middle"}
            />
        </div>
    );
}

function fillArrow(isPortrait: boolean) {
    const arrows = [];
    arrows.push(Arrow(`0`, `10`, isPortrait));
    arrows.push(Arrow(`0`, `18`, isPortrait));
    arrows.push(Arrow(`10`, `20`, isPortrait));
    arrows.push(Arrow(`18`, `36`, isPortrait));
    arrows.push(Arrow(`20`, `28`, isPortrait));
    arrows.push(Arrow(`28`, `36`, isPortrait));
    arrows.push(Arrow(`8`, `16`, isPortrait));
    arrows.push(Arrow(`8`, `26`, isPortrait));
    arrows.push(Arrow(`16`, `24`, isPortrait));
    arrows.push(Arrow(`26`, `44`, isPortrait));
    arrows.push(Arrow(`34`, `44`, isPortrait));
    arrows.push(Arrow(`24`, `34`, isPortrait));
    arrows.push(Arrow(`24`, `32`, isPortrait));
    arrows.push(Arrow(`2`, `12`, isPortrait));
    arrows.push(Arrow(`12`, `22`, isPortrait));
    arrows.push(Arrow(`22`, `32`, isPortrait));
    arrows.push(Arrow(`32`, `42`, isPortrait));
    arrows.push(Arrow(`32`, `40`, isPortrait));
    arrows.push(Arrow(`6`, `14`, isPortrait));
    arrows.push(Arrow(`14`, `22`, isPortrait));
    arrows.push(Arrow(`14`, `24`, isPortrait));
    arrows.push(Arrow(`22`, `30`, isPortrait));
    arrows.push(Arrow(`30`, `38`, isPortrait));
    arrows.push(Arrow(`4`, `12`, isPortrait));
    arrows.push(Arrow(`4`, `14`, isPortrait));
    arrows.push(Arrow(`12`, `20`, isPortrait));
    arrows.push(Arrow(`20`, `30`, isPortrait));
    arrows.push(Arrow(`30`, `40`, isPortrait));
    return arrows;
}


export default function Game() {
    const [dashes, setDashes] = useState(Array(40).fill(null));
    const [strokes, setStrokes] = useState(Array(40).fill(null));
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setIsPortrait(true);
                let s = strokes;
                let d = dashes;
                setStrokes(d);
                setDashes(s);
            } else {
                setIsPortrait(false);
                let s = strokes;
                let d = dashes;
                setStrokes(d);
                setDashes(s);
            }
        };

        handleResize(); // Set initial values based on the current window size
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);




    return (
        <>
            <>Work in progress...</>
            <div className="flex flex-col items-center justify-center h-full w-full overflow-scroll">
                <Board row={9} column={17} dashes={dashes} strokes={strokes} isPortrait={isPortrait} />
                {fillArrow(isPortrait)}
            </div>
        </>
    )
}