import { throwSyntaxError, throwTokenError } from '../errors'
import {
	AnyNBTSyntaxToken,
	AnySyntaxToken,
	assertTypeAndCollect,
	assertTypeAndConsume,
	assertValueAndCollect,
	assertValueAndConsume,
	consumeAll,
	createParserFunc,
	ISyntaxToken,
	ISyntaxTokens,
	SelectorChar,
	TokenStream,
} from '../parsers/vanillaParser'
import { AnyToken, ITokens } from '../tokenizers/vanillaTokenizer'
import { tokenToString } from '../util'
import { AnyExecuteSubCommand, parseExecuteCommand } from './vanillaCommands/executeCommand'

export interface ISyntaxTokenCommand<N> extends ISyntaxToken<'command'> {
	name: N
}

export type AnyCommandSyntaxToken = ICommandSyntaxTokens[keyof ICommandSyntaxTokens]

export interface ICommandSyntaxTokens {
	unknown: ISyntaxTokenCommand<'unknown'> & {
		tokens: AnyToken[]
		commandName: string
	}
	execute: ISyntaxTokenCommand<'execute'> & {
		subCommands: AnyExecuteSubCommand[]
	}
	schedule: ISyntaxTokenCommand<'schedule'> &
		(
			| {
					modeBranch: 'clear'
					functionName: ISyntaxTokens['resourceLocation']
			  }
			| {
					modeBranch: 'function'
					functionName: ISyntaxTokens['resourceLocation']
					time?: ISyntaxTokens['int' | 'float']
					replaceMode?: 'replace' | 'append'
			  }
		)
}

export function isEndOfCommand(s: TokenStream): boolean {
	if (s.item?.type === 'newline') return true
	return false
}

export function assertEndOfArg(s: TokenStream) {
	if (s.item === undefined || s.item?.type === 'newline' || s.item?.type === 'space') return
	throwSyntaxError(s.item, 'Expected end of argument at %POS but found %TOKEN instead.')
}

export function assertAndConsumeEndOfArg(s: TokenStream) {
	if (s.item === undefined || s.item?.type === 'newline' || s.item?.type === 'space')
		return s.collect()
	throwSyntaxError(s.item, 'Expected end of argument at %POS but found %TOKEN instead.')
}

export function parseRange<T extends 'int' | 'float'>(
	s: TokenStream,
	numberType: T
): ISyntaxTokens[T] | ISyntaxTokens[`${T}Range`] {
	const { line, column } = s.item!
	// Value could be:
	// (num)
	// (num)(..)
	// (..)(num)
	// (num)(..)(num)

	// (num)
	if (s.item?.type === 'int' || (s.item?.type === 'float' && numberType === 'float')) {
		const min = s.collect() as ISyntaxTokens[T]
		// (num)(..)
		if ((s.item as AnyToken)?.type === 'control' && s.item?.value === '..') {
			// console.log(tokenToString(s.item), '(num)(..)')
			s.consume()
			let max
			// (num)(..)(num)
			if (s.item?.type === 'int' || (s.item?.type === 'float' && numberType === 'float')) {
				max = s.collect()
				// console.log(tokenToString(s.item), '(num)(..)(num)')
			}

			return {
				type: `${numberType}Range`,
				min,
				max,
				line,
				column,
			} as unknown as ISyntaxTokens[`${T}Range`]
		}
		// (num)
		// console.log(tokenToString(s.item), '(num)')
		return {
			type: numberType,
			value: min.value,
			line,
			column,
		} as unknown as ISyntaxTokens[T]
	} else if (s.item?.type === 'control' && s.item.value === '..') {
		s.consume()
		// (..)(num)
		// console.log(tokenToString(s.item), '(..)(num)')
		if (
			(s.item as AnyToken)?.type === 'int' ||
			((s.item as AnyToken)?.type === 'float' && numberType === 'float')
		) {
			return {
				type: `${numberType}Range`,
				max: s.collect() as AnyToken as ISyntaxTokens[T],
				line,
				column,
			} as unknown as ISyntaxTokens[`${T}Range`]
		}
	}
	throwSyntaxError(s.item!, `Expected ${numberType} at %POS but found %TOKEN instead.`)
}

