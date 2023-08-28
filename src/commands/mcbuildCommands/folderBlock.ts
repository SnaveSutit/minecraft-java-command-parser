import { AnyMCBSyntaxToken, parseFolderContext } from '../../parsers/mcbuildParser'
import {
	AnySyntaxToken,
	assertValueAndConsume,
	consumeAll,
	createParserFunc,
	rawSecondPassLoop,
} from '../../parsers/vanillaParser'
import { assertAndConsumeEndOfArg } from '../vanillaCommands'

export const parseFolderBlock = createParserFunc('at FolderBlock at %POS', function (s) {
	assertValueAndConsume(s, 'bracket', '{')
	consumeAll(s, 'space')

	const content: AnyMCBSyntaxToken[] = []

	rawSecondPassLoop(s, content as AnySyntaxToken[], parseFolderContext, s => {
		if (s.item?.type === 'bracket' && s.item.value === '}') return true
		return false
	})

	assertValueAndConsume(s, 'bracket', '}')
	assertAndConsumeEndOfArg(s)

	return content
})
