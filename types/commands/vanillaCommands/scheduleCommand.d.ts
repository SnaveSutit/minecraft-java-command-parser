import { TokenStream } from '../../parsers/vanillaParser';
export declare const parseScheduleCommand: (s: TokenStream) => import("../vanillaCommands").ISyntaxTokenCommand<"schedule"> & ({
    modeBranch: "clear";
    functionName: import("../../parsers/vanillaParser").ISyntaxToken<"resourceLocation"> & {
        namespace: string;
        path: string;
    };
} | {
    modeBranch: "function";
    functionName: import("../../parsers/vanillaParser").ISyntaxToken<"resourceLocation"> & {
        namespace: string;
        path: string;
    };
    time?: (import("../../parsers/vanillaParser").ISyntaxToken<"float"> & {
        value: string;
        identifier?: import("../../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | (import("../../parsers/vanillaParser").ISyntaxToken<"int"> & {
        value: string;
        identifier?: import("../../parsers/vanillaParser").NumberTypeIdentifier | undefined;
    }) | undefined;
    replaceMode?: "replace" | "append" | undefined;
});
