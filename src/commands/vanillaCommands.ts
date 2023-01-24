import { MinecraftSyntaxError, throwSyntaxError } from '../errors'
import {
	AnyNBTSyntaxToken,
	AnySyntaxToken,
	consumeAll,
	expectAndConsume,
	ISyntaxToken,
	ISyntaxTokens,
	SelectorChar,
	TokenStream,
} from '../parsers/vanillaParser'
import { AnyToken, ITokens } from '../tokenizers/vanillaTokenizer'
import { tokenToString } from '../util'

export interface ISyntaxTokenCommand<N> extends ISyntaxToken<'command'> {
	name: N
}

export interface IExecuteSubCommandToken<N> extends ISyntaxToken<'executeSubCommand'> {
	name: N
}

export type AnyCommandSyntaxToken = ICommandSyntaxTokens[keyof ICommandSyntaxTokens]

export type AnyExecuteSubCommand = IExecuteSubCommandTokens[keyof IExecuteSubCommandTokens]
export type ExecuteStoreSubCommandDataType = 'byte' | 'double' | 'float' | 'int' | 'long' | 'short'

export interface ICommandSyntaxTokens {
	unknown: ISyntaxTokenCommand<'unknown'> & {
		tokens: AnyToken[]
		commandName: string
	}
	execute: ISyntaxTokenCommand<'execute'> & {
		subCommands: AnyExecuteSubCommand[]
	}
}

export interface IExecuteSubCommandTokens {
	align: IExecuteSubCommandToken<'align'> & {
		swizzle: string
	}
	anchored: IExecuteSubCommandToken<'anchored'> & {
		swizzle: string
	}
	as: IExecuteSubCommandToken<'as'> & {
		target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal']
	}
	at: IExecuteSubCommandToken<'at'> & {
		target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal']
	}
	facing: IExecuteSubCommandToken<'facing'> &
		(
			| {
					entityBranch: false
					position: ISyntaxTokens['vec3']
			  }
			| {
					entityBranch: true
					target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal']
					focus: 'eyes' | 'feet'
			  }
		)
	in: IExecuteSubCommandToken<'in'> & {
		dimention: ISyntaxTokens['resourceLocation']
	}
	on: IExecuteSubCommandToken<'on'> & {
		target:
			| 'attacker'
			| 'controller'
			| 'leasher'
			| 'owner'
			| 'passengers'
			| 'target'
			| 'vehicle'
	}
	positioned: IExecuteSubCommandToken<'positioned'> &
		(
			| {
					asBranch: true
					target: ISyntaxTokens['targetSelector']
			  }
			| {
					asBranch: false
					position: ISyntaxTokens['vec3']
			  }
		)
	rotated: IExecuteSubCommandToken<'rotated'> &
		(
			| {
					asBranch: true
					target: ISyntaxTokens['targetSelector']
			  }
			| {
					asBranch: false
					position: ISyntaxTokens['vec2'] & {
						xSpaceMod?: '~'
						ySpaceMod?: '~'
					}
			  }
		)
	store: IExecuteSubCommandToken<'store'> & {
		storeMode: 'result' | 'success'
	} & (
			| {
					storeBranch: 'block'
					targetPos: ISyntaxTokens['vec3']
					path: ISyntaxTokens['nbtPath']
					dataType: ExecuteStoreSubCommandDataType
			  }
			| {
					storeBranch: 'bossbar'
			  }
			| {
					storeBranch: 'entity'
			  }
			| {
					storeBranch: 'score'
			  }
			| {
					storeBranch: 'storage'
			  }
		)
	if: IExecuteSubCommandToken<'if' | 'unless'> &
		(
			| {
					conditionBranch: 'block'
					position: ISyntaxTokens['vec3']
					block: ISyntaxTokens['blockstate']
			  }
			| {
					conditionBranch: 'blocks'
					start: ISyntaxTokens['vec3']
					end: ISyntaxTokens['vec3']
					target: ISyntaxTokens['vec3']
					maskMode: 'all' | 'masked'
			  }
			| ({
					conditionBranch: 'data'
			  } & (
					| {
							dataBranch: 'block'
							sourcePos: ISyntaxTokens['vec3']
							path: ISyntaxTokens['nbtPath']
					  }
					| {
							dataBranch: 'entity'
							source: ISyntaxTokens['targetSelector']
							path: ISyntaxTokens['nbtPath']
					  }
					| {
							dataBranch: 'storage'
							source: ISyntaxTokens['resourceLocation']
							path: ISyntaxTokens['nbtPath']
					  }
			  ))
			| {
					conditionBranch: 'entity'
					target: ISyntaxTokens['targetSelector']
			  }
			| {
					conditionBranch: 'predicate'
					predicate: ISyntaxTokens['resourceLocation']
			  }
			| ({
					conditionBranch: 'score'
					target: ISyntaxTokens['targetSelector']
					targetObjective: ISyntaxTokens['literal']
			  } & (
					| {
							matchesBranch: true
							range: ISyntaxTokens['intRange']
					  }
					| {
							matchesBranch: false
							operation: '<=' | '<' | '=' | '>' | '>='
							source: ISyntaxTokens['targetSelector']
							sourceObjective: ISyntaxTokens['literal']
					  }
			  ))
			| {
					conditionBranch: 'dimension'
					dimension: ISyntaxTokens['resourceLocation']
			  }
			| {
					conditionBranch: 'loaded'
					position: ISyntaxTokens['vec3']
			  }
		)
	unless: IExecuteSubCommandTokens['if']
	run: IExecuteSubCommandToken<'run'> & {
		command: AnyCommandSyntaxToken
	}
}

