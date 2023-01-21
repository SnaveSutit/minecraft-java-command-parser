import { CharacterStream } from './characterStream'
import { throwTokenError } from './errors'
import { genComparison } from './util'

export interface IToken<T, V> {
	type: T
	value: V
	line: number
	column: number
}

export interface ITokens {
	space: IToken<'space', string>
	literal: IToken<'literal', string>
	control: IToken<'control', string>
	bracket: IToken<'bracket', string>
	comment: IToken<'comment', string>
	newline: IToken<'newline', '\n'>
	int: IToken<'int', number>
	float: IToken<'float', number>
	quotedString: IToken<'quotedString', string> & {
		bracket: '"' | "'"
	}
}

export type AnyToken = ITokens[keyof ITokens]

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'

interface IChars {
	quotes: string
	newline: string
	number: string
	bracket: string
	control: string
	whitespace: string
	numberStart: string
	word: string
	// notWord: string
}

const CHARS = {} as IChars
CHARS.quotes = `'"`
CHARS.newline = '\n\r'
CHARS.number = numbers
CHARS.bracket = '[]{}()'
CHARS.control = `:,$#@/\\=*<>%+~^`
CHARS.whitespace = `\t\r\n `
CHARS.numberStart = `-.${numbers}`
CHARS.word = `${alphabet}${alphabet.toUpperCase()}${numbers}!._-`
// CHARS.notWord = `${CHARS.quotes}${CHARS.newline}${CHARS.whitespace}`

export const COMP = {
	quotes: genComparison(CHARS.quotes),
	newline: genComparison(CHARS.newline),
	number: genComparison(CHARS.number),
	bracket: genComparison(CHARS.bracket),
	control: genComparison(CHARS.control),
	whitespace: genComparison(CHARS.whitespace),
	numberStart: genComparison(CHARS.numberStart),
	word: genComparison(CHARS.word),
	// notWord: genComparison(CHARS.notWord),
}

function collectComment(s: CharacterStream): ITokens['comment'] {
	const { line, column } = s
	s.consume()
	const value = s.collect(s => !COMP.newline(s.itemCode))
	return {
		type: 'comment',
		value,
		line,
		column,
	}
}

function collectSpace(s: CharacterStream): ITokens['space'] {
	const { line, column } = s
	const value = s.collect(s => s.item === ' ')
	return {
		type: 'space',
		value,
		line,
		column,
	}
}

function collectLiteral(s: CharacterStream, startValue: string = ''): ITokens['literal'] {
	const { line, column } = s
	const value = startValue + s.collect(s => COMP.word(s.itemCode))
	if (COMP.word(s.itemCode)) throwTokenError(s, `Expected word to end but found ${s.item}`)
	return {
		type: 'literal',
		value,
		line,
		column,
	}
}

function collectNumber(s: CharacterStream): ITokens['float'] | ITokens['int'] | ITokens['literal'] {
	const { line, column } = s
	let type: 'int' | 'float' = 'int'
	let value = s.consume()!
	if (value === '.') type = 'float'

	value += s.collect(s => COMP.number(s.itemCode))
	if (type != 'float' && s.item === '.') {
		type = 'float'
		s.consume()
		value += '.' + s.collect(s => COMP.number(s.itemCode))
	}
	if (value === '-') return collectLiteral(s, value)
	else if (value === '.') return collectLiteral(s, value)
	else if (COMP.word(s.itemCode)) return collectLiteral(s, value)
	else if (COMP.number(s.itemCode))
		throwTokenError(s, `Expected number to end but found '${s.item}'`)

	return {
		type,
		value: Number(value),
		line,
		column,
	}
}

function collectNewline(s: CharacterStream): ITokens['newline'] {
	const { line, column } = s
	s.consumeWhile(s => COMP.newline(s.itemCode))
	return { type: 'newline', value: '\n', line, column }
}

function collectControl(s: CharacterStream): ITokens['control'] | ITokens['literal'] {
	const { line, column } = s
	const value = s.consume()!
	return {
		type: 'control',
		value,
		line,
		column,
	}
}

function collectBracket(s: CharacterStream): ITokens['bracket'] {
	const { line, column } = s
	const value = s.consume()!
	return {
		type: 'bracket',
		value,
		line,
		column,
	}
}

function collectQuotedString(s: CharacterStream): ITokens['quotedString'] {
	const { line, column } = s
	const bracket = s.consume()! as ITokens['quotedString']['bracket']
	let value = ''
	while (s.item) {
		if (s.item == undefined || COMP.newline(s.itemCode))
			throwTokenError(s, `Expected '${bracket}' to end string but got '${s.item}'`)
		else if (s.item === bracket) {
			if (!(s.look(-1, 1) === '\\')) break
		}
		value += s.item
		s.consume()
	}
	s.consume() // Consume ending bracket
	return {
		type: 'quotedString',
		bracket,
		value,
		line,
		column,
	}
}

export function tokenize(
	s: CharacterStream,
	customTokenizer?: (s: CharacterStream, tokens: AnyToken[]) => boolean | undefined
): AnyToken[] {
	const tokens: AnyToken[] = []

	while (s.item) {
		if (customTokenizer && customTokenizer(s, tokens)) {
		} else if (s.item === ' ') {
			tokens.push(collectSpace(s))
		} else if (COMP.newline(s.itemCode)) {
			tokens.push(collectNewline(s))
			s.consumeWhile(s => COMP.whitespace(s.itemCode))
			if (s.item === '#') tokens.push(collectComment(s))
		} else if (COMP.quotes(s.itemCode)) {
			tokens.push(collectQuotedString(s))
		} else if (COMP.control(s.itemCode)) {
			tokens.push(collectControl(s))
		} else if (COMP.bracket(s.itemCode)) {
			tokens.push(collectBracket(s))
		} else if (
			COMP.numberStart(s.itemCode) &&
			!(s.item === '.' && !COMP.number(s.next()?.charCodeAt(0)))
		) {
			tokens.push(collectNumber(s))
		} else if (COMP.word(s.itemCode)) {
			tokens.push(collectLiteral(s))
		} else if (s.item === '\t') {
			s.consume()
		} else {
			throwTokenError(s, `Unexpected character '${s.item}'`)
		}
	}

	return tokens
}
