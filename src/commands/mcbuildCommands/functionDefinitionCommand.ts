import { AnyMCBSyntaxToken } from '../../parsers/mcbuildParser'
import {
	assertTypeAndCollect,
	assertTypeAndConsume,
	createParserFunc,
} from '../../parsers/vanillaParser'

const parseFunctionDefinitionCommand = createParserFunc(
	'at FunctionDefinition command at %POS',
	function (s) {
		const { line, column } = s.item!
		s.consume() // Consume literal:'function'
		assertTypeAndConsume(s, 'space')
		const functionName = assertTypeAndCollect(s, 'literal')
		assertTypeAndConsume(s, 'space')
		const content: AnyMCBSyntaxToken[] = []

		return {
			type: 'command',
			name: 'function',
			functionName,
			content,
			line,
			column,
		}
	}
)
