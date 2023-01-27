import {
	assertTypeAndCollect,
	assertTypeAndConsume,
	assertValueAndCollect,
	createParserFunc,
	TokenStream,
} from '../../parsers/vanillaParser'
import { collectOptionalArg, ICommandSyntaxTokens, parseResourceLocation } from '../vanillaCommands'

export const parseScheduleCommand = createParserFunc(
	'at Schedule command at %POS',
	function (s: TokenStream): ICommandSyntaxTokens['schedule'] {
		const { line, column } = s.item!
		s.consume() // consume literal:'schedule'
		assertTypeAndConsume(s, 'space')
		const modeBranch = assertValueAndCollect(s, 'literal', ['clear', 'function']).value
		assertTypeAndConsume(s, 'space')
		const functionName = parseResourceLocation(s, true)
		if (modeBranch === 'function') {
			assertTypeAndConsume(s, 'space')
			const time = assertTypeAndCollect(s, ['int', 'float'])
			const replaceMode = collectOptionalArg(s, 'literal', ['replace', 'append'])?.value
			return {
				type: 'command',
				name: 'schedule',
				modeBranch,
				functionName,
				time,
				replaceMode,
				line,
				column,
			}
		}

		return { type: 'command', name: 'schedule', modeBranch, functionName, line, column }
	}
)
