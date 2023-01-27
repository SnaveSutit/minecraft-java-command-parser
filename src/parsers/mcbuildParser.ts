import { AnyMCBToken } from '../tokenizers/mcbuildTokenizer'
import { AnyToken } from '../tokenizers/vanillaTokenizer'
import { AnySyntaxToken, ISyntaxTokens, TokenStream } from './vanillaParser'
import { parse as vanillaParser } from './vanillaParser'

export type AnyMCBSyntaxToken = IMCBSyntaxTokens[keyof IMCBSyntaxTokens] | AnySyntaxToken
export interface IMCBSyntaxTokens extends ISyntaxTokens {}

function firstPass(s: TokenStream, newTokens: AnyMCBToken[]): boolean {
	return false
}

function secondPass(s: TokenStream, syntaxTree: AnyMCBSyntaxToken[]): boolean {
	if (s.item?.type === 'literal') {
	}
	return false
}

export function parser(s: AnyToken[]) {
	return vanillaParser(s, firstPass, secondPass)
}
