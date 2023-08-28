import { AnyMCBSyntaxToken, parseFunctionContext } from '../../parsers/mcbuildParser'
import {
	AnySyntaxToken,
	ISyntaxTokens,
	assertTypeAndConsume,
	assertValueAndConsume,
	consumeAll,
	createParserFunc,
	rawSecondPassLoop,
} from '../../parsers/vanillaParser'
import { IMCBCommandSyntaxTokens } from '../mcbuildCommands'
import { assertAndConsumeEndOfArg } from '../vanillaCommands'

export const parseFunctionBlock = createParserFunc('at FunctionBlock at %POS', function (s) {
	// const uuid = randomUUID()
	// console.log('start block', uuid, s.item)

	// const { line, column } = s.item!
	assertValueAndConsume(s, 'bracket', '{')
	consumeAll(s, 'space')

	const content: AnyMCBSyntaxToken[] = []

	rawSecondPassLoop(s, content as AnySyntaxToken[], parseFunctionContext, s => {
		if (s.item?.type === 'bracket' && s.item.value === '}') return true
		return false
	})

	// console.log('end block', uuid, s.item)
	assertValueAndConsume(s, 'bracket', '}')
	assertAndConsumeEndOfArg(s)

	return content
})

export const parseInlineFunctionBlock = createParserFunc(
	'at InlineFunctionBlock at %POS',
	function (s): IMCBCommandSyntaxTokens['block'] {
		// console.log('inline function block', s.item)
		const { line, column } = s.item!
		let blockName: ISyntaxTokens['literal'] | undefined
		let keyword: boolean | undefined
		// Block keyword is optional
		if (s.item?.type === 'literal' && s.item.value === 'block') {
			keyword = true
			s.consume()
			assertTypeAndConsume(s, 'space')
			// Function name is optional, but only if block keyword is present
			if (s.item?.type === 'literal') {
				// console.log('block name', s.item)
				blockName = s.collect() as ISyntaxTokens['literal']
				assertTypeAndConsume(s, 'space')
			}
		}

		const content: AnyMCBSyntaxToken[] = parseFunctionBlock(s)

		return {
			type: 'mcb.command',
			name: 'mcb:block',
			keyword,
			blockName,
			content,
			line,
			column,
		}
	}
)
