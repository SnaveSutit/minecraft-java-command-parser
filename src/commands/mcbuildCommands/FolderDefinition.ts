import { AnyMCBSyntaxToken } from '../../parsers/mcbuildParser'
import {
	assertTypeAndCollect,
	assertTypeAndConsume,
	createParserFunc,
} from '../../parsers/vanillaParser'
import { IMCBCommandSyntaxTokens } from '../mcbuildCommands'
import { parseFolderBlock } from './folderBlock'

export const parseFolderDefinition = createParserFunc(
	'at FolderDefinition at %POS',
	(s): IMCBCommandSyntaxTokens['folderDefinition'] => {
		const { line, column } = s.item!
		s.consume() // Consume literal:'dir'
		assertTypeAndConsume(s, 'space')
		const folderName = assertTypeAndCollect(s, 'literal')
		assertTypeAndConsume(s, 'space')

		const content: AnyMCBSyntaxToken[] = parseFolderBlock(s)

		return {
			type: 'mcb.command',
			name: 'mcb:folder_definition',
			folderName,
			content,
			line,
			column,
		}
	}
)
