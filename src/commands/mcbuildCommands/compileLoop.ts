import { AnyMCBSyntaxToken, IMCBSyntaxTokens } from '../../parsers/mcbuildParser'
import { TokenStream, assertTypeAndCollect, createParserFunc } from '../../parsers/vanillaParser'
import { IMCBTokens } from '../../tokenizers/mcbuildTokenizer'
import { IMCBCommandSyntaxTokens } from '../mcbuildCommands'

export const parseCompileLoop = createParserFunc(
	'at CompileLoop at %POS',
	(
		s,
		blockParser: (s: TokenStream) => AnyMCBSyntaxToken[]
	): IMCBCommandSyntaxTokens['compileLoop'] => {
		const { line, column } = s.item!
		s.consume() // Consume literal:'LOOP'
		assertTypeAndCollect(s, 'space')
		const loopCode = assertTypeAndCollect<IMCBTokens>(s, ['inlineJS', 'literal', 'int'])
		const parsedLoopCode: IMCBSyntaxTokens['inlineJS'] = {
			type: 'inlineJS',
			code: loopCode.value,
			line: loopCode.line,
			column: loopCode.column,
		}
		assertTypeAndCollect(s, 'space')
		const loopVar = assertTypeAndCollect(s, 'literal')
		assertTypeAndCollect(s, 'space')
		const content: AnyMCBSyntaxToken[] = blockParser(s)

		return {
			type: 'mcb.command',
			name: 'mcb:compile_loop',
			loopCode: parsedLoopCode,
			loopVar,
			content,
			line,
			column,
		}
	}
)
