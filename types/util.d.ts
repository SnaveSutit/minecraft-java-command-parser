import { AnyToken } from './tokenizers/vanillaTokenizer';
/**
 * Compresses a number array to single values or min/max ranges
 * @returns A compressed version of the original array
 */
export declare function packArray(array: number[]): (number | number[])[];
/**
 * Generates a function that checks if a character is in a list of characters using only binary operations
 * @param str The characters this function will check for
 */
export declare function genComparison(str: string): (c?: number) => boolean;
export declare function roundToN(v: number, n: number): number;
export declare function tokenToString(token?: AnyToken): string;
export declare class Clock {
    startTime?: number;
    endTime?: number;
    constructor();
    start(): this;
    end(): this;
    get diff(): number | undefined;
}
