import { throwSyntaxError } from '../errors'
import { AnyMCBSyntaxToken, IMCBSyntaxTokens } from '../parsers/mcbuildParser'
import { ISyntaxToken, ISyntaxTokens, createParserFunc } from '../parsers/vanillaParser'
import { parseFolderDefinition } from './mcbuildCommands/FolderDefinition'
import { parseCompileLoop } from './mcbuildCommands/compileLoop'
import { parseFolderBlock } from './mcbuildCommands/folderBlock'
import { parseFunctionDefinition } from './mcbuildCommands/functionDefinition'

export interface IMCBCommandSyntaxToken<N> extends ISyntaxToken<'mcb.command'> {
	name: N
}
export type AnyMCBCommandSyntaxToken = IMCBCommandSyntaxTokens[keyof IMCBCommandSyntaxTokens]
export interface IMCBCommandSyntaxTokens {
	functionDefinition: IMCBCommandSyntaxToken<'mcb:function_definition'> & {
		functionName: ISyntaxTokens['literal']
		content: AnyMCBSyntaxToken[]
	}
	folderDefinition: IMCBCommandSyntaxToken<'mcb:folder_definition'> & {
		folderName: ISyntaxTokens['literal']
		content: AnyMCBSyntaxToken[]
	}
	block: IMCBCommandSyntaxToken<'mcb:block'> & {
		blockName: ISyntaxTokens['literal'] | undefined
		keyword?: boolean
		content: AnyMCBSyntaxToken[]
	}
	compileLoop: IMCBCommandSyntaxToken<'mcb:compile_loop'> & {
		loopCode: IMCBSyntaxTokens['inlineJS']
		loopVar: ISyntaxTokens['literal']
		content: AnyMCBSyntaxToken[]
	}
}

export const parseMCBFolderContextCommands = createParserFunc(
	'at MCBFolderContextCommand at %POS',
	(s): AnyMCBCommandSyntaxToken => {
		const { line, column, value: commandName } = s.item!
		switch (commandName) {
			case 'function':
				return parseFunctionDefinition(s)
			case 'dir':
				return parseFolderDefinition(s)
			case 'LOOP':
				return parseCompileLoop(s, parseFolderBlock)
			default:
				throwSyntaxError(s.item, `Unknown MCB folder context command (%TOKEN) at %POS`)
		}
	}
)
