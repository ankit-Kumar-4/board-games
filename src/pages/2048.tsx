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
            return false;
        }
        const newIndex = getRandomInt(indexes.length);
        const newMatrix = matrix.slice();
        newMatrix[indexes[newIndex]] = newCellValue;
        setMatrix(newMatrix);
        return true;
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => generateNumber(matrix),
        onSwipedRight: () => generateNumber(matrix),
        onSwipedUp: () => generateNumber(matrix),
        onSwipedDown: () => generateNumber(matrix),
        preventScrollOnSwipe: false,
        trackMouse: true,
    });


    useEffect(() => {
        generateNumber(matrix);
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