export function parseScoreObject(s: TokenStream): ISyntaxTokens['scoreObject'] {
	const { line, column } = s.item!
	const scores: Record<string, ISyntaxTokens['int'] | ISyntaxTokens['intRange']> = {}
	assertValueAndConsume(s, 'bracket', '{')
	consumeAll(s, 'space')
	while (s.item) {
		if (s.item.type === 'bracket' && s.item.value === '}') break
		consumeAll(s, 'space')
		const key = parseUnquotedString(s)
		assertValueAndConsume(s, 'control', '=')
		scores[key.value] = parseRange(s, 'int')
		if (s.item.type === 'control' && s.item.value === ',') s.consume()
	}
	assertValueAndConsume(s, 'bracket', '}')

	return {
		type: 'scoreObject',
		scores,
		line,
		column,
	}
}

export function parseAdvancementObject(s: TokenStream): ISyntaxTokens['advancementObject'] {
	const { line, column } = s.item!
	const advancements = new Map<ISyntaxTokens['resourceLocation'], ISyntaxTokens['boolean']>()
	assertValueAndConsume(s, 'bracket', '{')
	while (s.item) {
		if (s.item.type === 'bracket' && s.item.value === '}') break
		consumeAll(s, 'space')
		// console.log(s.item)
		const key = parseResourceLocation(s, false)
		assertValueAndConsume(s, 'control', '=')
		advancements.set(key, assertTypeAndCollect(s, 'boolean'))
		if (s.item.type === 'control' && s.item.value === ',') s.consume()
	}
	assertValueAndConsume(s, 'bracket', '}')

	return {
		type: 'advancementObject',
		advancements,
		line,
		column,
	}
}

export const parseResourceLocation = createParserFunc(
	'at ResourceLocation at %POS',
	function (s: TokenStream, allowTag: boolean): ISyntaxTokens['resourceLocation'] {
		const { line, column } = s.item!
		let namespace = ''
		let path = ''

		// Allow tag resource locations
		if (s.item?.type === 'control') {
			if (!(allowTag && s.item.value === '#'))
				throwSyntaxError(s.item, `Unexpected %TOKEN starting resourceLocation at %POS`)
			namespace += '#'
			s.consume()
		}

		namespace += assertTypeAndCollect(s, 'literal').value
		if (!(s.item?.type === 'control' && s.item.value === ':')) {
			switch (s.item?.type) {
				case 'space':
				case 'bracket':
				case 'newline':
					return {
						type: 'resourceLocation',
						namespace: '',
						path: namespace,
						line,
						column,
					}
				case 'control':
					if (s.item.value === ',')
						return {
							type: 'resourceLocation',
							namespace: '',
							path: namespace,
							line,
							column,
						}
				default:
					throwSyntaxError(s.item, `Expected ':' at %POS but found %TOKEN instead.`)
			}
		}
		s.consume()

		while (s.item) {
			switch ((s.item as AnyToken).type) {
				case 'literal':
					path += s.collect()!.value
					continue
				case 'control':
					if ((s.item as AnyToken).value === '/') {
						path += s.collect()!.value
						continue
					}
					return { type: 'resourceLocation', namespace, path, line, column }
				case 'space':
				case 'bracket':
				case 'newline':
					return { type: 'resourceLocation', namespace, path, line, column }
			}
			throwSyntaxError(s.item, `Found unexpected %TOKEN at %POS`)
		}

		return { type: 'resourceLocation', namespace, path, line, column }
	}
)

export function parseUnquotedString(s: TokenStream): ISyntaxTokens['unquotedString'] {
	const { line, column } = s.item!
	let value = ''

	while (s.item) {
		switch (s.item.type) {
			case 'int':
			case 'float':
			case 'boolean':
			case 'literal':
				value += s.collect()!.value
				break
			case 'space':
			case 'bracket':
				return { type: 'unquotedString', value, line, column }
			case 'control':
				if (s.item.value === '.' || s.item.value === '-' || s.item.value === '+') {
					value += s.collect()!.value
					break
				} else return { type: 'unquotedString', value, line, column }
			default:
				throwSyntaxError(
					s.item,
					`Found unexpected %TOKEN at %POS while parsing unquotedString`
				)
		}
	}

	return { type: 'unquotedString', value, line, column }
}

