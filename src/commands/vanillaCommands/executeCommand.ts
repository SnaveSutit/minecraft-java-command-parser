import { throwSyntaxError } from '../../errors'
import {
	assertTypeAndCollect,
	assertTypeAndConsume,
	assertValueAndCollect,
	createParserFunc,
	ISyntaxToken,
	ISyntaxTokens,
	TokenStream,
} from '../../parsers/vanillaParser'
import { AnyToken, IToken, ITokens } from '../../tokenizers/vanillaTokenizer'
import {
	ICommandSyntaxTokens,
	parseSwizzle,
	parseTargetSelector,
	parseVec3,
	assertEndOfArg,
	parseBlock,
	AnyCommandSyntaxToken,
	parseNbtPath,
	parseResourceLocation,
	parseOperation,
	parseRange,
	parseVec2,
	parseGenericCommand,
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
		dimension: ISyntaxTokens['resourceLocation']
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
					rotation: ISyntaxTokens['vec2'] & {
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
					scale: ISyntaxTokens['int' | 'float']
			  }
			| {
					storeBranch: 'bossbar'
					bossbar: ISyntaxTokens['resourceLocation']
					bossbarMode: 'value' | 'max'
			  }
			| {
					storeBranch: 'entity'
					target: ISyntaxTokens['targetSelector']
					path: ISyntaxTokens['nbtPath']
					dataType: ExecuteStoreSubCommandDataType
					scale: ISyntaxTokens['int' | 'float']
			  }
			| {
					storeBranch: 'score'
					target: ISyntaxTokens['targetSelector']
					targetObjective: ISyntaxTokens['literal']
			  }
			| {
					storeBranch: 'storage'
					storage: ISyntaxTokens['resourceLocation']
					path: ISyntaxTokens['nbtPath']
					dataType: ExecuteStoreSubCommandDataType
					scale: ISyntaxTokens['int' | 'float']
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

function _parseSubCommand(s: TokenStream): AnyExecuteSubCommand {
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
		case 'in':
			parseFunc = _parseSubIn
			break
		case 'positioned':
			parseFunc = _parseSubPositioned
			break
		case 'rotated':
			parseFunc = _parseSubRotated
			break
		case 'run':
			parseFunc = _parseSubRun
			break
		case 'store':
			parseFunc = _parseSubStore
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
			case 'dimension':
				return __parseSubIfConditionDimension(s, line, column)
			case 'entity':
				return __parseSubIfConditionEntity(s, line, column)
			case 'loaded':
				return __parseSubIfConditionLoaded(s, line, column)
			case 'predicate':
				return __parseSubIfConditionPredicate(s, line, column)
			case 'score':
				return __parseSubIfConditionScore(s, line, column)
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
			case 'storage':
				s.collect()
				assertTypeAndConsume(s, 'space')
				const source = parseResourceLocation(s, false)
				assertTypeAndConsume(s, 'space')
				const path = parseNbtPath(s)
				return {
					type: 'executeSubCommand',
					name: 'if',
					conditionBranch: 'data',
					dataBranch: 'storage',
					source,
					path,
					line,
					column,
				}
			default:
				throwSyntaxError(s.item, `Unknown data type %TOKEN at %POS`)
		}
	}
)

type DimensionBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'dimension' }
const __parseSubIfConditionDimension = createParserFunc(
	`at Condition 'dimension' at %POS`,
	function (s: TokenStream, line: number, column: number): DimensionBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		const dimension = parseResourceLocation(s, false)
		return {
			type: 'executeSubCommand',
			name: 'if',
			conditionBranch: 'dimension',
			dimension,
			line,
			column,
		}
	}
)

type EntityBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'entity' }
const __parseSubIfConditionEntity = createParserFunc(
	`at Condition 'entity' at %POS`,
	function (s: TokenStream, line: number, column: number): EntityBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		const target = parseTargetSelector(s)
		return {
			type: 'executeSubCommand',
			name: 'if',
			conditionBranch: 'entity',
			target,
			line,
			column,
		}
	}
)

type LoadedBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'loaded' }
const __parseSubIfConditionLoaded = createParserFunc(
	`at Condition 'loaded' at %POS`,
	function (s: TokenStream, line: number, column: number): LoadedBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		const position = parseVec3(s)
		return {
			type: 'executeSubCommand',
			name: 'if',
			conditionBranch: 'loaded',
			position,
			line,
			column,
		}
	}
)

type PredicateBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'predicate' }
const __parseSubIfConditionPredicate = createParserFunc(
	`at Condition 'predicate' at %POS`,
	function (s: TokenStream, line: number, column: number): PredicateBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		const predicate = parseResourceLocation(s, false)
		return {
			type: 'executeSubCommand',
			name: 'if',
			conditionBranch: 'predicate',
			predicate,
			line,
			column,
		}
	}
)

