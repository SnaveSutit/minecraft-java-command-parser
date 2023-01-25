import * as fs from 'fs'
import { throwSyntaxError } from '../errors'
import { GenericStream } from '../util/genericStream'
import { AnyToken, ITokens } from '../tokenizers/vanillaTokenizer'
import { AnyExecuteSubCommand } from '../commands/vanillaCommands/executeCommand'
import { AnyCommandSyntaxToken, parseGenericCommand } from '../commands/vanillaCommands'

export type SelectorChar = 'a' | 'e' | 'r' | 's' | 'p'
export type NumberTypeIdentifier = 's' | 'b' | 't' | 'f' | 'd' | 'l' | 'S' | 'B' | 'F' | 'L'

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
	space: ISyntaxToken<'space'> & ITokens['space']
	control: ISyntaxToken<'control'> & ITokens['control']
	bracket: ISyntaxToken<'bracket'> & ITokens['bracket']
	newline: ISyntaxToken<'newline'> & ITokens['newline']
	literal: ISyntaxToken<'literal'> & {
		value: string
	}
	quotedString: ISyntaxToken<'quotedString'> & {
		value: string
		bracket: '"' | "'"
	}
	unquotedString: ISyntaxToken<'unquotedString'> & {
		value: string
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
		value: 'true' | 'false'
	}
	advancementObject: ISyntaxToken<'advancementObject'> & {
		advancements: Map<ISyntaxTokens['resourceLocation'], ISyntaxTokens['boolean']>
	}
	vec2: ISyntaxToken<'vec2'> & {
		x: ISyntaxTokens['int'] | ISyntaxTokens['float']
		xSpace?: '~' | '^'
		y: ISyntaxTokens['int'] | ISyntaxTokens['float']
		ySpace?: '~' | '^'
	}
	vec3: ISyntaxToken<'vec3'> & {
		x?: ISyntaxTokens['int'] | ISyntaxTokens['float']
		xSpace?: '~' | '^'
		y?: ISyntaxTokens['int'] | ISyntaxTokens['float']
		ySpace?: '~' | '^'
		z?: ISyntaxTokens['int'] | ISyntaxTokens['float']
		zSpace?: '~' | '^'
	}
	resourceLocation: ISyntaxToken<'resourceLocation'> & {
		namespace: string
		path: string
	}
	block: ISyntaxToken<'block'> & {
		block: ISyntaxTokens['resourceLocation']
		blockstate?: ISyntaxTokens['blockstate']
		nbt?: ISyntaxTokens['nbtObject']
	}
	blockstate: ISyntaxToken<'blockstate'> & {
		states: Record<
			string,
			ISyntaxTokens['literal'] | ISyntaxTokens['int'] | ISyntaxTokens['boolean']
		>
	}
	nbtObject: ISyntaxToken<'nbtObject'> & {
		value: Record<string, AnyNBTSyntaxToken>
	}
	nbtList: ISyntaxToken<'nbtList'> & {
		itemType?: 'byte' | 'int' | 'long'
		items: AnyNBTSyntaxToken[]
	}
	nbtPath: ISyntaxToken<'nbtPath'> & {
		parts: AnySyntaxToken[]
	}
	scoreObject: ISyntaxToken<'scoreObject'> & {
		scores: Record<string, ISyntaxTokens['int'] | ISyntaxTokens['intRange']>
	}
}

export class TokenStream extends GenericStream<AnyToken> {}

/**
 * Wraps a function in a try-catch statement. Allows for descriptive recursive error messages
 * @param fn The function to execute
 * @returns
 */
export function catchFunction<Args extends any[], Ret, Err>(
	fn: (...args: Args) => Ret,
	onError: (e: Err) => never
) {
	return (...args: Args): Ret => {
		try {
			return fn(...args)
		} catch (e: any) {
			onError(e)
		}
	}
}

export function createParserFunc<Args extends any[], Ret>(
	errMessage: string,
	fn: (s: TokenStream, ...args: Args) => Ret
) {
	return (s: TokenStream, ...args: Args): Ret => {
		const item = s.item
		try {
			return fn(s, ...args)
		} catch (e: any) {
			throwSyntaxError(item, errMessage + '\n\t' + e.message)
		}
	}
}

export function consumeAll<T extends AnyToken>(s: TokenStream, tokenType: T['type']): void {
	while (s.item?.type === tokenType) s.consume()
}