function parseRange<T extends 'int' | 'float'>(
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

function parseScoreObject(s: TokenStream): ISyntaxTokens['scoreObject'] {
	const { line, column } = s.item!
	const scores: Record<string, ISyntaxTokens['int'] | ISyntaxTokens['intRange']> = {}
	expectAndConsume(s, 'bracket', '{')
	consumeAll(s, 'space')
	while (s.item) {
		if (s.item.type === 'bracket' && s.item.value === '}') break
		consumeAll(s, 'space')
		const key = expectAndConsume(s, 'literal')
		expectAndConsume(s, 'control', '=')
		scores[key.value] = parseRange(s, 'int')
		if (s.item.type === 'control' && s.item.value === ',') s.consume()
	}
	expectAndConsume(s, 'bracket', '}')

	return {
		type: 'scoreObject',
		scores,
		line,
		column,
	}
}

function parseAdvancementObject(s: TokenStream): ISyntaxTokens['advancementObject'] {
	const { line, column } = s.item!
	const advancements = new Map<ISyntaxTokens['resourceLocation'], ISyntaxTokens['boolean']>()
	expectAndConsume(s, 'bracket', '{')
	while (s.item) {
		if (s.item.type === 'bracket' && s.item.value === '}') break
		consumeAll(s, 'space')
		// console.log(s.item)
		const key = parseResourceLocation(s, false)
		expectAndConsume(s, 'control', '=')
		advancements.set(key, expectAndConsume(s, 'boolean'))
		if (s.item.type === 'control' && s.item.value === ',') s.consume()
	}
	expectAndConsume(s, 'bracket', '}')

	return {
		type: 'advancementObject',
		advancements,
		line,
		column,
	}
}

function parseResourceLocation(
	s: TokenStream,
	allowTag: boolean
): ISyntaxTokens['resourceLocation'] {
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

	try {
		namespace += expectAndConsume(s, 'literal').value
		expectAndConsume(s, 'control', ':')
		while (s.item) {
			if (s.item.type === 'literal') {
				path += s.collect()!.value
				continue
			} else if (s.item.type === 'control') {
				if (s.item.value === '/') {
					path += s.collect()!.value
					continue
				}
				break
			}
			throwSyntaxError(s.item, `Found unexpected %TOKEN at %POS`)
		}
	} catch (e: any) {
		if (e.name === 'MinecraftSyntaxError') {
			throwSyntaxError(
				undefined,
				`Unexpected error while parsing resourceLocation at %POS:\n\t${e.message}`,
				line,
				column
			)
		} else throw e
	}

	return { type: 'resourceLocation', namespace, path, line, column }
}

function parseUnquotedString(s: TokenStream): ISyntaxTokens['unquotedString'] {
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

function parseNbtList(s: TokenStream): ISyntaxTokens['nbtList'] {
	// TODO Add typed array support
	const { line, column } = s.item!
	const items: ISyntaxTokens['nbtList']['items'] = []
	expectAndConsume(s, 'bracket', '[')
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
		expectAndConsume(s, 'control', ';')
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

	expectAndConsume(s, 'bracket', ']')

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

function parseNbtObject(s: TokenStream): ISyntaxTokens['nbtObject'] {
	const { line, column } = s.item!
	const value: ISyntaxTokens['nbtObject']['value'] = {}
	expectAndConsume(s, 'bracket', '{')

	try {
		while (s.item) {
			if (s.item.type === 'bracket' && s.item.value === '}') break
			consumeAll(s, 'space')
			const key = parseUnquotedString(s)
			consumeAll(s, 'space')
			expectAndConsume(s, 'control', ':')
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

	expectAndConsume(s, 'bracket', '}')

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
		default:
			throwSyntaxError(s.item!, `Unknown selector argument '${key}' as %POS`, line, column)
	}
}

function parseTargetSelectorArguments(s: TokenStream): ISyntaxTokens['targetSelectorArgument'][] {
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
			expectAndConsume(s, 'control', '=')
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

function parseTargetSelector(s: TokenStream): ISyntaxTokens['targetSelector'] {
	const { line, column } = s.item!

	switch (s.item?.type) {
		case 'literal':
			// FIXME Doesn't understand the difference between a player name and a UUID
			return {
				type: 'targetSelector',
				targetType: 'literal',
				value: s.item,
				line,
				column,
			}
		case 'control':
			expectAndConsume(s, 'control')
			const selectorChar = expectAndConsume(s, 'literal').value as SelectorChar
			const args = parseTargetSelectorArguments(s)

			return {
				type: 'targetSelector',
				targetType: 'selector',
				selectorChar,
				args,
				line,
				column,
			}
		default:
			throwSyntaxError(
				s.item!,
				`Expected 'targetSelector' at %POS but found '${s.item?.type}' instead.`
			)
	}
}

export function parseExecuteCommand(s: TokenStream): ICommandSyntaxTokens['execute'] {
	const { line, column } = s.collect()!
	const subCommands: AnyExecuteSubCommand[] = []
	expectAndConsume(s, 'space')

	let commandFinished = false
	while (!commandFinished && s.item) {
		switch (s.item.type) {
			case 'literal':
				switch (s.item.value) {
					case 'as':
						const pos = { line: s.item.line, column: s.item.column }
						s.consume() // Consume as literal
						expectAndConsume(s, 'space')
						const targetSelector = parseTargetSelector(s)
						subCommands.push({
							type: 'executeSubCommand',
							name: 'as',
							target: targetSelector,
							...pos,
						})
						break
					default:
						throwSyntaxError(
							s.item,
							`Unknown ExecuteSubCommand ${s.item.value}' at %POS`
						)
				}
				break
			case 'newline':
				commandFinished = true
				break
			default:
				throwSyntaxError(
					s.item,
					`Expected ExecuteSubCommand but found '${s.item.value}' at %POS`
				)
		}
	}

	return {
		type: 'command',
		name: 'execute',
		subCommands,
		line,
		column,
	}
}
