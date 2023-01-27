import { StringStream } from 'generic-stream';
import { AnyToken } from './tokenizers/vanillaTokenizer';
export declare class MinecraftSyntaxError extends Error {
    constructor(message: string);
}
export declare class MinecraftTokenError extends Error {
    constructor(message: string);
}
export declare function throwTokenError(s: StringStream, message: string, line?: number, column?: number): never;
export declare function throwSyntaxError(token: AnyToken | undefined, message: string, line?: number, column?: number): never;