export function parseNbtList(s: TokenStream): ISyntaxTokens['nbtList'] {
	// TODO Add typed array support
	const { line, column } = s.item!
	const items: ISyntaxTokens['nbtList']['items'] = []
	assertValueAndConsume(s, 'bracket', '[')
	consumeAll(s, 'space')
	let itemType: ISyntaxTokens['nbtList']['itemType'] | undefined
	if (s.item?.type === 'literal' && 'lbi'.includes(s.item.value.toLowerCase())) {
		switch (s.item.value.toLowerCase()) {
			case 'l':
				itemType = 'long'
				break
			case 'b':
				itemType = 'byte'
				break
			case 'i':
				itemType = 'int'
				break
		}
		s.consume()
		assertValueAndConsume(s, 'control', ';')
	}

	try {
		while (s.item) {
			if (s.item.type === 'bracket' && s.item.value === ']') break
			consumeAll(s, 'space')
			const item = _parseNbtValue(s)
			if (itemType) {
				switch (itemType) {
					case 'byte':
						if (
							!(
								item.type === 'int' &&
								(item.identifier === 'B' || item.identifier === 'b')
							)
						)
							throwSyntaxError(
								s.item,
								'Expected item in ByteArray to be a Byte but found %TOKEN instead at %POS.'
							)
						break
					case 'int':
						if (!(item.type === 'int' && item.identifier === undefined))
							throwSyntaxError(
								s.item,
								'Expected item in IntArray to be a Int but found %TOKEN instead at %POS.'
							)
						break
					case 'long':
						if (
							!(
								item.type === 'int' &&
								(item.identifier === 'L' || item.identifier === 'l')
							)
						)
							throwSyntaxError(
								s.item,
								'Expected item in LongArray to be a Long but found %TOKEN instead at %POS.'
							)
						break
				}
			}
			items.push(item)
			consumeAll(s, 'space')
			if (s.item.type === 'control' && s.item.value === ',') {
				s.consume()
				consumeAll(s, 'space')
			}
		}
	} catch (e: any) {
		if (e.name === 'MinecraftSyntaxError')
			throwSyntaxError(
				undefined,
				`Unexpected error while parsing nbtList at %POS\n\t${e.message}`,
				line,
				column
			)
		throw e
	}

	assertValueAndConsume(s, 'bracket', ']')

	return {
		type: 'nbtList',
		itemType,
		items,
		line,
		column,
	}
}

function _parseNbtValue(s: TokenStream): AnyNBTSyntaxToken {
	switch (s.item?.type) {
		case 'int':
		case 'float':
		case 'literal':
		case 'boolean':
		case 'quotedString':
			return s.collect() as AnyNBTSyntaxToken
		case 'bracket':
			if (s.item.value === '{') return parseNbtObject(s)
			else if (s.item.value === '[') return parseNbtList(s)
		default:
			throwSyntaxError(s.item, 'Unexpected %TOKEN at %POS')
	}
}

export function parseNbtObject(s: TokenStream): ISyntaxTokens['nbtObject'] {
	const { line, column } = s.item!
	const value: ISyntaxTokens['nbtObject']['value'] = {}
	assertValueAndConsume(s, 'bracket', '{')

	try {
		while (s.item) {
			if (s.item.type === 'bracket' && s.item.value === '}') break
			consumeAll(s, 'space')
			const key = parseUnquotedString(s)
			consumeAll(s, 'space')
			assertValueAndConsume(s, 'control', ':')
			consumeAll(s, 'space')
			value[key.value] = _parseNbtValue(s)
			consumeAll(s, 'space')
			if (s.item.type === 'control' && s.item.value === ',') {
				s.consume()
				consumeAll(s, 'space')
			}
		}
	} catch (e: any) {
		if (e.name === 'MinecraftSyntaxError') {
			throwSyntaxError(
				undefined,
				`Failed to parse NBT Object at %POS\n\t${e.message}`,
				line,
				column
			)
		}
	}

	assertValueAndConsume(s, 'bracket', '}')

	return {
		type: 'nbtObject',
		value,
		line,
		column,
	}
}

