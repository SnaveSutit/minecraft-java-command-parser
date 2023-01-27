import { StringStream } from 'generic-stream';
import { AnyToken, IToken } from './vanillaTokenizer';
export interface IMCBTokens {
    inlineJS: IToken<'mcb:inlineJS', string>;
    multilineJS: IToken<'mcb:multilineJS', string>;
}
export type AnyMCBToken = IMCBTokens[keyof IMCBTokens] | AnyToken;
export declare function tokenize(s: StringStream): AnyToken[];
