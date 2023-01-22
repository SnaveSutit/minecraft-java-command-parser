import { throwSyntaxError } from '../errors'
import {
	AnySyntaxToken,
	consumeAll,
	expectAndConsume,
	ISyntaxToken,
	ISyntaxTokens,
	SelectorChar,
	TokenStream,
} from '../parsers/vanillaParser'
import { AnyToken } from '../tokenizers/vanillaTokenizer'

export interface ISyntaxTokenCommand<N> extends ISyntaxToken<'command'> {
	name: N
}

export type AnyCommandSyntaxToken = ICommandSyntaxTokens[keyof ICommandSyntaxTokens]

export type AnyExecuteSubCommands = IExecuteSubCommandTokens[keyof IExecuteSubCommandTokens]
export type ExecuteStoreSubCommandDataType = 'byte' | 'double' | 'float' | 'int' | 'long' | 'short'

export interface ICommandSyntaxTokens {
	unknown: ISyntaxTokenCommand<'unknown'> & {
		content: string
	}
	execute: ISyntaxTokenCommand<'execute'> & {
		subCommands: AnyExecuteSubCommands[]
	}
}

export interface IExecuteSubCommandTokens {
	align: ISyntaxToken<'align'> & {
		swizzle: string
	}
	anchored: ISyntaxToken<'anchored'> & {
		swizzle: string
	}
	as: ISyntaxToken<'as'> & {
		target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal']
	}
	at: ISyntaxToken<'at'> & {
		target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal']
	}
	facing: ISyntaxToken<'facing'> &
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
	in: ISyntaxToken<'in'> & {
		dimention: ISyntaxTokens['resourceLocation']
	}
	on: ISyntaxToken<'on'> & {
		target:
			| 'attacker'
			| 'controller'
			| 'leasher'
			| 'owner'
			| 'passengers'
			| 'target'
			| 'vehicle'
	}
	positioned: ISyntaxToken<'positioned'> &
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
	rotated: ISyntaxToken<'rotated'> &
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
	store: ISyntaxToken<'store'> & {
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
	if: ISyntaxToken<'if' | 'unless'> &
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
	run: ISyntaxToken<'run'> & {
		command: AnyCommandSyntaxToken
	}
}

function parseScoreObject(s: TokenStream): ISyntaxTokens['scoreObject'] {
	const { line, column } = s.item!
	const scores: Record<string, ISyntaxTokens['int'] | ISyntaxTokens['intRange']> = {}
	expectAndConsume(s, 'bracket', '{')
	while (s.item) {
		consumeAll(s, 'space')
		const key = expectAndConsume(s, 'literal')
		expectAndConsume(s, 'control', '=')
		// TODO Finish this
		// if (s.item.type === 'int') {
		// }
	}
	expectAndConsume(s, 'bracket', '}')

	return {
		type: 'scoreObject',
		scores,
		line,
		column,
	}
}

function parseTargetSelectorArgumentValue(s: TokenStream, token: AnyToken): AnySyntaxToken {
	switch (token.type) {
		case 'number':
		case 'literal':
		case 'quotedString':
			return token as AnySyntaxToken
		case 'bracket':
			// TODO Add score object collection
			return parseScoreObject(s)
		default:
			throwSyntaxError(
				token,
				`Expected 'int' | 'float' | 'literal' | 'quotedString' | 'bracket' at %POS but found ${token.type}:'${token.value} instead'`
			)
	}
}

function parseTargetSelectorArguments(s: TokenStream): Record<string, AnySyntaxToken> {
	const args: Record<string, AnySyntaxToken> = {}
	// Return no args if no bracket exists
	if (!(s.item?.type === 'bracket' && s.item.value === '[')) return args
	s.consume() // Consume opening bracket
	s.item = s.item as AnyToken
	while (s.item) {
		consumeAll(s, 'space')
		if (s.item.type === 'literal') {
			const key = s.collect()! as ISyntaxTokens['literal']
			consumeAll(s, 'space')
			expectAndConsume(s, 'control', '=')
			consumeAll(s, 'space')
			const value = s.collect()!
			consumeAll(s, 'space')
			args[key.value] = parseTargetSelectorArgumentValue(s, value)
			s.item = s.item as AnyToken
			if (s.item.type === 'control' && s.item.value === ',') s.consume()
		} else if (s.item.type === 'bracket' && s.item.value === ']') {
			s.consume()
			return args
		} else
			throwSyntaxError(
				s.item,
				`Expected selector argument but found ${s.item.type}:'${s.item.value}' at %POS`
			)
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
				`Expected 'targetSelector' but found '${s.item?.type} instead at %POS'`
			)
	}
}

export function parseExecuteCommand(s: TokenStream): ICommandSyntaxTokens['execute'] {
	const { line, column } = s.collect()!
	const subCommands: AnyExecuteSubCommands[] = []
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
							type: 'as',
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
