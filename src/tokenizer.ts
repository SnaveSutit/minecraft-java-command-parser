import { CharacterStream } from './characterStream'
import { throwSyntaxError } from './errors'

export interface IToken {
	type: string
	line: number
	column: number
}

export type Tokens =
	| ITokenComment
	| ITokenWord
	| ITokenFloat
	| ITokenNewline
	| ITokenInt
	| ITokenControl
	| ITokenCoordinateModifier
	| ITokenBracket
	| ITokenQuotedString

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

export interface ITokenControl extends IToken {
	type: 'control'
	value: string
}

export interface ITokenCoordinateModifier extends IToken {
	type: 'coordinateModifier'
	value: string
}

export interface ITokenBracket extends IToken {
	type: 'bracket'
	value: string
}

export interface ITokenQuotedString extends IToken {
	type: 'quotedString'
	value: string
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'

const CHARS = {
	newlines: '\n\r',
	word: `${alphabet}${alphabet.toUpperCase()}${numbers}!._`,
	numbers,
	numberStart: `-.${numbers}`,
	brackets: '[]{}()',
	control: `:,$#`,
	coordinateModifiers: `~^`,
	stringQuotes: `'"`,
}

function expectConsumeSpace(s: CharacterStream) {
	if (s.item == undefined || CHARS.newlines.includes(s.item!)) return
	if (s.item != ' ') throwSyntaxError(s, `Expected space but found '${s.item}'`)
	s.consume()
}

function collectComment(s: CharacterStream): ITokenComment {
	const { line, column } = s
	s.consume()
	return {
		type: 'comment',
		value: s.collect(s => !CHARS.newlines.includes(s.item!)),
		line,
		column,
	}
}

function collectWord(s: CharacterStream): ITokenWord {
	const { line, column } = s
	const word = s.collect(s => CHARS.word.includes(s.item!))
	if (CHARS.word.includes(s.item!)) throwSyntaxError(s, `Expected word to end but found ${s.item}`)
	return {
		type: 'word',
		value: word,
		line,
		column,
	}
}

function collectNumber(s: CharacterStream): ITokenFloat | ITokenInt {
	const { line, column } = s
	let type: 'int' | 'float' = 'int'
	let value = s.item!
	if (s.item === '.') type = 'float'
	s.consume()

	value += s.collect(s => CHARS.numbers.includes(s.item!))
	if (type != 'float' && s.item === '.') {
		type = 'float'
		s.consume()
		value += '.' + s.collect(s => CHARS.numbers.includes(s.item!))
	}
	expectConsumeSpace(s)

	return {
		type,
		value: Number(value),
		line,
		column,
	}
}

function collectNewline(s: CharacterStream): ITokenNewline {
	const { line, column } = s
	s.consumeWhile(s => CHARS.newlines.includes(s.item!))
	return { type: 'newline', line, column }
}

function collectControl(s: CharacterStream): ITokenControl {
	const { line, column } = s
	const value = s.item!
	s.consume()
	return {
		type: 'control',
		value,
		line,
		column,
	}
}

function collectCoordinateModifier(s: CharacterStream): ITokenCoordinateModifier {
	const { line, column } = s
	const value = s.item!
	s.consume()
	return {
		type: 'coordinateModifier',
		value,
		line,
		column,
	}
}

function collectBracket(s: CharacterStream): ITokenBracket {
	const { line, column } = s
	const value = s.item!
	s.consume()
	return {
		type: 'bracket',
		value,
		line,
		column,
	}
}

function collectQuotedString(s: CharacterStream): ITokenQuotedString {
	const { line, column } = s
	const bracket = s.item!
	s.consume()
	let value = s.collect(s => s.item != bracket && !CHARS.newlines.includes(s.item!))
	if (s.item == undefined || CHARS.newlines.includes(s.item!))
		throwSyntaxError(s, `Expected '${bracket}' to end string but got '${s.item}'`)
	s.consume()
	return {
		type: 'quotedString',
		value,
		line,
		column,
	}
}

export function tokenize(s: CharacterStream): Tokens[] {
	const tokens: Tokens[] = []

	while (s.item) {
		if (CHARS.newlines.includes(s.item)) {
			tokens.push(collectNewline(s))
			if (s.item === '#') tokens.push(collectComment(s))
		} else if (CHARS.stringQuotes.includes(s.item!)) {
			tokens.push(collectQuotedString(s))
		} else if (CHARS.coordinateModifiers.includes(s.item!)) {
			tokens.push(collectCoordinateModifier(s))
			expectConsumeSpace(s)
		} else if (CHARS.control.includes(s.item!)) {
			tokens.push(collectControl(s))
		} else if (CHARS.brackets.includes(s.item!)) {
			tokens.push(collectBracket(s))
		} else if (CHARS.numberStart.includes(s.item!)) {
			tokens.push(collectNumber(s))
		} else if (alphabet.includes(s.item!.toLowerCase())) {
			tokens.push(collectWord(s))
		} else if (s.item === ' ') {
			s.consume()
		} else {
			throwSyntaxError(s, `Unexpected character '${s.item}'`)
		}
	}

	return tokens
}
