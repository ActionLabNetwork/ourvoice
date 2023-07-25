/**
 * Check if two arrays are equal. Elements are only compared by === operator
 */
export function areArraysEqual<T>(array1: T[], array2: T[]) {
    if (array1.length !== array2.length) {
        return false
    }
    return array1.every((item, index) => item === array2[index])
}

