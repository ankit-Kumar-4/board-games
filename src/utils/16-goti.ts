export function getDotIndex(row: number, column: number, isPortrait: boolean) {

}

export function getKeyForArrow(i: number, j: number) {
    return (j * 17) + (17 - 1 - i);
}

export function getConvertedIndex(i: number, j: number, column: number) {
    return (j * column) + (column - 1 - i);
}