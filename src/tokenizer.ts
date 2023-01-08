import { CharacterStream } from './characterStream'
import { throwSyntaxError } from './errors'

export interface IToken {
	type: string
	line: number
	column: number
}

export type Tokens = ITokenComment | ITokenWord | ITokenFloat | ITokenNewline | ITokenInt

export interface ITokenComment extends IToken {
	type: 'comment'
	value: string
}

export interface ITokenWord extends IToken {
	type: 'word'
	value: string
}

export interface ITokenNewline extends IToken {
	type: 'newline'
}

export interface ITokenInt extends IToken {
	type: 'int'
	value: number
}

export interface ITokenFloat extends IToken {
	type: 'float'
	value: number
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'

function expectConsumeSpace(s: CharacterStream) {
	if (s.item != ' ' && s.item != '\n') throwSyntaxError(s, `Expected space but found '${s.item}'`)
	s.consume()
}

function collectComment(s: CharacterStream): ITokenComment {
	const { line, column } = s
	return {
		type: 'comment',
		value: s.collect(s => s.item != '\n'),
		line,
		column,
	}
}

function collectWord(s: CharacterStream): ITokenWord {
	const { line, column } = s
	const word = s.collect(s => alphabet.includes(s.item!.toLowerCase()))
	expectConsumeSpace(s)
	return {
		type: 'word',
		value: word,
		line,
		column,
	}
}

export function tokenize(s: CharacterStream): Tokens[] {
	const tokens: Tokens[] = []

	while (s.item) {
		if (s.item === '\n') {
			s.consume()
		} else if (alphabet.includes(s.item!.toLowerCase())) {
			tokens.push(collectWord(s))
		} else {
			console.log(s.item)
			throwSyntaxError(s, `Unexpected character '${s.item}'`)
		}
	}

	return tokens
}
