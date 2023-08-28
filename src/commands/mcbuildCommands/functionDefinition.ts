import { AnyMCBSyntaxToken } from '../../parsers/mcbuildParser'
import {
	assertTypeAndCollect,
	assertTypeAndConsume,
	createParserFunc,
} from '../../parsers/vanillaParser'
import { IMCBCommandSyntaxTokens } from '../mcbuildCommands'
import { parseFunctionBlock } from './functionBlock'

export const parseFunctionDefinition = createParserFunc(
	'at FunctionDefinition at %POS',
	function (s): IMCBCommandSyntaxTokens['functionDefinition'] {
		const { line, column } = s.item!
		s.consume() // Consume literal:'function'
		assertTypeAndConsume(s, 'space')
		const functionName = assertTypeAndCollect(s, 'literal')
		assertTypeAndConsume(s, 'space')

		const content: AnyMCBSyntaxToken[] = parseFunctionBlock(s)

		return {
			type: 'mcb.command',
			name: 'mcb:function_definition',
			functionName,
			content,
			line,
			column,
		}
	}
)
