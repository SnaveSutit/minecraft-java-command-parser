import { AnyToken } from '../tokenizers/vanillaTokenizer';
import { AnySyntaxToken, ISyntaxTokens } from './vanillaParser';
export type AnyMCBSyntaxToken = IMCBSyntaxTokens[keyof IMCBSyntaxTokens] | AnySyntaxToken;
export interface IMCBSyntaxTokens extends ISyntaxTokens {
}
export declare function parser(s: AnyToken[]): AnySyntaxToken[];
