import { StringStream } from '../util/stringStream'
import { throwTokenError } from '../errors'
import { genComparison } from '../util'
import { NumberTypeIdentifier } from '../parsers/vanillaParser'

export interface IToken<T, V> {
	type: T
	value: V
	line: number
	column: number
}

export interface ITokens {
	space: IToken<'space', string>
	literal: IToken<'literal', string>
	unknown: IToken<'unknown', string>
	control: IToken<
		'control',
		| ':'
		| ';'
		| ','
		| '$'
		| '#'
		| '@'
		| '/'
		| '\\'
		| '='
		| '*'
		| '<'
		| '>'
		| '%'
		| '+'
		| '~'
		| '^'
		| '-'
		| '.'
		| '..'
		| '!'
	>
	bracket: IToken<'bracket', '[' | ']' | '{' | '}' | '(' | ')'>
	comment: IToken<'comment', string>
	newline: IToken<'newline', '\n' | '|'>
	number: IToken<'number', string>
	int: IToken<'int', string> & {
		identifier?: NumberTypeIdentifier
	}
	float: IToken<'float', string> & {
		identifier?: NumberTypeIdentifier
	}
	boolean: IToken<'boolean', 'true' | 'false'>
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
CHARS.newline = '\n\r|'
CHARS.number = numbers
CHARS.bracket = '[]{}()'
CHARS.control = `:,$#@/\\=*<>%+~^-.!;`
CHARS.whitespace = `\t\r\n `
CHARS.word = `${alphabet}${alphabet.toUpperCase()}${numbers}_`

export const COMP = {
	quotes: genComparison(CHARS.quotes),
	newline: genComparison(CHARS.newline),
	number: genComparison(CHARS.number),
	bracket: genComparison(CHARS.bracket),
	control: genComparison(CHARS.control),
	whitespace: genComparison(CHARS.whitespace),
	word: genComparison(CHARS.word),
}

function collectComment(s: StringStream): ITokens['comment'] {
	const { line, column } = s
	s.consume()
	const value = s.collectWhile(s => !COMP.newline(s.itemCode) || s.item === '|')
	return {
		type: 'comment',
		value,
		line,
		column,
	}
}

function collectSpace(s: StringStream): ITokens['space'] {
	const { line, column } = s
	const value = s.collectWhile(s => s.item === ' ')
	return {
		type: 'space',
		value,
		line,
		column,
	}
}

function collectLiteral(
	s: StringStream,
	startValue: string = ''
): ITokens['literal'] | ITokens['boolean'] {
	const { line, column } = s
	const value = startValue + s.collectWhile(s => COMP.word(s.itemCode))
	// REVIEW - Is this needed?
	if (COMP.word(s.itemCode)) throwTokenError(s, `Expected word to end but found ${s.item}`)
	// Return Boolean instead
	if (value === 'true') return { type: 'boolean', value: 'true', line, column }
	else if (value === 'false') return { type: 'boolean', value: 'false', line, column }

	return { type: 'literal', value, line, column }
}

function collectUnknown(s: StringStream): ITokens['unknown'] {
	const { line, column } = s
	const value = s.collect()!
	return { type: 'unknown', value, line, column }
}

function collectNumber(
	s: StringStream
): ITokens['number'] | ITokens['literal'] | ITokens['control'] {
	const { line, column } = s
	let value = s.collectWhile(s => COMP.number(s.itemCode))

	return {
		type: 'number',
		value: value,
		line,
		column,
	}
}

function collectNewline(s: StringStream): ITokens['newline'] {
	const { line, column } = s
	if (s.item === '\r') s.consume() // Windows moment
	const value = s.item as ITokens['newline']['value']
	s.consumeWhile(s => COMP.newline(s.itemCode))
	return { type: 'newline', value, line, column }
}

function collectControl(s: StringStream): ITokens['control'] | ITokens['literal'] {
	const { line, column } = s
	const value = s.collect()! as ITokens['control']['value']

	return {
		type: 'control',
		value,
		line,
		column,
	}
}

function collectBracket(s: StringStream): ITokens['bracket'] {
	const { line, column } = s
	const value = s.collect()! as ITokens['bracket']['value']

	return {
		type: 'bracket',
		value,
		line,
		column,
	}
}

function collectQuotedString(s: StringStream): ITokens['quotedString'] {
	const { line, column } = s
	const bracket = s.collect()! as ITokens['quotedString']['bracket']
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
	s: StringStream,
	customTokenizer?: (s: StringStream, tokens: AnyToken[]) => boolean | undefined
): AnyToken[] {
	const tokens: AnyToken[] = []

	if (s.item === '#') tokens.push(collectComment(s))
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
		} else if (COMP.number(s.itemCode)) {
			tokens.push(collectNumber(s))
		} else if (COMP.word(s.itemCode)) {
			tokens.push(collectLiteral(s))
		} else if (s.item === '\t') {
			s.consume()
		} else {
			tokens.push(collectUnknown(s))
			// throwTokenError(s, `Unexpected character '${s.item}'`)
		}
	}

	return tokens
}
