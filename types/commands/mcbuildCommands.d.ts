import { ISyntaxToken, ISyntaxTokens } from '../parsers/vanillaParser';
import { AnyMCBSyntaxToken } from '../parsers/mcbuildParser';
export interface IMCBCommandSyntaxToken<N> extends ISyntaxToken<'mcb.command'> {
    name: N;
}
export type AnyMCBCommandSyntaxToken = IMCBCommandSyntaxTokens[keyof IMCBCommandSyntaxTokens];
export interface IMCBCommandSyntaxTokens {
    function: IMCBCommandSyntaxToken<'mcb:function_definition'> & {
        functionName: ISyntaxTokens['literal'];
        content: AnyMCBSyntaxToken[];
    };
}
export declare const parseMCBCommand: (s: import("../parsers/vanillaParser").TokenStream) => (IMCBCommandSyntaxToken<"mcb:function_definition"> & {
    functionName: ISyntaxTokens['literal'];
    content: AnyMCBSyntaxToken[];
}) | undefined;