function _throwTargetSelectorArgumentCannotBeInverted(token: AnyToken | undefined, key: string) {
	throwSyntaxError(token, `Cannot invert TargetSelectorArgument '${key}' at %POS`)
}

function _parseTargetSelectorArgument(
	s: TokenStream,
	key: string,
	inverted: boolean,
	line: number,
	column: number
): AnySyntaxToken | undefined {
	switch (key) {
		case 'tag':
			if (s.item?.type === 'literal') return s.collect() as ISyntaxTokens['literal']
			else return undefined
		case 'team':
			if (s.item?.type === 'literal') return s.collect() as ISyntaxTokens['literal']
			else return undefined
		case 'x':
		case 'y':
		case 'z':
		case 'dx':
		case 'dy':
		case 'dz':
			if (inverted) _throwTargetSelectorArgumentCannotBeInverted(s.item, key)
			if ((s.item as AnyToken)?.type === 'int' || (s.item as AnyToken)?.type === 'float')
				return s.collect() as ISyntaxTokens['int'] | ISyntaxTokens['float']
			else _throwTargetSelectorArgumentCannotBeInverted(s.item, key)
		case 'distance':
			if (inverted) _throwTargetSelectorArgumentCannotBeInverted(s.item, key)
			return parseRange(s, 'float')
		case 'scores':
			if (inverted) _throwTargetSelectorArgumentCannotBeInverted(s.item, key)
			return parseScoreObject(s)
		case 'type':
			return parseResourceLocation(s, true)
		case 'predicate':
			return parseResourceLocation(s, false)
		case 'x_rotation':
		case 'y_rotation':
			if (inverted) _throwTargetSelectorArgumentCannotBeInverted(s.item, key)
			return parseRange(s, 'float')
		case 'limit':
		case 'level':
			return parseRange(s, 'int')
		case 'sort':
			if (s.item?.type === 'literal') {
				switch (s.item.value) {
					case 'random':
					case 'nearest':
					case 'furthest':
					case 'arbitrary':
						return s.collect()! as ISyntaxTokens['literal']
				}
			}
		case 'gamemode':
			if (s.item?.type === 'literal') {
				switch (s.item.value) {
					case 'survival':
					case 'creative':
					case 'adventure':
					case 'spectator':
						return s.collect()! as ISyntaxTokens['literal']
				}
			}
		case 'nbt':
			return parseNbtObject(s)
		case 'advancements':
			return parseAdvancementObject(s)
		case 'name':
			if (s.item?.type === 'quotedString') return s.collect() as ISyntaxTokens['quotedString']
			return parseUnquotedString(s)
		default:
			throwSyntaxError(s.item!, `Unknown selector argument '${key}' as %POS`, line, column)
	}
}

export function parseTargetSelectorArguments(
	s: TokenStream
): ISyntaxTokens['targetSelectorArgument'][] {
	const args: ISyntaxTokens['targetSelectorArgument'][] = []
	// Return no args if no bracket exists
	if (!(s.item?.type === 'bracket' && s.item.value === '[')) return args
	s.consume() // Consume opening bracket
	s.item = s.item as AnyToken
	while (s.item) {
		consumeAll(s, 'space')
		if (s.item.type === 'literal') {
			const { line, column } = s.item!
			let inverted = false
			const key = s.collect()! as ISyntaxTokens['literal']
			consumeAll(s, 'space')
			assertValueAndConsume(s, 'control', '=')
			consumeAll(s, 'space')
			if ((s.item as AnyToken)?.type === 'control' && s.item.value === '!') {
				s.consume()
				inverted = true
			}
			args.push({
				type: 'targetSelectorArgument',
				key: key.value,
				value: _parseTargetSelectorArgument(s, key.value, inverted, line, column),
				inverted,
				line,
				column,
			})
			consumeAll(s, 'space')
			if ((s.item as AnyToken).type === 'control' && s.item.value === ',') s.consume()
		} else if (s.item.type === 'bracket' && s.item.value === ']') {
			s.consume()
			return args
		} else {
			// console.log(args)
			throwSyntaxError(s.item, `Expected selector argument but found %TOKEN at %POS`)
		}
	}

	return args
}

