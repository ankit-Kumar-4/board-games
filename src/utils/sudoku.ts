export const boxes3x3 = [0, 3, 6, 27, 30, 33, 54, 57, 60];

export function checkInBox(boxNumber: number, value: number) {
    if (boxNumber <= value && value < boxNumber + 3) {
        return true;
    }
    if (boxNumber + 9 <= value && value < boxNumber + 9 + 3) {
        return true;
    }
    if (boxNumber + 18 <= value && value < boxNumber + 18 + 3) {
        return true;
    }
    return false;
}

export function getBoxCount(value: number) {
    for (let i = 0; i < 9; i++) {
        const result = checkInBox(boxes3x3[i], value);
        if (result) {
            return i;
        }
    }
    return -1;
}

export function getRemainingPointers(matrix: number[]) {
    const remainingPointers = Array(9).fill(9);
    for (let i of matrix) {
        if (i > 0) {
            remainingPointers[i - 1]--;
        }
    }
    return remainingPointers;
}

export function checkInvalidMove(matrix: number[]) {
    const invalidIndexes: number[] = [];

    for (let i = 0; i < 9; i++) {
        const square = Array(9).fill(0);
        const vertical = Array(9).fill(0);
        const horizontal = Array(9).fill(0);
        for (let j = 0; j < 9; j++) {
            if (matrix[i * 9 + j]) {
                horizontal[matrix[i * 9 + j] - 1]++;
            }
            if (matrix[j * 9 + i]) {
                vertical[matrix[j * 9 + i] - 1]++;
            }
        }

        let boxNumber = boxes3x3[i];
        for (let j = 0; j < 3; j++) {
            if (matrix[boxNumber + j]) {
                square[matrix[boxNumber + j] - 1]++;
            }
            if (matrix[boxNumber + 9 + j]) {
                square[matrix[boxNumber + 9 + j] - 1]++;
            }
            if (matrix[boxNumber + 18 + j]) {
                square[matrix[boxNumber + 18 + j] - 1]++;
            }
        }

        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 9; k++) {
                if (matrix[boxNumber + j]) {
                    if (square[k] > 1) {
                        if (matrix[boxNumber + j] === k + 1) {
                            invalidIndexes.push(boxNumber + j);
                        }
                    }
                }
                if (matrix[boxNumber + 9 + j]) {
                    if (square[k] > 1) {
                        if (matrix[boxNumber + 9 + j] === k + 1) {
                            invalidIndexes.push(boxNumber + j + 9);
                        }
                    }
                }
                if (matrix[boxNumber + 18 + j]) {
                    if (square[k] > 1) {
                        if (matrix[boxNumber + 18 + j] === k + 1) {
                            invalidIndexes.push(boxNumber + j + 18);
                        }
                    }
                }
            }
        }


        for (let j = 0; j < 9; j++) {
            for (let k = 0; k < 9; k++) {
                if (matrix[i * 9 + j]) {
                    if (horizontal[k] > 1) {
                        if (matrix[i * 9 + j] === k + 1) {
                            invalidIndexes.push(i * 9 + j);
                        }
                    }
                }
                if (matrix[j * 9 + i]) {
                    if (vertical[k] > 1) {
                        if (matrix[j * 9 + i] === k + 1) {
                            invalidIndexes.push(j * 9 + i);
                        }
                    }
                }
            }
        }
    }
    return invalidIndexes;
}


export function findAllSelected(matrix: number[], value: number) {
    if (!value) return [];
    return matrix.reduce((acc: number[], element, index) => {
        if (element === value) {
            acc.push(index);
        }
        return acc;
    }, []);
}