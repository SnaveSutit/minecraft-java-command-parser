import * as fs from 'fs'
import { throwSyntaxError, throwTokenError } from '../errors'
import { GenericStream } from '../util/genericStream'
import { AnyToken, ITokens } from '../tokenizers/vanillaTokenizer'
import { AnyExecuteSubCommand } from '../commands/vanillaCommands/executeCommand'
import { AnyCommandSyntaxToken, parseGenericCommand } from '../commands/vanillaCommands'
import { StringStream } from '../util/stringStream'

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
	operation: ISyntaxToken<'operation'> & {
		value: '<=' | '<' | '=' | '>' | '>='
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
	intRange:
		| (ISyntaxToken<'intRange'> & {
				min?: ISyntaxTokens['int']
				max?: ISyntaxTokens['int']
		  })
		| ISyntaxToken<'int'>
	floatRange:
		| (ISyntaxToken<'floatRange'> & {
				min?: ISyntaxTokens['float']
				max?: ISyntaxTokens['float']
		  })
		| ISyntaxToken<'float'>
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
		x?: ISyntaxTokens['int'] | ISyntaxTokens['float']
		xSpace?: '~' | '^'
		z?: ISyntaxTokens['int'] | ISyntaxTokens['float']
		zSpace?: '~' | '^'
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
 * Wraps a function in a try-catch statement. Allows for descriptive recursive parser error messages
 */
export function createCatchFunc<Args extends any[], Ret>(
	errMessage: string,
	fn: (...args: Args) => Ret
) {
	return (...args: Args): Ret => {
		try {
			return fn(...args)
		} catch (e: any) {
			throw Error(errMessage + '\n\t' + e.message)
		}
	}
}

/**
 * Wraps a function in a try-catch statement. Allows for descriptive recursive parser error messages
 */
export function createTokenizerFunc<Args extends any[], Ret>(
	errMessage: string,
	fn: (s: StringStream, ...args: Args) => Ret
) {
	return (s: StringStream, ...args: Args): Ret => {
		const { line, column } = s
		try {
			return fn(s, ...args)
		} catch (e: any) {
			throwTokenError(s, errMessage + '\n\t' + e.message, line, column)
		}
	}
}

/**
 * Wraps a function in a try-catch statement. Allows for descriptive recursive parser error messages
 */
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

/**
 * Consumes all tokens of the given type
 */
export function consumeAll<T extends keyof ITokens>(s: TokenStream, tokenType: T): void {
	while (s.item?.type === tokenType) s.consume()
}

/**
 * Collects all tokens of the given type
 */
export function collectAll<T extends keyof ITokens>(s: TokenStream, tokenType: T): ITokens[T][] {
	const tokens: ITokens[T][] = []
	while (s.item?.type === tokenType) tokens.push(s.consume()! as ITokens[T])
	return tokens
}

/**
 * Asserts that s.item is the expected type. If not, throws a MinecraftSyntaxError
 */
export function assertTypeAndConsume<Type extends keyof ITokens>(
	s: TokenStream,
	expectedType: Type
): void {
	if (s.item?.type !== expectedType)
		throwSyntaxError(s.item, `Expected '${expectedType}' at %POS but found %TOKEN instead`)
	s.consume()
}
/**
 * Asserts that s.item is the expected type then returns it. If not, throws a MinecraftSyntaxError
 */
export function assertTypeAndCollect<Type extends keyof ITokens>(
	s: TokenStream,
	expectedType: Type | Type[]
): ITokens[Type] {
	if (typeof expectedType === 'string' && s.item?.type !== expectedType)
		throwSyntaxError(s.item, `Expected '${expectedType}' at %POS but found %TOKEN instead`)
	else if (Array.isArray(expectedType) && !expectedType.includes(s.item?.type as any))
		throwSyntaxError(
			s.item,
			'Expected one of ' + expectedType.join(', ') + ' at %POS but found %TOKEN instead'
		)

	return s.collect() as ITokens[Type]
}

/**
 * Asserts that s.item is the expected type and value. If not, throws a MinecraftSyntaxError
 */
export function assertValueAndConsume<
	Type extends keyof ITokens,
	Value extends ITokens[Type]['value']
>(s: TokenStream, expectedType: Type, expectedValue: Value): void {
	if (s.item?.type !== expectedType && s.item?.value !== expectedValue)
		throwSyntaxError(
			s.item,
			`Expected ${expectedType}:'${expectedValue}' at %POS but found %TOKEN instead`
		)
	s.consume()
}

/**
 * Asserts that s.item is the expected type and value then returns it. If not, throws a MinecraftSyntaxError
 */
export function assertValueAndCollect<
	Type extends keyof ITokens,
	Value extends ITokens[Type]['value']
>(
	s: TokenStream,
	expectedType: Type,
	expectedValue: Value | Value[]
): ITokens[Type] & { value: Value } {
	if (
		typeof expectedValue === 'string' &&
		s.item?.type !== expectedType &&
		s.item?.value !== expectedValue
	)
		throwSyntaxError(
			s.item,
			`Expected ${expectedType}:'${expectedValue}' at %POS but found %TOKEN instead`
		)
	else if (
		Array.isArray(expectedValue) &&
		s.item?.type !== expectedType &&
		!expectedValue.includes(s.item?.value as any)
	)
		throwSyntaxError(
			s.item,
			`Expected ${expectedType}:'${expectedValue}' at %POS but found %TOKEN instead`
		)
	return s.collect() as ITokens[Type] & { value: Value }
}

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
	let lastItem: AnyToken | undefined

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
	let tree
	try {
		tree = firstPass(tokens, customFirstPass)
	} catch (e: any) {
		throwSyntaxError(undefined, 'Unexpected error parsing Tokens (first pass):\n\t' + e.message)
	}

	// TODO Remove this debug line
	// fs.writeFileSync('./debug/firstPassSyntaxTree.json', JSON.stringify(tree, null, '\t'))

	try {
		return secondPass(tree, customSecondPass)
	} catch (e: any) {
		throwSyntaxError(
			undefined,
			'Unexpected Error parsing Commands (second pass):\n\t' + e.message
		)
	}
}