export const parseTargetSelector = createParserFunc(
	'at targetSelector at %POS',
	(s: TokenStream, allowScoreboardName?: boolean): ISyntaxTokens['targetSelector'] => {
		const { line, column } = s.item!

		if (s.item?.type === 'control' && s.item.value === '@') {
			s.consume()
			let selectorChar: SelectorChar
			if ((s.item as AnyToken).type !== 'literal')
				throwSyntaxError(s.item, `Expected selector char at %POS but found %TOKEN instead`)
			selectorChar = s.collect()!.value as SelectorChar
			if (
				selectorChar !== 'a' &&
				selectorChar !== 'p' &&
				selectorChar !== 'r' &&
				selectorChar !== 's' &&
				selectorChar !== 'e'
			)
				throwSyntaxError(s.item, `Invalid selector char '${selectorChar}' at %POS`)
			const args = parseTargetSelectorArguments(s)
			return {
				type: 'targetSelector',
				targetType: 'selector',
				selectorChar,
				args,
				line,
				column,
			}
		} else {
			// FIXME Doesn't parse UUIDs
			let value: (ISyntaxTokens['targetSelector'] & { targetType: 'literal' })['value']
			if (allowScoreboardName) value = parseScoreboardName(s)
			else value = parsePlayerName(s)

			return {
				type: 'targetSelector',
				targetType: 'literal',
				value,
				line,
				column,
			}
		}
	}
)

export function parseSwizzle(s: TokenStream): string {
	const swizzle = assertTypeAndCollect(s, 'literal').value
	const xCount = swizzle.split('x').length - 1
	const yCount = swizzle.split('y').length - 1
	const zCount = swizzle.split('z').length - 1

	if (xCount < 1 || xCount > 1 || yCount < 1 || yCount > 1 || zCount < 1 || zCount > 1)
		throwSyntaxError(s.item, `Invalid swizzle '${swizzle}' at %POS`)

	return swizzle
}

type VecAxis = {
	value?: ISyntaxTokens['int' | 'float']
	space?: '~' | '^'
}
export function parseVecAxis(s: TokenStream): VecAxis {
	const { line, column } = s.item!
	let value, space
	if (s.item?.type === 'control' && (s.item.value === '~' || s.item.value === '^'))
		space = s.collect()!.value as ISyntaxTokens['vec3']['xSpace']

	if (s.item?.type === 'int' || s.item?.type === 'float')
		value = s.collect()! as ISyntaxTokens['int' | 'float']
	else if (s.item?.type === 'space') {
		// Allow undefined if no number is provided
	} else throwSyntaxError(s.item, 'Expected int or float for X of vec3 but found %TOKEN at %POS')

	return { value, space }
}

export const parseVec2 = createParserFunc(
	'at vec2 at %POS',
	(s: TokenStream): ISyntaxTokens['vec2'] => {
		const { line, column } = s.item!

		const { value: x, space: xSpace } = parseVecAxis(s)
		assertAndConsumeEndOfArg(s)
		const { value: z, space: zSpace } = parseVecAxis(s)
		assertEndOfArg(s)

		return { type: 'vec2', x, z, xSpace, zSpace, line, column }
	}
)

export const parseVec3 = createParserFunc(
	'at vec3 at %POS',
	(s: TokenStream): ISyntaxTokens['vec3'] => {
		const { line, column } = s.item!

		const { value: x, space: xSpace } = parseVecAxis(s)
		assertAndConsumeEndOfArg(s)
		const { value: y, space: ySpace } = parseVecAxis(s)
		assertAndConsumeEndOfArg(s)
		const { value: z, space: zSpace } = parseVecAxis(s)
		assertEndOfArg(s)

		return { type: 'vec3', x, y, z, xSpace, ySpace, zSpace, line, column }
	}
)

