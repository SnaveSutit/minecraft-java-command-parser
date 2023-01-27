import { GenericStream } from 'generic-stream';
import { AnyToken, ITokens } from '../tokenizers/vanillaTokenizer';
import { AnyExecuteSubCommand } from '../commands/vanillaCommands/executeCommand';
import { AnyCommandSyntaxToken } from '../commands/vanillaCommands';
import { StringStream } from 'generic-stream';
export type SelectorChar = 'a' | 'e' | 'r' | 's' | 'p';
export type NumberTypeIdentifier = 's' | 'b' | 't' | 'f' | 'd' | 'l' | 'S' | 'B' | 'F' | 'L';
export interface ISyntaxToken<T> {
    type: T;
    line: number;
    column: number;
}
export type AnySyntaxToken = ISyntaxTokens[keyof ISyntaxTokens] | AnyCommandSyntaxToken | AnyExecuteSubCommand;
export type AnyNBTSyntaxToken = ISyntaxTokens['nbtList'] | ISyntaxTokens['nbtObject'] | ISyntaxTokens['int'] | ISyntaxTokens['float'] | ISyntaxTokens['literal'] | ISyntaxTokens['quotedString'];
export interface ISyntaxTokens {
    space: ISyntaxToken<'space'> & ITokens['space'];
    control: ISyntaxToken<'control'> & ITokens['control'];
    bracket: ISyntaxToken<'bracket'> & ITokens['bracket'];
    newline: ISyntaxToken<'newline'> & ITokens['newline'];
    literal: ISyntaxToken<'literal'> & {
        value: string;
    };
    operation: ISyntaxToken<'operation'> & {
        value: '<=' | '<' | '=' | '>' | '>=';
    };
    quotedString: ISyntaxToken<'quotedString'> & {
        value: string;
        bracket: '"' | "'";
    };
    unquotedString: ISyntaxToken<'unquotedString'> & {
        value: string;
    };
    uuid: ISyntaxToken<'uuid'> & {
        value: string;
    };
    int: ISyntaxToken<'int'> & {
        value: string;
        identifier?: NumberTypeIdentifier;
    };
    float: ISyntaxToken<'float'> & {
        value: string;
        identifier?: NumberTypeIdentifier;
    };
    intRange: (ISyntaxToken<'intRange'> & {
        min?: ISyntaxTokens['int'];
        max?: ISyntaxTokens['int'];
    }) | ISyntaxTokens['int'];
    floatRange: (ISyntaxToken<'floatRange'> & {
        min?: ISyntaxTokens['float'];
        max?: ISyntaxTokens['float'];
    }) | ISyntaxTokens['float'];
    targetSelector: ISyntaxToken<'targetSelector'> & ({
        targetType: 'literal';
        value: ISyntaxTokens['literal'];
    } | {
        targetType: 'selector';
        selectorChar: SelectorChar;
        args: ISyntaxTokens['targetSelectorArgument'][];
    } | {
        targetType: 'uuid';
        value: ISyntaxTokens['uuid'];
    });
    targetSelectorArgument: ISyntaxToken<'targetSelectorArgument'> & {
        key: string;
        value: AnySyntaxToken | undefined;
        inverted: boolean;
    };
    boolean: ISyntaxToken<'boolean'> & {
        value: 'true' | 'false';
    };
    advancementObject: ISyntaxToken<'advancementObject'> & {
        advancements: Map<ISyntaxTokens['resourceLocation'], ISyntaxTokens['boolean']>;
    };
    vec2: ISyntaxToken<'vec2'> & {
        x?: ISyntaxTokens['int'] | ISyntaxTokens['float'];
        xSpace?: '~' | '^';
        z?: ISyntaxTokens['int'] | ISyntaxTokens['float'];
        zSpace?: '~' | '^';
    };
    vec3: ISyntaxToken<'vec3'> & {
        x?: ISyntaxTokens['int'] | ISyntaxTokens['float'];
        xSpace?: '~' | '^';
        y?: ISyntaxTokens['int'] | ISyntaxTokens['float'];
        ySpace?: '~' | '^';
        z?: ISyntaxTokens['int'] | ISyntaxTokens['float'];
        zSpace?: '~' | '^';
    };
    resourceLocation: ISyntaxToken<'resourceLocation'> & {
        namespace: string;
        path: string;
    };
    block: ISyntaxToken<'block'> & {
        block: ISyntaxTokens['resourceLocation'];
        blockstate?: ISyntaxTokens['blockstate'];
        nbt?: ISyntaxTokens['nbtObject'];
    };
    blockstate: ISyntaxToken<'blockstate'> & {
        states: Record<string, ISyntaxTokens['literal'] | ISyntaxTokens['int'] | ISyntaxTokens['boolean']>;
    };
    nbtObject: ISyntaxToken<'nbtObject'> & {
        value: Record<string, AnyNBTSyntaxToken>;
    };
    nbtList: ISyntaxToken<'nbtList'> & {
        itemType?: 'byte' | 'int' | 'long';
        items: AnyNBTSyntaxToken[];
    };
    nbtPath: ISyntaxToken<'nbtPath'> & {
        parts: AnySyntaxToken[];
    };
    scoreObject: ISyntaxToken<'scoreObject'> & {
        scores: Record<string, ISyntaxTokens['int'] | ISyntaxTokens['intRange']>;
    };
}
export declare class TokenStream extends GenericStream<AnyToken> {
}
/**
 * Wraps a function in a try-catch statement. Allows for descriptive recursive parser error messages
 */
