import { assertTypeAndConsume, createParserFunc, TokenStream } from '../../parsers/vanillaParser'
import { ICommandSyntaxTokens, parseResourceLocation } from '../vanillaCommands'

const parseFunctionCommand = createParserFunc(
	'at Function command at %POS',
	function (s: TokenStream): ICommandSyntaxTokens['function'] {
		const { line, column } = s.item!
		s.consume() // Consume literal:'function'
		assertTypeAndConsume(s, 'space')
		const functionName = parseResourceLocation(s, true)
		return {
			type: 'command',
			name: 'function',
			functionName,
			line,
			column,
		}
	}
)
