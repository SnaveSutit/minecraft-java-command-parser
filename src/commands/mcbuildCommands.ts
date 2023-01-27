import { throwSyntaxError } from '../errors'
import { createParserFunc, ISyntaxToken, ISyntaxTokens } from '../parsers/vanillaParser'
import { AnyMCBSyntaxToken } from '../parsers/mcbuildParser'

export interface IMCBCommandSyntaxToken<N> extends ISyntaxToken<'mcb.command'> {
	name: N
}
export type AnyMCBCommandSyntaxToken = IMCBCommandSyntaxTokens[keyof IMCBCommandSyntaxTokens]
export interface IMCBCommandSyntaxTokens {
	function: IMCBCommandSyntaxToken<'mcb:function_definition'> & {
		functionName: ISyntaxTokens['literal']
		content: AnyMCBSyntaxToken[]
	}
}

export const parseMCBCommand = createParserFunc(
	'at MCBCommand at %POS',
	(s): AnyMCBCommandSyntaxToken | undefined => {
		const { line, column } = s.item!
		const commandName = s.collect()!.value as keyof IMCBCommandSyntaxTokens
		switch (commandName) {
			case 'function':
				return
		}
	}
)