export declare function createCatchFunc<Args extends any[], Ret>(errMessage: string, fn: (...args: Args) => Ret): (...args: Args) => Ret;
/**
 * Wraps a function in a try-catch statement. Allows for descriptive recursive parser error messages
 */
export declare function createTokenizerFunc<Args extends any[], Ret>(errMessage: string, fn: (s: StringStream, ...args: Args) => Ret): (s: StringStream, ...args: Args) => Ret;
/**
 * Wraps a function in a try-catch statement. Allows for descriptive recursive parser error messages
 */
export declare function createParserFunc<Args extends any[], Ret>(errMessage: string, fn: (s: TokenStream, ...args: Args) => Ret): (s: TokenStream, ...args: Args) => Ret;
/**
 * Consumes all tokens of the given type
 */
export declare function consumeAll<T extends keyof ITokens>(s: TokenStream, tokenType: T): void;
/**
 * Collects all tokens of the given type
 */
export declare function collectAll<T extends keyof ITokens>(s: TokenStream, tokenType: T): ITokens[T][];
/**
 * Asserts that s.item is the expected type. If not, throws a MinecraftSyntaxError
 */
export declare function assertTypeAndConsume<Type extends keyof ITokens>(s: TokenStream, expectedType: Type): void;
/**
 * Asserts that s.item is the expected type then returns it. If not, throws a MinecraftSyntaxError
 */
export declare function assertTypeAndCollect<Type extends keyof ITokens>(s: TokenStream, expectedType: Type | Type[]): ITokens[Type];
/**
 * Asserts that s.item is the expected type and value. If not, throws a MinecraftSyntaxError
 */
export declare function assertValueAndConsume<Type extends keyof ITokens, Value extends ITokens[Type]['value']>(s: TokenStream, expectedType: Type, expectedValue: Value): void;
/**
 * Asserts that s.item is the expected type and value then returns it. If not, throws a MinecraftSyntaxError
 */
export declare function assertValueAndCollect<Type extends keyof ITokens, Value extends ITokens[Type]['value']>(s: TokenStream, expectedType: Type, expectedValue: Value | Value[]): ITokens[Type] & {
    value: Value;
};
export declare function parse(tokens: AnyToken[], customFirstPass?: (stream: TokenStream, newTokens: AnyToken[]) => boolean, customSecondPass?: (stream: TokenStream, syntaxTree: AnySyntaxToken[]) => boolean): AnySyntaxToken[];