export const parseBlockstate = createParserFunc(
	'at Blockstate at %POS',
	(s): ISyntaxTokens['blockstate'] => {
		const { line, column } = assertValueAndCollect(s, 'bracket', '[')
		const states: ISyntaxTokens['blockstate']['states'] = {}

		consumeAll(s, 'space')
		while (s.item) {
			if (s.item.type === 'bracket' && s.item.value === ']') break
			consumeAll(s, 'space')
			const key = assertTypeAndCollect(s, 'literal')
			assertValueAndConsume(s, 'control', '=')
			switch ((s.item as AnyToken)?.type) {
				case 'int':
				case 'boolean':
				case 'literal':
					states[key.value] = s.collect()! as ISyntaxTokens['literal' | 'boolean']
					break
				default:
					throwSyntaxError(
						s.item,
						'Expected boolean|literal|int at %POS but found %TOKEN instead.'
					)
			}
			if (s.item.type === 'control' && s.item.value === ',') s.consume()
		}
		assertValueAndConsume(s, 'bracket', ']')

		return { type: 'blockstate', states, line, column }
	}
)

export const parseBlock = createParserFunc('at Block at %POS', (s): ISyntaxTokens['block'] => {
	const { line, column } = s.item!
	const block = parseResourceLocation(s, true)
	let blockstate
	if (s.item?.type === 'bracket' && s.item.value === '[') blockstate = parseBlockstate(s)
	return { type: 'block', block, blockstate, line, column }
})
// FIXME This function is a horrendous mess. Clean it up.
export const parseNbtPath = createParserFunc(
	'at NBTPath at %POS',
	function (s): ISyntaxTokens['nbtPath'] {
		const { line, column } = s.item!
		const parts: AnySyntaxToken[] = []
		let lastItem: AnyToken | undefined

		while (s.item) {
			if (
				lastItem?.type === 'literal' ||
				lastItem?.type === 'boolean' ||
				lastItem?.type === 'quotedString' ||
				(lastItem?.type === 'bracket' && (lastItem.value === '[' || lastItem.value === '{'))
			) {
				if (lastItem?.type === 'quotedString' && lastItem.bracket === "'")
					throwSyntaxError(s.item, 'Quoted strings in NBTPaths must be double-quoted.')

				if (s.item.type === 'control' && s.item.value === '.') {
					lastItem = s.item
					parts.push(s.collect()! as ISyntaxTokens['control'])
				} else if (s.item.type === 'bracket' && s.item.value === '{') {
					lastItem = s.item
					parts.push(parseNbtObject(s))
				} else if (s.item.type === 'bracket' && s.item.value === '[') {
					lastItem = s.item
					parts.push(s.collect()! as ISyntaxTokens['bracket'])

					if ((s.item as AnyToken)?.type === 'int')
						parts.push(s.collect()! as ISyntaxTokens['int'])
					else if (
						(s.item as AnyToken)?.type === 'bracket' &&
						(s.item as AnyToken).value === ']'
					) {
					} else if (
						(s.item as AnyToken)?.type === 'bracket' &&
						(s.item as AnyToken).value === '{'
					)
						parts.push(parseNbtObject(s))
					else
						throwSyntaxError(s.item, 'Expected int|{ at %POS but found %TOKEN instead.')

					parts.push(assertValueAndCollect(s, 'bracket', ']') as ISyntaxTokens['bracket'])
				} else if (s.item.type === 'space' || s.item.type === 'newline') {
					break
				} else
					throwSyntaxError(s.item, `Expected [, { or . at %POS but found %TOKEN instead.`)
			} else if (
				s.item?.type === 'literal' ||
				s.item?.type === 'boolean' ||
				s.item?.type === 'quotedString' ||
				(s.item?.type === 'bracket' && (s.item.value === '[' || s.item.value === '{'))
			) {
				lastItem = s.item
				if (s.item.type === 'bracket' && s.item.value === '{') parts.push(parseNbtObject(s))
				else if (s.item.type === 'bracket' && s.item.value === '[') {
					parts.push(s.collect()! as ISyntaxTokens['bracket'])

					if ((s.item as AnyToken)?.type === 'int')
						parts.push(s.collect()! as ISyntaxTokens['int'])
					else if (
						(s.item as AnyToken)?.type === 'bracket' &&
						(s.item as AnyToken).value === ']'
					) {
					} else if (
						(s.item as AnyToken)?.type === 'bracket' &&
						(s.item as AnyToken).value === '{'
					)
						parts.push(parseNbtObject(s))
					else
						throwSyntaxError(s.item, 'Expected int|{ at %POS but found %TOKEN instead.')

					parts.push(assertValueAndCollect(s, 'bracket', ']') as ISyntaxTokens['bracket'])
				} else
					parts.push(
						s.collect()! as ISyntaxTokens['literal' | 'boolean' | 'quotedString']
					)
			} else {
				console.log(parts)
				throwSyntaxError(s.item, 'Unexpected %TOKEN at %POS')
			}
		}

		return { type: 'nbtPath', parts, line, column }
	}
)

