import { throwSyntaxError } from '../../errors'
import {
	assertTypeAndCollect,
	assertTypeAndConsume,
	createParserFunc,
	ISyntaxToken,
	ISyntaxTokens,
	TokenStream,
} from '../../parsers/vanillaParser'
import { AnyToken } from '../../tokenizers/vanillaTokenizer'
import {
	ICommandSyntaxTokens,
	parseSwizzle,
	parseTargetSelector,
	parseVec3,
	assertEndOfArg,
	parseBlock,
	AnyCommandSyntaxToken,
	parseNbtPath,
} from '../vanillaCommands'

export interface IExecuteSubCommandToken<N> extends ISyntaxToken<'executeSubCommand'> {
	name: N
}
export type AnyExecuteSubCommand = IExecuteSubCommandTokens[keyof IExecuteSubCommandTokens]
export type ExecuteStoreSubCommandDataType = 'byte' | 'double' | 'float' | 'int' | 'long' | 'short'

export interface IExecuteArgTypes {
	maskMode:
		| (ISyntaxTokens['literal'] & {
				value: 'all' | 'masked'
		  })
		| undefined
}

export interface IExecuteSubCommandTokens {
	align: IExecuteSubCommandToken<'align'> & {
		swizzle: string
	}
	anchored: IExecuteSubCommandToken<'anchored'> & {
		anchor: 'eyes' | 'feet'
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
					anchor: 'eyes' | 'feet'
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
					block: ISyntaxTokens['block']
			  }
			| {
					conditionBranch: 'blocks'
					start: ISyntaxTokens['vec3']
					end: ISyntaxTokens['vec3']
					target: ISyntaxTokens['vec3']
					maskMode: IExecuteArgTypes['maskMode']
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

export const parseExecuteCommand = createParserFunc(
	'at ExecuteCommand at %POS',
	(s: TokenStream): ICommandSyntaxTokens['execute'] => {
		const { line, column } = s.collect()!
		const subCommands: AnyExecuteSubCommand[] = []
		assertTypeAndConsume(s, 'space')

		let commandFinished = false
		while (!commandFinished && s.item) {
			switch (s.item.type) {
				case 'literal':
					subCommands.push(_parseSubCommand(s))
					assertEndOfArg(s)
					if ((s.item as AnyToken)?.type === 'space') s.consume()
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
)

const _parseSubCommand = createParserFunc(
	'at ExecuteSubCommand at %POS',
	function (s: TokenStream): AnyExecuteSubCommand {
		const subCommandName = s.collect()!
		const { line, column } = subCommandName
		let parseFunc
		switch (subCommandName.value as keyof IExecuteSubCommandTokens) {
			case 'align':
				parseFunc = _parseSubAlign
				break
			case 'anchored':
				parseFunc = _parseSubAnchored
				break
			case 'as':
				parseFunc = _parseSubAs
				break
			case 'at':
				parseFunc = _parseSubAt
				break
			case 'facing':
				parseFunc = _parseSubFacing
				break
			case 'if':
				parseFunc = _parseSubIf
				break
			case 'unless':
				parseFunc = _parseSubUnless
				break
			default:
				throwSyntaxError(
					subCommandName,
					`Unknown ExecuteSubCommand '${subCommandName.value}' at %POS`
				)
		}
		assertTypeAndConsume(s, 'space')
		return parseFunc(s, line, column)
	}
)

const _parseSubAlign = createParserFunc(
	`at SubCommand 'align' at %POS`,
	function (s, line: number, column: number): IExecuteSubCommandTokens['align'] {
		const swizzle = parseSwizzle(s)
		return { type: 'executeSubCommand', name: 'align', swizzle, line, column }
	}
)

const _parseSubAnchored = createParserFunc(
	`at SubCommand 'anchored' at %POS`,
	function (s, line: number, column: number): IExecuteSubCommandTokens['anchored'] {
		const anchor = assertTypeAndCollect(s, 'literal')
		if (anchor.value !== 'eyes' && anchor.value !== 'feet')
			throwSyntaxError(
				anchor,
				`Expected anchor 'eyes' | 'feet' for ExecuteSubCommand 'anchored' but found %TOKEN at %POS`
			)
		return {
			type: 'executeSubCommand',
			name: 'anchored',
			anchor: anchor.value,
			line,
			column,
		}
	}
)

const _parseSubAs = createParserFunc(
	`at SubCommand 'as' at %POS`,
	function (s, line: number, column: number): IExecuteSubCommandTokens['as'] {
		const target = parseTargetSelector(s)
		return { type: 'executeSubCommand', name: 'as', target, line, column }
	}
)

const _parseSubAt = createParserFunc(
	`at SubCommand 'at' at %POS`,
	function (s, line: number, column: number): IExecuteSubCommandTokens['at'] {
		const target = parseTargetSelector(s)
		return { type: 'executeSubCommand', name: 'at', target, line, column }
	}
)

const _parseSubFacing = createParserFunc(
	`at SubCommand 'facing' at %POS`,
	function (s, line: number, column: number): IExecuteSubCommandTokens['facing'] {
		// Entity Branch
		if (s.item?.type === 'literal' && s.item.value === 'entity') {
			s.consume()
			assertTypeAndConsume(s, 'space')
			const target = parseTargetSelector(s)
			assertTypeAndConsume(s, 'space')
			const anchor = assertTypeAndCollect(s, 'literal')
			if (anchor.value !== 'eyes' && anchor.value !== 'feet')
				throwSyntaxError(
					anchor,
					`Expected anchor 'eyes' | 'feet' for ExecuteSubCommand 'anchored' but found %TOKEN at %POS`
				)
			return {
				type: 'executeSubCommand',
				name: 'facing',
				entityBranch: true,
				target,
				anchor: anchor.value,
				line,
				column,
			}
		}
		// Position Branch
		const position = parseVec3(s)

		return {
			type: 'executeSubCommand',
			name: 'facing',
			entityBranch: false,
			position,
			line,
			column,
		}
	}
)

function genericSubIf<T extends 'if' | 'unless'>(operation: T) {
	return (
		s: TokenStream,
		line: number,
		column: number
	): IExecuteSubCommandTokens['if'] | IExecuteSubCommandTokens['unless'] => {
		// conditionBranch
		switch (s.item?.value as IExecuteSubCommandTokens['if']['conditionBranch']) {
			case 'block':
				return __parseSubIfConditionBlock(s, line, column)
			case 'blocks':
				return __parseSubIfConditionBlocks(s, line, column)
			case 'data':
				return __parseSubIfConditionData(s, line, column)
			default:
				throwSyntaxError(s.item, `Unknown if condition '%TOKEN.VALUE' at %POS`)
		}

		throwSyntaxError(s.item, 'Skill issue')
	}
}
const _parseSubIf = createParserFunc(`at SubCommand 'if' at %POS`, genericSubIf('if'))
const _parseSubUnless = createParserFunc(`at SubCommand 'unless' at %POS`, genericSubIf('unless'))

type BlockBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'block' }
const __parseSubIfConditionBlock = createParserFunc(
	`at Condition 'block' at %POS`,
	function (s, line: number, column: number): BlockBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		const position = parseVec3(s)
		assertTypeAndConsume(s, 'space')
		const block = parseBlock(s)
		return {
			type: 'executeSubCommand',
			name: 'if',
			conditionBranch: 'block',
			position,
			block,
			line,
			column,
		}
	}
)

type BlocksBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'blocks' }
const __parseSubIfConditionBlocks = createParserFunc(
	`at Condition 'blocks at %POS`,
	function (s, line: number, column: number): BlocksBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		const start = parseVec3(s)
		assertTypeAndConsume(s, 'space')
		const end = parseVec3(s)
		assertTypeAndConsume(s, 'space')
		const target = parseVec3(s)
		assertTypeAndConsume(s, 'space')
		if (!(s.item?.value === 'all' || s.item?.value === 'masked'))
			throwSyntaxError(
				s.item,
				`Expected maskMode to be all|masked but found '${s.item?.value}'`
			)
		const maskMode = assertTypeAndCollect(s, 'literal') as IExecuteArgTypes['maskMode']

		return {
			type: 'executeSubCommand',
			name: 'if',
			conditionBranch: 'blocks',
			start,
			end,
			target,
			maskMode,
			line,
			column,
		}
	}
)

type DataBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'data' }
const __parseSubIfConditionData = createParserFunc(
	`at Condition 'data' at %POS`,
	function (s: TokenStream, line: number, column: number): DataBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		// dataBranch
		switch (s.item?.value as DataBranch['dataBranch']) {
			case 'block': {
				s.collect()
				assertTypeAndConsume(s, 'space')
				const sourcePos = parseVec3(s)
				assertTypeAndConsume(s, 'space')
				const path = parseNbtPath(s)
				return {
					type: 'executeSubCommand',
					name: 'if',
					conditionBranch: 'data',
					dataBranch: 'block',
					sourcePos,
					path,
					line,
					column,
				}
			}
			case 'entity': {
				s.collect()
				assertTypeAndConsume(s, 'space')
				const target = parseTargetSelector(s)
				assertTypeAndConsume(s, 'space')
				const path = parseNbtPath(s)
				return {
					type: 'executeSubCommand',
					name: 'if',
					conditionBranch: 'data',
					dataBranch: 'entity',
					source: target,
					path,
					line,
					column,
				}
			}
			default:
				throwSyntaxError(s.item, `Unknown data type %TOKEN at %POS`)
		}
	}
)
