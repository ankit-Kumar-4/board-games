export function getInitialDotArray() {
    const dots = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 9; j++) {
            let d = i * 9 + j;
            if (d % 9 < 4) {
                dots.push(0);
            } else if (d % 9 > 4) {
                dots.push(1);
            } else {
                dots.push(2);
            }
        }
    }
    return dots;
}

export function getKeyForArrow(i: number, j: number) {
    return (j * 17) + (17 - 1 - i);
}

export function getConvertedIndex(i: number, j: number, column: number) {
    return (j * column) + (column - 1 - i);
}