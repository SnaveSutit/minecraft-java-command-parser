import { AnySyntaxToken } from './parsers/vanillaParser';
import { AnyToken } from './tokenizers/vanillaTokenizer';
export declare function highlightToken(token: AnyToken): void;
export declare function highlightSyntaxTree(syntaxTree: AnySyntaxToken[]): void;
