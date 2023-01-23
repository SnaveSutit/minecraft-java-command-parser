import { throwSyntaxError, throwTokenError } from '../errors'
import {
	AnyCommandSyntaxToken,
	AnyExecuteSubCommand,
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

export type AnySyntaxToken =
	| ISyntaxTokens[keyof ISyntaxTokens]
	| AnyCommandSyntaxToken
	| AnyExecuteSubCommand

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
		value: string
		identifier?: NumberTypeIdentifier
	}
	float: ISyntaxToken<'float'> & {
		value: string
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
					args: ISyntaxTokens['targetSelectorArgument'][]
			  }
			| {
					targetType: 'uuid'
					value: ISyntaxTokens['uuid']
			  }
		)
	targetSelectorArgument: ISyntaxToken<'targetSelectorArgument'> & {
		// TODO Add all known selector arguments to this type
		key: string
		value: AnySyntaxToken | undefined
		inverted: boolean
	}
	boolean: ISyntaxToken<'boolean'> & {
		value: boolean
	}
	advancementObject: ISyntaxToken<'advancementObject'> & {
		advancements: Map<ISyntaxTokens['resourceLocation'], ISyntaxTokens['boolean']>
	}
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
			`Expected '${expectedType}' at %POS but found ${token?.type}:'${token?.value}' instead`
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
	const commandName = s.collect()!
	const tokens: AnyToken[] = []
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
		commandName: commandName.value,
		tokens: tokens,
		line,
		column,
	}
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
		value += s.item.value
		s.consume()
	}

	if (s.item?.type === 'control' && s.item.value === '.') {
		if (s.next?.type === 'control' && s.next?.value === '.') {
			// This is an int in front of a range operator.
		} else {
			type = 'float'
			value += '.'
			s.consume()

			if ((s.item as AnyToken)?.type === 'number') {
				value += s.item.value
				s.consume()
			}
		}
	}

	newTokens.push({
		type,
		value: value,
		line,
		column,
	})
}

function parseRangeOperator(s: TokenStream, newTokens: AnyToken[]) {
	const { line, column } = s.item!
	s.consume()
	s.consume()

	newTokens.push({
		type: 'control',
		value: '..',
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
			if (s.item.value === '.' && s.next?.type === 'control' && s.next?.value === '.') {
				parseRangeOperator(s, newTokens)
			} else if (
				(s.item.value === '-' || s.item.value === '.') &&
				s.next?.type === 'number'
			) {
				combineNumbersIntoIntFloatOrLiteral(s, newTokens)
			} else {
				newTokens.push(s.item)
				s.consume()
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
		} else throwSyntaxError(s.item, `Unexpected Token ${s.item.type}:'${s.item.value}' at %POS`)
	}

	return syntaxTree
}

import * as fs from 'fs'

export function parse(
	tokens: AnyToken[],
	customFirstPass?: (stream: TokenStream, newTokens: AnyToken[]) => boolean,
	customSecondPass?: (stream: TokenStream, syntaxTree: AnySyntaxToken[]) => boolean
): AnySyntaxToken[] {
	let tree = firstPass(tokens, customFirstPass)
	// TODO Remove this debug line
	fs.writeFileSync('./debug/firstPassSyntaxTree.json', JSON.stringify(tree, null, '\t'))
	return secondPass(tree, customSecondPass)
}
