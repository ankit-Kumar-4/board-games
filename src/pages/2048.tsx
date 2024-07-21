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


const Cell = ({ size, matrix }: { size: number; matrix: SquareValue[] }) => {
    const result = [];
    for (let i = 0; i < size; i++) {
        result.push(
            <div
                key={i}
                id={i + ''}
                className={"relative flex text-xl items-center justify-center bg-white border-2 border-black " + (matrix[i] === 0 ? 'text-white' : '')}
            >
                {matrix[i]}
            </div>
        );
    }
    return result;
}


const Board: React.FC = () => {
    const [matrix, setMatrix] = useState<SquareValue[]>(Array(4 * 4).fill(0));

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
        const newMatrix = Array(matrix.length).fill(0);
        console.log(matrix);
        for (let i = 0; i + 3 < matrix.length; i = i + 4) {
            let idx = i;
            for (let j = 0; j * j < matrix.length; j++) {
                if (matrix[i + j] > 0) {
                    newMatrix[idx] = matrix[i + j];
                    idx++;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setMatrix(newMatrix);
        }
    }

    function rightSwipe(matrix: SquareValue[]) {
        const newMatrix = Array(matrix.length).fill(0);
        console.log(matrix);
        for (let i = 3; i < matrix.length; i = i + 4) {
            let idx = i;
            for (let j = 3; j >= 0; j--) {
                if (matrix[i - j] > 0) {
                    newMatrix[idx] = matrix[i - j];
                    idx--;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setMatrix(newMatrix);
        }
    }

    function upSwipe(matrix: SquareValue[]) {
        const newMatrix = Array(matrix.length).fill(0);
        console.log(matrix);
        for (let i = 0; i * i < matrix.length; i++) {
            let idx = i;
            for (let j = i; j < matrix.length; j += 4) {
                if (matrix[j] > 0) {
                    newMatrix[idx] = matrix[j];
                    idx += 4;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
            setMatrix(newMatrix);
        }
    }

    function downSwipe(matrix: SquareValue[]) {
        const newMatrix = Array(matrix.length).fill(0);
        console.log(matrix);
        for (let i = 12; i < matrix.length; i++) {
            let idx = i;
            for (let j = i; j >= 0; j -= 4) {
                if (matrix[j] > 0) {
                    newMatrix[idx] = matrix[j];
                    idx -= 4;
                }
            }
        }

        const isEqual = compareMatrix(matrix, newMatrix);
        if (isEqual) {
            return;
        }

        const { value, index } = generateNumber(newMatrix);
        if (value > 0) {
            newMatrix[index] = value;
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
                    <Cell size={4 * 4} matrix={matrix} />
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