export function collectAll<T extends AnyToken>(s: TokenStream, tokenType: T['type']): T[] {
	const tokens: T[] = []
	while (s.item?.type === tokenType) tokens.push(s.consume()! as T)
	return tokens
}

export function assertTypeAndConsume<T extends AnyToken>(
	s: TokenStream,
	expectedType: T['type']
): void {
	if (s.item?.type !== expectedType)
		throwSyntaxError(s.item, `Expected '${expectedType}' at %POS but found %TOKEN instead`)
	s.consume()
}

export function assertTypeAndCollect<T extends AnyToken>(
	s: TokenStream,
	expectedType: T['type']
): T {
	if (s.item?.type !== expectedType)
		throwSyntaxError(s.item, `Expected '${expectedType}' at %POS but found %TOKEN instead`)
	return s.collect() as T
}

export function assertValueAndConsume<T extends AnyToken>(
	s: TokenStream,
	expectedType: T['type'],
	expectedValue: T['value']
): void {
	if (s.item?.type !== expectedType && s.item?.value !== expectedValue)
		throwSyntaxError(
			s.item,
			`Expected ${expectedType}:'${expectedValue}' at %POS but found %TOKEN instead`
		)
	s.consume()
}

export function assertValueAndCollect<T extends AnyToken>(
	s: TokenStream,
	expectedType: T['type'],
	expectedValue: T['value']
): T {
	if (s.item?.type !== expectedType && s.item?.value !== expectedValue)
		throwSyntaxError(
			s.item,
			`Expected ${expectedType}:'${expectedValue}' at %POS but found %TOKEN instead`
		)
	return s.collect() as T
}

// export function parseGenericCommand(s: TokenStream): AnySyntaxToken {
// 	const name = s.item as ITokens['literal']
// 	switch (name.value as ICommandSyntaxTokens[keyof ICommandSyntaxTokens]['name']) {
// 		case 'execute':
// 			return parseExecuteCommand(s)
// 		default:
// 			break
// 	}

// 	// Unknown command
// 	const { line, column } = s.item!
// 	const commandName = s.collect()!
// 	const tokens: AnyToken[] = []
// 	assertTypeAndConsume(s, 'space')

// 	while (s.item) {
// 		if (s.item.type === 'newline') break
// 		if (s.item.value) {
// 			tokens.push(s.item)
// 		}
// 		s.consume()
// 	}
// 	return {
// 		type: 'command',
// 		name: 'unknown',
// 		commandName: commandName.value,
// 		tokens: tokens,
// 		line,
// 		column,
// 	}
// }

function squashLiteral(s: TokenStream, value = ''): ISyntaxTokens['literal'] {
	const { line, column } = s.item!
	value += s.collect()!.value
	while (s.item) {
		switch (s.item.type) {
			case 'int':
			case 'float':
			case 'number':
			case 'literal':
			case 'boolean':
				value += s.collect()!.value
				break
			case 'control':
				switch (s.item.value) {
					case '.':
					case '-':
					case '+':
						value += s.collect()!.value
						break
					default:
						return { type: 'literal', value, line, column }
				}
			default:
				return { type: 'literal', value, line, column }
		}
	}

	return { type: 'literal', value, line, column }
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

	let identifier
	if (s.item?.type === 'literal') {
		switch (s.item.value.toLowerCase() as NumberTypeIdentifier) {
			case 'b':
			case 'd':
			case 'f':
			case 'l':
			case 's':
			case 't':
				identifier = s.collect()!.value as NumberTypeIdentifier
				break
			default:
				newTokens.push(squashLiteral(s, value))
				return
		}
	}

	newTokens.push({
		type,
		value: value,
		identifier,
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
		} else throwSyntaxError(s.item, `Unexpected Token %TOKEN at %POS`)
	}

	return syntaxTree
}

export function parse(
	tokens: AnyToken[],
	customFirstPass?: (stream: TokenStream, newTokens: AnyToken[]) => boolean,
	customSecondPass?: (stream: TokenStream, syntaxTree: AnySyntaxToken[]) => boolean
): AnySyntaxToken[] {
	try {
		let tree = firstPass(tokens, customFirstPass)
		// TODO Remove this debug line
		fs.writeFileSync('./debug/firstPassSyntaxTree.json', JSON.stringify(tree, null, '\t'))
		return secondPass(tree, customSecondPass)
	} catch (e: any) {
		throwSyntaxError(undefined, 'Unexpected Error while parsing Tokens:\n\t' + e.message)
	}
}