type ScoreBranch = IExecuteSubCommandTokens['if'] & { conditionBranch: 'score' }
const __parseSubIfConditionScore = createParserFunc(
	`at Condition 'score' at %POS`,
	function (s: TokenStream, line: number, column: number): ScoreBranch {
		s.collect()
		assertTypeAndConsume(s, 'space')
		const target = parseTargetSelector(s)
		assertTypeAndConsume(s, 'space')
		const targetObjective = assertTypeAndCollect(s, 'literal')
		assertTypeAndConsume(s, 'space')

		let operation: ISyntaxTokens['operation'] | undefined
		let matchesBranch = false
		if (s.item?.type === 'literal') {
			if (s.item.value !== 'matches')
				throwSyntaxError(s.item, `Expected literal 'matches' at %POS but found %TOKEN`)
			matchesBranch = true
			s.consume()
			assertTypeAndConsume(s, 'space')
			const range = parseRange(s, 'int')
			return {
				type: 'executeSubCommand',
				name: 'if',
				conditionBranch: 'score',
				matchesBranch,
				range,
				target,
				targetObjective,
				line,
				column,
			}
		} else if (s.item?.type === 'control') {
			operation = parseOperation(s)
			assertTypeAndConsume(s, 'space')
			const source = parseTargetSelector(s)
			assertTypeAndConsume(s, 'space')
			const sourceObjective = assertTypeAndCollect(s, 'literal')
			return {
				type: 'executeSubCommand',
				name: 'if',
				conditionBranch: 'score',
				matchesBranch,
				target,
				targetObjective,
				operation: operation.value,
				source,
				sourceObjective,
				line,
				column,
			}
		} else
			throwSyntaxError(
				s.item,
				`Expected literal:'matches' or operation at %POS but found %TOKEN`
			)
	}
)

const _parseSubIn = createParserFunc(
	`at SubCommand 'in' at %POS`,
	function (s: TokenStream, line: number, column: number): IExecuteSubCommandTokens['in'] {
		const dimension = parseResourceLocation(s, false)
		return { type: 'executeSubCommand', name: 'in', dimension, line, column }
	}
)

const _parseSubPositioned = createParserFunc(
	`at SubCommand 'positioned' at %POS`,
	function (
		s: TokenStream,
		line: number,
		column: number
	): IExecuteSubCommandTokens['positioned'] {
		if (s.item?.type === 'literal' && s.item.value === 'as') {
			s.consume()
			assertTypeAndConsume(s, 'space')
			const target = parseTargetSelector(s)
			return {
				type: 'executeSubCommand',
				name: 'positioned',
				asBranch: true,
				target,
				line,
				column,
			}
		}

		const position = parseVec3(s)
		return {
			type: 'executeSubCommand',
			name: 'positioned',
			asBranch: false,
			position,
			line,
			column,
		}
	}
)

const _parseSubRotated = createParserFunc(
	`at SubCommand 'rotated' at %POS`,
	function (s: TokenStream, line: number, column: number): IExecuteSubCommandTokens['rotated'] {
		if (s.item?.type === 'literal' && s.item.value === 'as') {
			s.consume()
			assertTypeAndConsume(s, 'space')
			const target = parseTargetSelector(s)
			return {
				type: 'executeSubCommand',
				name: 'rotated',
				asBranch: true,
				target,
				line,
				column,
			}
		}

		const rotation = parseVec2(s)
		return {
			type: 'executeSubCommand',
			name: 'rotated',
			asBranch: false,
			rotation,
			line,
			column,
		}
	}
)

const _parseSubRun = createParserFunc(
	`at SubCommand 'run' at %POS`,
	function (s: TokenStream, line: number, column: number): IExecuteSubCommandTokens['run'] {
		const command = parseGenericCommand(s)
		return { type: 'executeSubCommand', name: 'run', command, line, column }
	}
)

const _parseSubStore = createParserFunc(
	`at SubCommand 'store' at %POS`,
	function (s: TokenStream, line: number, column: number): IExecuteSubCommandTokens['store'] {
		if (s.item?.type !== 'literal' && s.item?.value !== 'result' && s.item?.value !== 'success')
			throwSyntaxError(s.item, `Expected 'result' or 'success' at %POS but found %TOKEN`)
		const storeMode = s.collect()!.value as IExecuteSubCommandTokens['store']['storeMode']
		assertTypeAndConsume(s, 'space')
		if ((s.item as AnyToken).type !== 'literal')
			throwSyntaxError(s.item, `Expected literal at %POS but found %TOKEN`)
		switch ((s.item as AnyToken).value as IExecuteSubCommandTokens['store']['storeBranch']) {
			case 'block':
				return _parseSubStoreBlock(s, storeMode, line, column)
			case 'bossbar':
				return _parseSubStoreBossbar(s, storeMode, line, column)
			case 'entity':
				return _parseSubStoreEntity(s, storeMode, line, column)
			case 'score':
				return _parseSubStoreScore(s, storeMode, line, column)
			case 'storage':
				return _parseSubStoreStorage(s, storeMode, line, column)
			default:
				throwSyntaxError(
					s.item,
					`Expected 'block', 'bossbar', 'entity', 'score' or 'storage' at %POS but found %TOKEN`
				)
		}
	}
)

