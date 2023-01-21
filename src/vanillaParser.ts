import { throwSyntaxError } from './errors'
import { AnyToken, ITokens } from './vanillaTokenizer'

export type SelectorChar = 'a' | 'e' | 'r' | 's' | 'p'
export type NumberTypeIdentifier = 's' | 'b' | 't' | 'f' | 'd' | 'l'
export type ExecuteStoreSubCommandDataType = 'byte' | 'double' | 'float' | 'int' | 'long' | 'short'

export interface ISyntaxToken<T> {
	type: T
	line: number
	column: number
}

export interface ISyntaxTokenCommand<N> extends ISyntaxToken<'command'> {
	name: N
}

export type AnySyntaxToken = ISyntaxTokens[keyof ISyntaxTokens] | AnyCommandSyntaxToken

function asString(token: AnySyntaxToken): string {
	return ''
}

const p = {} as AnySyntaxToken
if (p.type === 'command' && p.name === 'executeCommand') {
	for (const sub of p.subCommands) {
		if (sub.type === 'if' && sub.conditionBranch === 'data' && sub.dataBranch === 'entity') {
			let source
			switch (sub.source.targetType) {
				case 'uuid':
				case 'literal':
					source = sub.source.value
					break
				case 'selector':
					source = asString(sub.source)
			}
			const str = `execute if data entity ${source} ${sub.path.value}`
		}
	}
}

export type AnyNBTSyntaxToken =
	| ISyntaxTokens['nbtList']
	| ISyntaxTokens['nbtObject']
	| ISyntaxTokens['int']
	| ISyntaxTokens['float']
	| ISyntaxTokens['literal']
	| ISyntaxTokens['quotedString']

export type AnyCommandSyntaxToken = ICommandSyntaxTokens[keyof ICommandSyntaxTokens]

export type AnyExecuteSubCommands = IExecuteSubCommandTokens[keyof IExecuteSubCommandTokens]

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
		// TODO Add all nbt SyntaxTokens
		value: Record<string, AnyNBTSyntaxToken>
	}
	nbtList: ISyntaxToken<'nbtList'> & {
		items: AnyNBTSyntaxToken[]
	}
	nbtPath: ISyntaxToken<'nbtPath'> & {
		value: string
	}
}

export interface ICommandSyntaxTokens {
	unknownCommand: ISyntaxToken<'unknownCommand'> & {
		name: string
		content: string
	}
	executeCommand: ISyntaxTokenCommand<'executeCommand'> & {
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

export class TokenStream {
	item?: AnyToken
	index: number = -1
	tokens: AnyToken[]
	constructor(tokens: AnyToken[]) {
		this.tokens = tokens
		this.consume()
	}
	consume(n = 1) {
		const old = this.item
		this.index += n
		this.item = this.tokens.at(this.index)
		return old
	}
	next() {
		return this.tokens.at(this.index + 1)
	}
}

function expectAndConsume<T extends AnyToken>(s: TokenStream, tokenType: T['type']): T {
	const token = s.item
	if (token?.type !== tokenType)
		throwSyntaxError(token!, `Expected '${tokenType}' at %POS found '${token!.type}' instead`)
	s.consume()
	return token as T
}

function parseTargetSelectorArguments(s: TokenStream): Record<string, AnySyntaxToken> {
	// TODO Add parsing for arguments
	const args = {}

	return args
}

function parseTargetSelector(s: TokenStream): ISyntaxTokens['targetSelector'] {
	const { line, column } = s.item!
	const tokens: AnyToken[] = [s.item!]

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

function parseGenericCommand(s: TokenStream): AnySyntaxToken {
	const name = s.item as ITokens['literal']
	switch (name.value) {
		default:
			break
	}

	// Unknown command
	const { line, column } = s.item!
	s.consume() // Consume command name
	expectAndConsume(s, 'space')

	const tokens: AnyToken[] = []
	while (s.item) {
		if (s.item.type === 'newline') break
		if (s.item.value) {
			tokens.push(s.item)
		}
		s.consume()
	}
	return {
		type: 'unknownCommand',
		name: name.value,
		content: tokens.map(v => String(v.value)).join(''),
		line,
		column,
	}
}

function combineRepeatedAdjacentControlsIntoLiteral(s: TokenStream): ITokens['literal'] {
	const { line, column } = s.item!
	let value = (s.consume() as ITokens['control']).value

	while (s.item?.type === 'control' || s.item?.type === 'literal') {
		value += s.item.value
		s.consume()
	}

	return {
		type: 'literal',
		value,
		line,
		column,
	}
}

function combineAdjacentControlAndIntIntoLiteral(s: TokenStream): ITokens['literal'] {
	const { line, column } = s.item!
	let value = (s.consume() as ITokens['control']).value

	value += String((s.item as ITokens['int']).value)
	s.consume()

	// console.log(value)

	return {
		type: 'literal',
		value,
		line,
		column,
	}
}

function firstPass(tokens: AnyToken[], customFirstPass?: (tokens: TokenStream) => boolean) {
	const newTokens: AnyToken[] = []
	const s = new TokenStream(tokens)

	while (s.item) {
		if (s.item.type === 'control') {
			switch (s.next()?.type) {
				case 'control':
					newTokens.push(combineRepeatedAdjacentControlsIntoLiteral(s))
					break
				case 'int':
				case 'float':
					newTokens.push(combineAdjacentControlAndIntIntoLiteral(s))
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
	customSecondPass?: (tokens: TokenStream, syntax: AnySyntaxToken[]) => boolean
): AnySyntaxToken[] {
	const tree: AnySyntaxToken[] = []
	const s = new TokenStream(tokens)

	while (s.item) {
		if (s.item?.type === 'newline') {
			s.consume()
		} else if (s.item?.type === 'comment') {
			s.consume()
		} else if (s.item?.type === 'literal') {
			tree.push(parseGenericCommand(s))
		} else
			throwSyntaxError(s.item, `Unexpected Token '${s.item.value}'(${s.item.type}) at %POS`)
	}

	return tree
}

export function parse(
	tokens: AnyToken[],
	customFirstPass?: (tokens: TokenStream) => boolean,
	customSecondPass?: (tokens: TokenStream, syntax: AnySyntaxToken[]) => boolean
): AnySyntaxToken[] {
	let tree = firstPass(tokens, customFirstPass)
	return secondPass(tree, customSecondPass)
}
