import { AnyNBTSyntaxToken, AnySyntaxToken, ISyntaxToken, ISyntaxTokens, SelectorChar, TokenStream } from '../parsers/vanillaParser';
import { AnyToken, ITokens } from '../tokenizers/vanillaTokenizer';
import { AnyExecuteSubCommand } from './vanillaCommands/executeCommand';
export interface ISyntaxTokenCommand<N> extends ISyntaxToken<'command'> {
    name: N;
}
export type AnyCommandSyntaxToken = ICommandSyntaxTokens[keyof ICommandSyntaxTokens];
export interface ICommandSyntaxTokens {
    unknown: ISyntaxTokenCommand<'unknown'> & {
        tokens: AnyToken[];
        commandName: string;
    };
    execute: ISyntaxTokenCommand<'execute'> & {
        subCommands: AnyExecuteSubCommand[];
    };
    schedule: ISyntaxTokenCommand<'schedule'> & ({
        modeBranch: 'clear';
        functionName: ISyntaxTokens['resourceLocation'];
    } | {
        modeBranch: 'function';
        functionName: ISyntaxTokens['resourceLocation'];
        time?: ISyntaxTokens['int' | 'float'];
        replaceMode?: 'replace' | 'append';
    });
    function: ISyntaxTokenCommand<'function'> & {
        functionName: ISyntaxTokens['resourceLocation'];
    };
}
export declare function isEndOfCommand(s: TokenStream): boolean;
export declare function assertEndOfArg(s: TokenStream): void;
export declare function assertAndConsumeEndOfArg(s: TokenStream): AnyToken | undefined;
export declare function collectOptionalArg<Type extends keyof ITokens, Value extends ITokens[Type]['value']>(s: TokenStream, expectedType: Type, expectedValue: Value | Value[]): (ITokens[Type] & {
    value: Value;
}) | undefined;
export declare function parseRange<Type extends 'int' | 'float'>(s: TokenStream, numberType: Type): ISyntaxTokens[Type] | ISyntaxTokens[`${Type}Range`];
export declare function parseScoreObject(s: TokenStream): ISyntaxTokens['scoreObject'];
export declare function parseAdvancementObject(s: TokenStream): ISyntaxTokens['advancementObject'];
export declare const parseResourceLocation: (s: TokenStream, allowTag: boolean) => ISyntaxToken<"resourceLocation"> & {
    namespace: string;
    path: string;
};
export declare function parseUnquotedString(s: TokenStream): ISyntaxTokens['unquotedString'];
export declare function parseNbtList(s: TokenStream): ISyntaxTokens['nbtList'];
export declare function parseNbtObject(s: TokenStream): ISyntaxTokens['nbtObject'];
export declare function parseTargetSelectorArguments(s: TokenStream): ISyntaxTokens['targetSelectorArgument'][];
export declare const parseTargetSelector: (s: TokenStream, allowScoreboardName?: boolean | undefined) => ISyntaxToken<"targetSelector"> & ({
    targetType: "literal";
    value: ISyntaxToken<"literal"> & {
        value: string;
    };
} | {
    targetType: "selector";
    selectorChar: SelectorChar;
    args: (ISyntaxToken<"targetSelectorArgument"> & {
        key: string;
        value: AnySyntaxToken | undefined;
        inverted: boolean;
    })[];
} | {
    targetType: "uuid";
    value: ISyntaxToken<"uuid"> & {
        value: string;
    };
});
export declare function parseSwizzle(s: TokenStream): string;
type VecAxis = {
    value?: ISyntaxTokens['int' | 'float'];
    space?: '~' | '^';
};
export declare function parseVecAxis(s: TokenStream): VecAxis;
export declare const parseVec2: (s: TokenStream) => ISyntaxToken<"vec2"> & {
    x?: (ISyntaxToken<"float"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | (ISyntaxToken<"int"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | undefined;
    xSpace?: "~" | "^" | undefined;
    z?: (ISyntaxToken<"float"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | (ISyntaxToken<"int"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | undefined;
    zSpace?: "~" | "^" | undefined;
};
export declare const parseVec3: (s: TokenStream) => ISyntaxToken<"vec3"> & {
    x?: (ISyntaxToken<"float"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | (ISyntaxToken<"int"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | undefined;
    xSpace?: "~" | "^" | undefined;
    y?: (ISyntaxToken<"float"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | (ISyntaxToken<"int"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | undefined;
    ySpace?: "~" | "^" | undefined;
    z?: (ISyntaxToken<"float"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | (ISyntaxToken<"int"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | undefined;
    zSpace?: "~" | "^" | undefined;
};
export declare const parseBlockstate: (s: TokenStream) => ISyntaxToken<"blockstate"> & {
    states: Record<string, (ISyntaxToken<"int"> & {
        value: string;
        identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | (ISyntaxToken<"boolean"> & {
        value: "false" | "true";
    }) | (ISyntaxToken<"literal"> & {
        value: string;
    })>;
};
export declare const parseBlock: (s: TokenStream) => ISyntaxToken<"block"> & {
    block: ISyntaxToken<"resourceLocation"> & {
        namespace: string;
        path: string;
    };
    blockstate?: (ISyntaxToken<"blockstate"> & {
        states: Record<string, (ISyntaxToken<"int"> & {
            value: string;
            identifier?: import("../parsers/vanillaParser").NumberTypeIdentifier | undefined;
        }) | (ISyntaxToken<"boolean"> & {
            value: "false" | "true";
        }) | (ISyntaxToken<"literal"> & {
            value: string;
        })>;
    }) | undefined;
    nbt?: (ISyntaxToken<"nbtObject"> & {
        value: Record<string, AnyNBTSyntaxToken>;
    }) | undefined;
};
export declare const parseNbtPath: (s: TokenStream) => ISyntaxToken<"nbtPath"> & {
    parts: AnySyntaxToken[];
};
export declare const parseOperation: (s: TokenStream) => ISyntaxToken<"operation"> & {
    value: "=" | "<" | ">" | "<=" | ">=";
};
export declare const parseScoreboardName: (s: TokenStream) => ISyntaxToken<"literal"> & {
    value: string;
};
export declare const parsePlayerName: (s: TokenStream) => ISyntaxToken<"literal"> & {
    value: string;
};
export declare const parseGenericCommand: (s: TokenStream) => AnyCommandSyntaxToken;
export * as executeCommand from './vanillaCommands/executeCommand';
export * as functionCommand from './vanillaCommands/functionCommand';
export * as scheduleCommand from './vanillaCommands/scheduleCommand';
