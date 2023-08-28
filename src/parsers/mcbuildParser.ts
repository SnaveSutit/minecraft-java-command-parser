import {
	AnyMCBCommandSyntaxToken,
	parseMCBFolderContextCommands,
} from '../commands/mcbuildCommands'
import { parseFolderDefinition } from '../commands/mcbuildCommands/FolderDefinition'
import { parseCompileLoop } from '../commands/mcbuildCommands/compileLoop'
import {
	parseFunctionBlock,
	parseInlineFunctionBlock,
} from '../commands/mcbuildCommands/functionBlock'
import { parseFunctionDefinition } from '../commands/mcbuildCommands/functionDefinition'
import { throwSyntaxError } from '../errors'
import { AnyMCBToken } from '../tokenizers/mcbuildTokenizer'
import { AnyToken } from '../tokenizers/vanillaTokenizer'
import {
	AnySyntaxToken,
	ISyntaxToken,
	ISyntaxTokens,
	TokenStream,
	createParserFunc,
} from './vanillaParser'
import { parse as vanillaParser } from './vanillaParser'

export type AnyMCBSyntaxToken =
	| IMCBSyntaxTokens[keyof IMCBSyntaxTokens]
	| AnySyntaxToken
	| AnyMCBCommandSyntaxToken

export interface IMCBSyntaxTokens extends ISyntaxTokens {
	inlineJS: ISyntaxToken<'inlineJS'> & {
		code: string
	}
	multilineJS: ISyntaxToken<'multilineJS'> & {
		code: string
	}
}

function firstPass(s: TokenStream, newTokens: AnyMCBToken[]): boolean {
	return false
}

export const parseFolderContext = createParserFunc(
	'in FolderContext',
	(s: TokenStream, tree: AnyMCBSyntaxToken[]) => {
		if (s.item?.type === 'literal') {
			tree.push(parseMCBFolderContextCommands(s))
			return true
		} else if (s.item?.value === '}') {
			return false
		} else if (s.item?.type === 'newline') {
			s.consume()
			return true
		} else if (s.item?.type === 'comment') {
			s.consume()
			return true
		} else if (s.item?.type === 'space') {
			s.consume()
			return true
		} else throwSyntaxError(s.item, `Unexpected Token (%TOKEN) at %POS`)
	}
)

export const parseFunctionContext = createParserFunc(
	'in FunctionContext',
	(s: TokenStream, tree: AnyMCBSyntaxToken[]) => {
		switch (s.item?.type) {
			case 'literal':
				switch (s.item.value) {
					case 'block':
						tree.push(parseInlineFunctionBlock(s))
						return true
					case 'LOOP':
						tree.push(parseCompileLoop(s, parseFunctionBlock))
						return true
				}
				break
			case 'bracket':
				if (s.item.value === '{') {
					tree.push(parseInlineFunctionBlock(s))
					return true
				}
				break
		}
		return false
	}
)

export function parser(s: AnyToken[]) {
	return vanillaParser(s, undefined, parseFolderContext)
}
