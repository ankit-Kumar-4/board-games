import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

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
                className={`relative flex text-xl items-center justify-center ${cell_color} border-2 border-black ` + (matrix[i] === 0 ? 'text-white' : '')}
            >
                {matrix[i]}
            </div>)
        );
    }
    return result;
}

function shiftLeft(matrix: number[]) {
    const newMatrix = Array(matrix.length).fill(0);
    for (let i = 0; i + 3 < matrix.length; i = i + 4) {
        let idx = i;
        for (let j = 0; j * j < matrix.length; j++) {
            if (matrix[i + j] > 0) {
                newMatrix[idx] = matrix[i + j];
                idx++;
            }
        }
    }
    return newMatrix;
}

function shiftRight(matrix: number[]) {
    const newMatrix = Array(matrix.length).fill(0);
    for (let i = 3; i < matrix.length; i = i + 4) {
        let idx = i;
        for (let j = 0; j * j < matrix.length; j++) {
            if (matrix[i - j] > 0) {
                newMatrix[idx] = matrix[i - j];
                idx--;
            }
        }
    }
    return newMatrix;
}

function shiftUp(matrix: number[]) {
    const newMatrix = Array(matrix.length).fill(0);
    for (let i = 0; i * i < matrix.length; i++) {
        let idx = i;
        for (let j = i; j < matrix.length; j += 4) {
            if (matrix[j] > 0) {
                newMatrix[idx] = matrix[j];
                idx += 4;
            }
        }
    }
    return newMatrix;
}

function shiftDown(matrix: number[]) {
    const newMatrix = Array(matrix.length).fill(0);
    for (let i = 12; i < matrix.length; i++) {
        let idx = i;
        for (let j = i; j >= 0; j -= 4) {
            if (matrix[j] > 0) {
                newMatrix[idx] = matrix[j];
                idx -= 4;
            }
        }
    }
    return newMatrix;
}


const Board: React.FC = () => {
    const [matrix, setMatrix] = useState<SquareValue[]>(Array(4 * 4).fill(0));
    const [score, setScore] = useState(0);

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

    function leftSwipe(matrix: SquareValue[]) {
        let newMatrix = shiftLeft(matrix);
        let newScore = score;

        for (let i = 0; i < matrix.length; i += 4) {
            let idx = i;
            for (let j = 0; j * j < matrix.length; j++) {
                if ((j + 1) * (j + 1) > matrix.length) {
                    newMatrix[idx] = newMatrix[i + j];
                    break;
                }
                if (newMatrix[i + j + 1] === 0) {
                    break;
                }
                if (newMatrix[i + j] === newMatrix[i + j + 1]) {
                    newMatrix[idx] = 2 * newMatrix[i + j + 1];
                    newScore = newScore + newMatrix[idx];
                    newMatrix[i + j + 1] = 0;
                    idx++;
                    j++;
                } else {
                    idx++;
                    continue;
                }
            }
        }
        newMatrix = shiftLeft(newMatrix);

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

    function rightSwipe(matrix: SquareValue[]) {
        let newMatrix = shiftRight(matrix);
        let newScore = score;

        for (let i = 3; i < matrix.length; i = i + 4) {
            let idx = i;
            for (let j = 0; j * j < matrix.length; j++) {
                if ((j + 1) * (j + 1) > matrix.length) {
                    newMatrix[idx] = newMatrix[i - j];
                    break;
                }
                if (newMatrix[i - j - 1] === 0) {
                    break;
                }
                if (newMatrix[i - j] === newMatrix[i - j - 1]) {
                    newMatrix[idx] = 2 * newMatrix[i - j - 1];
                    newScore = newScore + newMatrix[idx];
                    newMatrix[i - j - 1] = 0;
                    idx--;
                    j++;
                } else {
                    idx--;
                    continue;
                }
            }
        }
        newMatrix = shiftRight(newMatrix);


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

    function upSwipe(matrix: SquareValue[]) {
        let newMatrix = shiftUp(matrix);
        let newScore = score;

        for (let i = 0; i * i < matrix.length; i++) {
            let idx = i;
            for (let j = i; j < matrix.length; j += 4) {
                if (j + 4 > matrix.length) {
                    newMatrix[idx] = newMatrix[j];
                    break;
                }
                if (newMatrix[j + 4] === 0) {
                    break;
                }
                if (newMatrix[j] === newMatrix[j + 4]) {
                    newMatrix[idx] = 2 * newMatrix[j + 4];
                    newScore = newScore + newMatrix[idx];
                    newMatrix[j + 4] = 0;
                    idx += 4;
                    j += 4;
                } else {
                    idx += 4;
                    continue;
                }
            }
        }
        newMatrix = shiftUp(newMatrix);

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

    function downSwipe(matrix: SquareValue[]) {
        let newMatrix = shiftDown(matrix);
        let newScore = score;

        for (let i = 12; i < matrix.length; i++) {
            let idx = i;
            for (let j = i; j >= 0; j -= 4) {
                if (j - 4 < 0) {
                    newMatrix[idx] = newMatrix[j];
                    break;
                }
                if (newMatrix[j - 4] === 0) {
                    break;
                }
                if (newMatrix[j] === newMatrix[j - 4]) {
                    newMatrix[idx] = 2 * newMatrix[j - 4];
                    newScore = newScore + newMatrix[idx];
                    newMatrix[j - 4] = 0;
                    idx -= 4;
                    j -= 4;
                } else {
                    idx -= 4;
                    continue;
                }
            }
        }
        newMatrix = shiftDown(newMatrix);

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
        onSwipedLeft: () => leftSwipe(matrix),
        onSwipedRight: () => rightSwipe(matrix),
        onSwipedUp: () => upSwipe(matrix),
        onSwipedDown: () => downSwipe(matrix),
        preventScrollOnSwipe: false,
        trackMouse: true,
    });


    useEffect(() => {
        const newMatrix = matrix.slice();
        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setMatrix(newMatrix);
        }
    }, []);

    return (
        <>
            <h1>Score: {score}</h1>
            <div className="flex flex-col items-center min-h-screen pt-8">
                <div
                    className="relative select-none"
                    style={{
                        width: '64vw',
                        height: '64vw',
                        maxWidth: '64vh',
                        maxHeight: '64vh'
                    }}
                    {...handlers}
                >
                    <div className="grid grid-cols-4 gap-0 h-full w-full bg-black">
                        {getCells(4 * 4, matrix)}
                    </div>
                </div>
            </div>
        </>
    );
};



export default function Home() {
    return (
        <div>
            <Board />
        </div>
    );
}
