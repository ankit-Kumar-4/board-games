'use client';

import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import hotkeys from 'hotkeys-js';

type SquareValue = number | 0;

function getNewCellValue() {
    const random = Math.random(); // Generates a random number between 0 and 1

    if (random < 0.01) {
        return 8;
    } else if (random < 0.11) {
        return 4;
    } else {
        return 2;
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}


function compareMatrix(matrixA: number[], matrixB: number[]) {
    for (let i = 0; i < matrixA.length; i++) {
        if (matrixA[i] !== matrixB[i]) {
            return false;
        }
    }
    return true;
}


function getCells(size: number, matrix: SquareValue[]) {
    const result = [];
    for (let i = 0; i < size; i++) {
        let cell_color = 'bg-white';
        switch (matrix[i]) {
            case 2:
                cell_color = 'bg-cell2';
                break;
            case 4:
                cell_color = 'bg-cell4';
                break;
            case 8:
                cell_color = 'bg-cell8';
                break;
            case 16:
                cell_color = 'bg-cell16';
                break;
            case 32:
                cell_color = 'bg-cell32';
                break;
            case 64:
                cell_color = 'bg-cell64';
                break;
            case 128:
                cell_color = 'bg-cell128';
                break;
            case 256:
                cell_color = 'bg-cell256';
                break;
            case 512:
                cell_color = 'bg-cell512';
                break;
            case 1024:
                cell_color = 'bg-cell1024';
                break;
            case 2048:
                cell_color = 'bg-cell2048';
                break;
            case 4096:
                cell_color = 'bg-cell4096';
                break;

            default:
                break;
        }
        result.push(
            (<div
                key={i}
                id={i + ''}
                className={`relative flex text-xl md:text-4xl items-center justify-center ${cell_color} border-2 border-black ` + (matrix[i] === 0 ? 'text-white' : '')}
            >
                {matrix[i]}
            </div>)
        );
    }
    return result;
}


const Board: React.FC = () => {
    const [matrix, setMatrix] = useState<SquareValue[]>(Array(4 * 4).fill(0));
    const [score, setScore] = useState(0);
    const matrixRef = useRef(matrix);
    const scoreRef = useRef(score);

    function generateNumber(matrix: SquareValue[]) {
        const newCellValue = getNewCellValue();
        const indexes: number[] = []
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i] === 0) {
                indexes.push(i);
            }
        }
        if (indexes.length === 0) {
            return { value: 0, index: 0 };
        }
        const newIndex = getRandomInt(indexes.length);
        return { value: newCellValue, index: indexes[newIndex] };
    }

    function leftSwipe(matrix: SquareValue[], score: number) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = 0; i < matrix.length; i += 4) {
            let x = i;
            let y = i + 1;
            while (y - i < 4) {
                if (x === y) {
                    y++;
                }
                if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y++;
                    continue;
                }
                if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y++;
                    continue;
                }
                if (newMatrix[y] === 0) {
                    y++;
                    continue;
                }
                if (newMatrix[x] !== newMatrix[y]) {
                    x++;
                    continue;
                }
                newMatrix[x] = 2 * newMatrix[y];
                newScore += 2 * newMatrix[y];
                newMatrix[y] = 0;
                x++;
                y++;
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
        }
    }

    function rightSwipe(matrix: SquareValue[], score: number) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = 3; i < matrix.length; i = i + 4) {
            let x = i;
            let y = i - 1;
            while (i - y < 4) {
                if (x === y) {
                    y--;
                }
                if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y--;
                    continue;
                }
                if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y--;
                    continue;
                }
                if (newMatrix[y] === 0) {
                    y--;
                    continue;
                }
                if (newMatrix[x] !== newMatrix[y]) {
                    x--;
                    continue;
                }
                newMatrix[x] = 2 * newMatrix[y];
                newScore += 2 * newMatrix[y];
                newMatrix[y] = 0;
                x--;
                y--;
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
        }
    }

    function upSwipe(matrix: SquareValue[], score: number) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = 0; i * i < matrix.length; i++) {
            let x = i;
            let y = i + 4;
            while (y < matrix.length) {
                if (x === y) {
                    y += 4;
                }
                if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y += 4;
                    continue;
                }
                if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y += 4;
                    continue;
                }
                if (newMatrix[y] === 0) {
                    y += 4;
                    continue;
                }
                if (newMatrix[x] !== newMatrix[y]) {
                    x += 4;
                    continue;
                }
                newMatrix[x] = 2 * newMatrix[y];
                newScore += 2 * newMatrix[y];
                newMatrix[y] = 0;
                x += 4;
                y += 4;
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
        }
    }

    function downSwipe(matrix: SquareValue[], score: number) {
        let newMatrix = matrix.slice();
        let newScore = score;

        for (let i = matrix.length - 1; matrix.length - i <= 4; i--) {
            let x = i;
            let y = i - 4;
            while (y >= 0) {
                if (x === y) {
                    y -= 4;
                }
                if (newMatrix[x] === 0 && newMatrix[y] === 0) {
                    y -= 4;
                    continue;
                }
                if (newMatrix[x] === 0 && newMatrix[y] !== 0) {
                    newMatrix[x] = newMatrix[y];
                    newMatrix[y] = 0;
                    y -= 4;
                    continue;
                }
                if (newMatrix[y] === 0) {
                    y -= 4;
                    continue;
                }
                if (newMatrix[x] !== newMatrix[y]) {
                    x -= 4;
                    continue;
                }
                newMatrix[x] = 2 * newMatrix[y];
                newScore += 2 * newMatrix[y];
                newMatrix[y] = 0;
                x -= 4;
                y -= 4;
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setScore(newScore);
            setMatrix(newMatrix);
        }
    }


    const handlers = useSwipeable({
        onSwipedLeft: () => leftSwipe(matrix, score),
        onSwipedRight: () => rightSwipe(matrix, score),
        onSwipedUp: () => upSwipe(matrix, score),
        onSwipedDown: () => downSwipe(matrix, score),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });


    useEffect(() => {
        matrixRef.current = matrix;
        scoreRef.current = score;
    }, [matrix, score]);


    useEffect(() => {
        const newMatrix = matrix.slice();
        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setMatrix(newMatrix);
        }
    }, []);

    useEffect(() => {
        hotkeys('up', () => {
            upSwipe(matrixRef.current, scoreRef.current);
        });
        hotkeys('down', () => {
            downSwipe(matrixRef.current, scoreRef.current);
        });
        hotkeys('left', () => {
            leftSwipe(matrixRef.current, scoreRef.current);
        });
        hotkeys('right', () => {
            rightSwipe(matrixRef.current, scoreRef.current);
        });

        return () => {
            hotkeys.unbind('up');
            hotkeys.unbind('down');
            hotkeys.unbind('left');
            hotkeys.unbind('right');
        };
    }, []);

    return (
        <div {...handlers}
        >
            <h1>Score: {score}</h1>
            <div className="flex flex-col items-center max-h-screen pt-8">
                <div
                    className="relative select-none"
                    style={{
                        width: '80vw',
                        height: '80vw',
                        maxWidth: '80vh',
                        maxHeight: '80vh'
                    }}
                >
                    <div className="grid grid-cols-4 gap-0 h-full w-full bg-black">
                        {getCells(4 * 4, matrix)}
                    </div>
                </div>
            </div>
        </div>
    );
};



export default function Home() {
    return (
        <div>
            <Board />
        </div>
    );
}
