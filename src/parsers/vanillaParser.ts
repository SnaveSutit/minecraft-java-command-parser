import { throwSyntaxError, throwTokenError } from '../errors'
import {
	AnyCommandSyntaxToken,
	ICommandSyntaxTokens,
	parseExecuteCommand,
} from '../commands/vanillaCommands'
import { AnyToken, ITokens } from '../tokenizers/vanillaTokenizer'
import { GenericStream } from '../util/genericStream'

export type SelectorChar = 'a' | 'e' | 'r' | 's' | 'p'
export type NumberTypeIdentifier = 's' | 'b' | 't' | 'f' | 'd' | 'l'

export interface ISyntaxToken<T> {
	type: T
	line: number
	column: number
}

export type AnySyntaxToken = ISyntaxTokens[keyof ISyntaxTokens] | AnyCommandSyntaxToken

export type AnyNBTSyntaxToken =
	| ISyntaxTokens['nbtList']
	| ISyntaxTokens['nbtObject']
	| ISyntaxTokens['int']
	| ISyntaxTokens['float']
	| ISyntaxTokens['literal']
	| ISyntaxTokens['quotedString']

export interface ISyntaxTokens {
	literal: ISyntaxToken<'literal'> & {
		value: string
	}
	quotedString: ISyntaxToken<'quotedString'> & {
		value: string
		bracket: '"' | "'"
	}
	uuid: ISyntaxToken<'uuid'> & {
		value: string
	}
	int: ISyntaxToken<'int'> & {
		value: number
		identifier?: NumberTypeIdentifier
	}
	float: ISyntaxToken<'float'> & {
		value: number
		identifier?: NumberTypeIdentifier
	}
	intRange: ISyntaxToken<'intRange'> & {
		min?: ISyntaxTokens['int']
		max?: ISyntaxTokens['int']
	}
	floatRange: ISyntaxToken<'floatRange'> & {
		min?: ISyntaxTokens['float']
		max?: ISyntaxTokens['float']
	}
	targetSelector: ISyntaxToken<'targetSelector'> &
		(
			| {
					targetType: 'literal'
					value: ISyntaxTokens['literal']
			  }
			| {
					targetType: 'selector'
					selectorChar: SelectorChar
					args: Record<string, AnySyntaxToken>
			  }
			| {
					targetType: 'uuid'
					value: ISyntaxTokens['uuid']
			  }
		)
	vec2: ISyntaxToken<'vec2'> & {
		x: ISyntaxTokens['int'] | ISyntaxTokens['float']
		xSpaceMod?: '~' | '^'
		y: ISyntaxTokens['int'] | ISyntaxTokens['float']
		ySpaceMod?: '~' | '^'
	}
	vec3: ISyntaxToken<'vec3'> & {
		x: ISyntaxTokens['int'] | ISyntaxTokens['float']
		xSpaceMod?: '~' | '^'
		y: ISyntaxTokens['int'] | ISyntaxTokens['float']
		ySpaceMod?: '~' | '^'
		z: ISyntaxTokens['int'] | ISyntaxTokens['float']
		zSpaceMod?: '~' | '^'
	}
	resourceLocation: ISyntaxToken<'resourceLocation'> & {
		namespace: string
		path: string
	}
	block: ISyntaxToken<'block'> & {
		namespace: string
		block: string
		blockstate?: ISyntaxTokens['blockstate']
		nbt?: ISyntaxTokens['nbtObject']
	}
	blockstate: ISyntaxToken<'blockstate'> & {
		states: Record<string, ISyntaxTokens['literal']>
	}
	nbtObject: ISyntaxToken<'nbtObject'> & {
		value: Record<string, AnyNBTSyntaxToken>
	}
	nbtList: ISyntaxToken<'nbtList'> & {
		items: AnyNBTSyntaxToken[]
	}
	nbtPath: ISyntaxToken<'nbtPath'> & {
		value: string
	}
	scoreObject: ISyntaxToken<'scoreObject'> & {
		scores: Record<string, ISyntaxTokens['int'] | ISyntaxTokens['intRange']>
	}
}

export class TokenStream extends GenericStream<AnyToken> {}

export function consumeAll<T extends AnyToken>(s: TokenStream, tokenType: T['type']): void {
	while (s.item?.type === tokenType) s.consume()
}

export function collectAll<T extends AnyToken>(s: TokenStream, tokenType: T['type']): T[] {
	const tokens: T[] = []
	while (s.item?.type === tokenType) tokens.push(s.consume()! as T)
	return tokens
}

