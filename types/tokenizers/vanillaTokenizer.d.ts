import { StringStream } from 'generic-stream';
import { NumberTypeIdentifier } from '../parsers/vanillaParser';
export interface IToken<T, V> {
    type: T;
    value: V;
    line: number;
    column: number;
}
export interface ITokens {
    space: IToken<'space', string>;
    literal: IToken<'literal', string>;
    unknown: IToken<'unknown', string>;
    control: IToken<'control', ':' | ';' | ',' | '$' | '#' | '@' | '/' | '\\' | '=' | '*' | '<' | '>' | '%' | '+' | '~' | '^' | '-' | '.' | '..' | '!'>;
    bracket: IToken<'bracket', '[' | ']' | '{' | '}' | '(' | ')'>;
    comment: IToken<'comment', string>;
    newline: IToken<'newline', '\n' | '|'>;
    number: IToken<'number', string>;
    int: IToken<'int', string> & {
        identifier?: NumberTypeIdentifier;
    };
    float: IToken<'float', string> & {
        identifier?: NumberTypeIdentifier;
    };
    boolean: IToken<'boolean', 'true' | 'false'>;
    quotedString: IToken<'quotedString', string> & {
        bracket: '"' | "'";
    };
}
export type AnyToken = ITokens[keyof ITokens];
export declare const COMP: {
    quotes: (c?: number | undefined) => boolean;
    newline: (c?: number | undefined) => boolean;
    number: (c?: number | undefined) => boolean;
    bracket: (c?: number | undefined) => boolean;
    control: (c?: number | undefined) => boolean;
    whitespace: (c?: number | undefined) => boolean;
    word: (c?: number | undefined) => boolean;
};
export declare function tokenize(s: StringStream, customTokenizer?: (s: StringStream, tokens: AnyToken[]) => boolean | undefined): AnyToken[];