type StoreBlockBranch = IExecuteSubCommandTokens['store'] & { storeBranch: 'block' }
const _parseSubStoreBlock = createParserFunc(
	`at StoreMode 'block' at %POS`,
	function (
		s: TokenStream,
		storeMode: IExecuteSubCommandTokens['store']['storeMode'],
		line: number,
		column: number
	): StoreBlockBranch {
		s.consume()
		assertTypeAndConsume(s, 'space')
		const targetPos = parseVec3(s)
		assertTypeAndConsume(s, 'space')
		const path = parseNbtPath(s)
		assertTypeAndConsume(s, 'space')
		const dataType = assertValueAndCollect(s, 'literal', [
			'byte',
			'short',
			'int',
			'long',
			'float',
			'double',
		]).value
		assertTypeAndConsume(s, 'space')
		const scale = assertTypeAndCollect(s, ['int', 'float'])
		return {
			type: 'executeSubCommand',
			name: 'store',
			storeBranch: 'block',
			storeMode,
			targetPos,
			path,
			dataType,
			scale,
			line,
			column,
		}
	}
)

type StoreBossbarBranch = IExecuteSubCommandTokens['store'] & { storeBranch: 'bossbar' }
const _parseSubStoreBossbar = createParserFunc(
	`at StoreMode 'bossbar' at %POS`,
	function (
		s: TokenStream,
		storeMode: IExecuteSubCommandTokens['store']['storeMode'],
		line: number,
		column: number
	): StoreBossbarBranch {
		s.consume()
		assertTypeAndConsume(s, 'space')
		const bossbar = parseResourceLocation(s, false)
		assertTypeAndConsume(s, 'space')
		const bossbarMode = assertValueAndCollect(s, 'literal', ['value', 'max']).value
		return {
			type: 'executeSubCommand',
			name: 'store',
			storeBranch: 'bossbar',
			storeMode,
			bossbar,
			bossbarMode,
			line,
			column,
		}
	}
)

type StoreEntityBranch = IExecuteSubCommandTokens['store'] & { storeBranch: 'entity' }
const _parseSubStoreEntity = createParserFunc(
	`at StoreMode 'entity' at %POS`,
	function (
		s: TokenStream,
		storeMode: IExecuteSubCommandTokens['store']['storeMode'],
		line: number,
		column: number
	): StoreEntityBranch {
		s.consume()
		assertTypeAndConsume(s, 'space')
		const target = parseTargetSelector(s)
		assertTypeAndConsume(s, 'space')
		const path = parseNbtPath(s)
		assertTypeAndConsume(s, 'space')
		const dataType = assertValueAndCollect(s, 'literal', [
			'byte',
			'short',
			'int',
			'long',
			'float',
			'double',
		]).value
		assertTypeAndConsume(s, 'space')
		const scale = assertTypeAndCollect(s, ['int', 'float'])
		return {
			type: 'executeSubCommand',
			name: 'store',
			storeBranch: 'entity',
			storeMode,
			target,
			path,
			dataType,
			scale,
			line,
			column,
		}
	}
)

type StoreScoreBranch = IExecuteSubCommandTokens['store'] & { storeBranch: 'score' }
const _parseSubStoreScore = createParserFunc(
	`at StoreMode 'score' at %POS`,
	function (
		s: TokenStream,
		storeMode: IExecuteSubCommandTokens['store']['storeMode'],
		line: number,
		column: number
	): StoreScoreBranch {
		s.consume()
		assertTypeAndConsume(s, 'space')
		const target = parseTargetSelector(s, true)
		assertTypeAndConsume(s, 'space')
		const targetObjective = assertTypeAndCollect(s, 'literal')
		return {
			type: 'executeSubCommand',
			name: 'store',
			storeBranch: 'score',
			storeMode,
			target,
			targetObjective,
			line,
			column,
		}
	}
)

type StoreStorageBranch = IExecuteSubCommandTokens['store'] & { storeBranch: 'storage' }
const _parseSubStoreStorage = createParserFunc(
	`at StoreMode 'storage' at %POS`,
	function (
		s: TokenStream,
		storeMode: IExecuteSubCommandTokens['store']['storeMode'],
		line: number,
		column: number
	): StoreStorageBranch {
		s.consume()
		assertTypeAndConsume(s, 'space')
		const storage = parseResourceLocation(s, false)
		assertTypeAndConsume(s, 'space')
		const path = parseNbtPath(s)
		assertTypeAndConsume(s, 'space')
		const dataType = assertValueAndCollect(s, 'literal', [
			'byte',
			'short',
			'int',
			'long',
			'float',
			'double',
		]).value
		assertTypeAndConsume(s, 'space')
		const scale = assertTypeAndCollect(s, ['int', 'float'])
		return {
			type: 'executeSubCommand',
			name: 'store',
			storeBranch: 'storage',
			storeMode,
			storage,
			path,
			dataType,
			scale,
			line,
			column,
		}
	}
)