export function expectAndConsume<T extends AnyToken>(
	s: TokenStream,
	expectedType: T['type'],
	expectedValue?: T['value']
): T {
	const token = s.collect()
	if (token?.type !== expectedType)
		throwSyntaxError(
			token!,
			`Expected '${expectedType}' at %POS but found ${token?.type}:${token?.value} instead`
		)
	else if (expectedValue != undefined && token.value != expectedValue) {
		throwSyntaxError(
			token!,
			`Expected ${expectedType}:'${expectedValue}' at %POS but found ${token.type}:'${token.value}' instead`
		)
	}
	return token as T
}

export function parseGenericCommand(s: TokenStream): AnySyntaxToken {
	const name = s.item as ITokens['literal']
	switch (name.value as ICommandSyntaxTokens[keyof ICommandSyntaxTokens]['name']) {
		case 'execute':
			return parseExecuteCommand(s)
		default:
			break
	}

	// Unknown command
	const { line, column } = s.item!
	const tokens: AnyToken[] = [s.consume()!] // Consume command name and add it to the token list
	expectAndConsume(s, 'space')

	while (s.item) {
		if (s.item.type === 'newline') break
		if (s.item.value) {
			tokens.push(s.item)
		}
		s.consume()
	}
	return {
		type: 'command',
		name: 'unknown',
		content: tokens.map(v => String(v.value)).join(''),
		line,
		column,
	}
}

function combineRepeatedAdjacentControlsIntoLiteral(s: TokenStream, newTokens: AnyToken[]): void {
	const { line, column } = s.item!
	let value = (s.collect() as ITokens['control']).value

	while (s.item?.type === 'control' || s.item?.type === 'literal') {
		value += s.item.value
		s.consume()
	}

	newTokens.push({
		type: 'literal',
		value,
		line,
		column,
	})
}

// TODO (number) => int | float | literal
function combineNumbersIntoIntFloatOrLiteral(s: TokenStream, newTokens: AnyToken[]): void {
	const { line, column } = s.item!
	let value = ''
	let signed = false
	let type: 'int' | 'float' = 'int'

	if (s.item?.type === 'control' && s.item.value === '-') {
		s.consume()
		signed = true
		value += '-'
	}

	if (s.item?.type === 'number') {
		value += String(s.item.value)
	}

	if (s.item?.type === 'control' && s.item.value === '.') {
		type = 'float'
		value += '.'
	}

	newTokens.push({
		type,
		value: Number(value),
		line,
		column,
	})
}

function firstPass(
	tokens: AnyToken[],
	customFirstPass?: (stream: TokenStream, newTokens: AnyToken[]) => boolean
) {
	const newTokens: AnyToken[] = []
	const s = new TokenStream(tokens)

	while (s.item) {
		if (customFirstPass && customFirstPass(s, newTokens)) {
		} else if (s.item.type === 'number') {
			combineNumbersIntoIntFloatOrLiteral(s, newTokens)
		} else if (s.item.type === 'control') {
			switch (s.next?.type) {
				case 'number':
					combineNumbersIntoIntFloatOrLiteral(s, newTokens)
					break
				case 'control':
					combineRepeatedAdjacentControlsIntoLiteral(s, newTokens)
					break
				default:
					newTokens.push(s.item)
					s.consume()
					break
			}
		} else {
			newTokens.push(s.item)
			s.consume()
		}
	}

	return newTokens
}

function secondPass(
	tokens: AnyToken[],
	customSecondPass?: (stream: TokenStream, syntaxTree: AnySyntaxToken[]) => boolean
): AnySyntaxToken[] {
	const syntaxTree: AnySyntaxToken[] = []
	const s = new TokenStream(tokens)

	while (s.item) {
		if (customSecondPass && customSecondPass(s, syntaxTree)) {
		} else if (s.item?.type === 'newline') {
			s.consume()
		} else if (s.item?.type === 'comment') {
			s.consume()
		} else if (s.item?.type === 'literal') {
			syntaxTree.push(parseGenericCommand(s))
		} else
			throwSyntaxError(s.item, `Unexpected Token '${s.item.value}'(${s.item.type}) at %POS`)
	}

	return syntaxTree
}

export function parse(
	tokens: AnyToken[],
	customFirstPass?: (stream: TokenStream, newTokens: AnyToken[]) => boolean,
	customSecondPass?: (stream: TokenStream, syntaxTree: AnySyntaxToken[]) => boolean
): AnySyntaxToken[] {
	let tree = firstPass(tokens, customFirstPass)
	return secondPass(tree, customSecondPass)
}