export const parseOperation = createParserFunc(
	'at %TOKEN.VALUE at %POS',
	function (s: TokenStream): ISyntaxTokens['operation'] {
		const { line, column } = s.item!
		let value: ISyntaxTokens['operation']['value']

		if (s.item?.type !== 'control')
			throwSyntaxError(s.item, 'Expected control <, > or = at %POS but found %TOKEN instead.')

		switch (s.item.value) {
			case '<':
				s.consume()
				if (
					(s.item as AnyToken)?.type === 'control' &&
					(s.item as AnyToken).value === '='
				) {
					s.consume()
					return { type: 'operation', value: '<=', line, column }
				}
				return { type: 'operation', value: '<', line, column }
			case '>':
				s.consume()
				if (
					(s.item as AnyToken)?.type === 'control' &&
					(s.item as AnyToken).value === '='
				) {
					s.consume()
					return { type: 'operation', value: '>=', line, column }
				}
				return { type: 'operation', value: '=', line, column }
			case '=':
				s.consume()
				return { type: 'operation', value: '=', line, column }
			default:
				throwSyntaxError(s.item, 'Expected <, > or = at %POS but found %TOKEN instead.')
		}
	}
)

export const parseScoreboardName = createParserFunc(
	'at ScoreboardName at %POS',
	function (s: TokenStream): ISyntaxTokens['literal'] {
		const { line, column } = s.item!
		let value = ''

		// Scoreboard names are so unrestrictive it's painful
		// https://cdn.discordapp.com/attachments/341376678838272011/1066093019226451968/image.png
		while (s.item) {
			if (s.item.type === 'space' || (s.item.type === 'newline' && s.item.value !== '|'))
				break
			value += s.collect()!.value
		}

		return { type: 'literal', value, line, column }
	}
)

export const parsePlayerName = createParserFunc(
	'at PlayerName at %POS',
	function (s: TokenStream): ISyntaxTokens['literal'] {
		const { line, column } = s.item!
		let value = ''

		while (s.item) {
			switch (s.item.type) {
				case 'space':
				case 'newline':
					return { type: 'literal', value, line, column }
				case 'quotedString':
					if (value !== '') throwSyntaxError(s.item, 'Unexpected %TOKEN at %POS')
					return { type: 'literal', value: s.collect()!.value, line, column }
				case 'bracket':
					throwSyntaxError(s.item, 'Unexpected %TOKEN at %POS')
				case 'control':
					if (s.item.value !== '-' && s.item.value !== '.' && s.item.value !== '+')
						throwSyntaxError(s.item, 'Unexpected %TOKEN at %POS')
				default:
					value += s.collect()!.value
			}
		}

		return { type: 'literal', value, line, column }
	}
)

export const parseGenericCommand = createParserFunc(
	`at Command '%TOKEN.VALUE' at %POS`,
	function (s: TokenStream): AnyCommandSyntaxToken {
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
		assertTypeAndConsume(s, 'space')

		while (s.item) {
			if (s.item.type === 'newline' && s.item.value === '\n') break
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
)
