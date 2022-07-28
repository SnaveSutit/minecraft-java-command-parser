import { CharacterStream as Stream } from './stream'
import { genComparison as comp } from './util'

export interface Token {
	type: string
	raw: string
	line: number
	column: number
}

export interface TokenComment extends Token {
	type: 'comment'
	comment: string
}

export interface TokenUnquotedString extends Token {
	type: 'unquotedString'
	value: string
}

export interface TokenBoolean extends Token {
	type: 'boolean'
	value: boolean
}

type EntitySelectorTarget = 'a' | 'e' | 'p' | 's' | 'r'

export interface TokenEntitySelector extends Token {
	type: 'entitySelector'
	target: EntitySelectorTarget
	subSelectors?: TokenEntitySubSelector[]
}

export interface TokenEntitySubSelector extends Token {
	type: 'entitySubSelector'
	key: string
	value?: Token
	inverted?: boolean
}

export interface TokenEntity extends Token {
	type: 'entity'
	entity: TokenEntitySelector | TokenPlayerName | TokenFakePlayer | TokenUuid
}

export interface TokenResourceLocation extends Token {
	type: 'resourceLocation'
	namespace?: string
	id: string
}

export interface TokenByte extends Token {
	type: 'byte'
	value: number
}

export interface TokenShort extends Token {
	type: 'short'
	value: number
}

export interface TokenInt extends Token {
	type: 'int'
	value: number
	indicator?: string
}

export interface TokenLong extends Token {
	type: 'long'
	value: number
}

export interface TokenFloat extends Token {
	type: 'float'
	value: number
}

export interface TokenDouble extends Token {
	type: 'double'
	value: number
}

export interface TokenIntRange extends Token {
	type: 'intRange'
	min?: TokenInt
	max?: TokenInt
}

export interface TokenDoubleRange extends Token {
	type: 'doubleRange'
	min?: TokenDouble
	max?: TokenDouble
}

export interface TokenScoreCheck extends Token {
	type: 'scoreCheck'
	objective: string
	value: TokenInt | TokenIntRange
	inverted?: boolean
}

export interface TokenScoresObject extends Token {
	type: 'scoresObject'
	checks: TokenScoreCheck[]
}

export interface TokenAdvancementCheck extends Token {
	type: 'advancementCheck'
	advancement: TokenResourceLocation
	value: TokenBoolean
}

export interface TokenAdvancementObject extends Token {
	type: 'advancementObject'
	checks: TokenAdvancementCheck[]
}

export interface TokenNbtObject extends Token {
	type: 'nbtObject'
	object: { [key: string]: TokenAnyNbt }
}

export interface TokenNbtList extends Token {
	type: 'nbtList'
	itemType: string
	items: TokenAnyNbt[]
}

export interface TokenString extends Token {
	type: 'string'
	value: string
}

export interface TokenLiteral extends Token {
	type: 'literal'
	value: string
}

export interface TokenRotVec2 extends Token {
	type: 'rotVec2'
	x: TokenCoordinate
	z: TokenCoordinate
	scope?: 'relative'
}

export interface TokenCoordinate extends Token {
	type: 'coordinate'
	value: TokenDouble
	scope?: 'local' | 'relative'
}

export interface TokenPosVec3 extends Token {
	type: 'posVec3'
	x: TokenCoordinate
	y: TokenCoordinate
	z: TokenCoordinate
}

export interface TokenPosVec2 extends Token {
	type: 'posVec2'
	x: TokenCoordinate
	z: TokenCoordinate
}

export interface TokenPlayerName extends Token {
	type: 'playerName'
	value: TokenString | TokenUnquotedString
}

export interface TokenFakePlayer extends Token {
	type: 'fakePlayer'
	value: TokenString | TokenUnquotedString
}

export interface TokenUuid extends Token {
	type: 'uuid'
	n0: string
	n1: string
	n2: string
	n3: string
	n4: string
}

interface BlockStates {
	[key: string]: TokenString | TokenUnquotedString | TokenBoolean | TokenInt
}

export interface TokenBlock extends Token {
	type: 'block'
	id: TokenResourceLocation
	blockStates?: BlockStates
	nbt?: TokenNbtObject
}

export interface TokenItem extends Token {
	type: 'item'
	id: TokenResourceLocation
	nbt?: TokenNbtObject
}

export interface TokenJson extends Token {
	type: 'json'
	json: any
}

export interface TokenNbtPath extends Token {
	type: 'nbtPath'
	path: string
}

export interface TokenSwizzle extends Token {
	type: 'swizzle'
	value: string
}

export interface TokenArray<T> extends Token {
	type: 'array'
	array: T[]
}

export type TokenAnyNbt =
	| TokenNbtObject
	| TokenNbtList
	| TokenString
	| TokenBoolean
	| TokenByte
	| TokenShort
	| TokenInt
	| TokenLong
	| TokenFloat
	| TokenDouble

// export type TokenAny =
// 	| Token
// 	| TokenInt
// 	| TokenJson
// 	| TokenByte
// 	| TokenItem
// 	| TokenUuid
// 	| TokenLong
// 	| TokenBlock
// 	| TokenShort
// 	| TokenFloat
// 	| TokenAnyNbt
// 	| TokenDouble
// 	| TokenString
// 	| TokenDouble
// 	| TokenBoolean
// 	| TokenComment
// 	| TokenCommand
// 	| TokenLiteral
// 	| TokenNbtList
// 	| TokenNbtPath
// 	| TokenPosVec2
// 	| TokenPosVec3
// 	| TokenSwizzle
// 	| TokenIntRange
// 	| TokenNbtObject
// 	| TokenFakePlayer
// 	| TokenCoordinate
// 	| TokenPlayerName
// 	| TokenDoubleRange
// 	| TokenScoresObject
// 	| TokenEntity
// 	| TokenUnknownCommand
// 	| TokenUnquotedString
// 	| TokenEntitySelector
// 	| TokenResourceLocation
// 	| TokenEntitySubSelector
// 	| TokenAdvancementObject
// 	| TokenRotVec2

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'
export const CHARS = {
	QUOTES: comp(`'"`),
	SPACING: comp(' \t'),
	SWIZZLE: comp('xyz'),
	NUMBER: comp(numbers),
	NEWLINES: comp('\n\r'),
	SINGLE_QUOTES: comp(`'`),
	DOUBLE_QUOTES: comp(`"`),
	BOOLEAN_START: comp('tf'),
	WHITESPACE: comp(' \t\n\r'),
	FAKE_PLAYER_START: comp('.#*'),
	INT_START: comp(`-${numbers}`),
	NUMBER_TYPE: comp(`bBsSlLfFdD`),
	SELECTOR_TARGETS: comp('aepsr'),
	NUMBER_START: comp(`-.${numbers}`),
	UUID: comp(`${numbers}abcdefABCDEF-`),
	COMMAND_NAME: comp(`${alphabet}${alphabet.toUpperCase()}`),
	WORD: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_`),
	OBJECT_KEY: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_`),
	PLAYER_NAME: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_`),
	ENTITY_TAG: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_+.-`),
	FAKE_PLAYER: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_.#*`),
	UNQUOTED_STRING: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_.-`),
	RESOURCE_LOCATION: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_:/.`),
	SCOREBOARD_OBJECTIVE: comp(`${numbers}${alphabet}${alphabet.toUpperCase()}_.-`),
}
export const SETTINGS = {
	multilineCommandsEnabled: false,
}
export const GLOBALS = {
	multiline: false,
}

export class MinecraftSyntaxError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'MinecraftSyntaxError'
	}
}

function createPointerErrorMessage(s: Stream, line: number, column: number) {
	const lineStart = s.lineNumberToIndex(line)
	const i = s.seek('\n')! - 1
	const halfTerm = Math.ceil(process.stdout.columns / 2)
	let start = s.slice(lineStart, lineStart + column).replaceAll('\t', ' ')
	if (column > halfTerm) start = start.slice(column - halfTerm)
	const end = s.slice(lineStart + column, i).slice(0, process.stdout.columns - start.length)
	let spacing = ''
	if (column > 0) spacing = ' '.repeat(start.length)
	return `${start}${end}\n${spacing}^`
}

export function throwSyntaxError(
	s: Stream,
	message: string,
	line?: number,
	column?: number
): never {
	if (!line) line = s.line
	if (!column) column = s.column
	throw new MinecraftSyntaxError(
		`${message} at ${line}:${column}\n${createPointerErrorMessage(s, line, column - 1)}`
	)
}

export function assertItem(
	s: Stream,
	char: string,
	errorMessage: string,
	line?: number,
	column?: number
) {
	if (s.item !== char) throwSyntaxError(s, errorMessage, line, column)
}

function consumeWhitespace(s: Stream, inline?: boolean) {
	if (inline) s.consumeWhile(s => CHARS.SPACING(s.item))
	else s.consumeWhile(s => CHARS.WHITESPACE(s.item))
}

export function expectEndOfLine(s: Stream) {
	consumeWhitespace(s, true)
	if (s.item === undefined) return
	if (GLOBALS.multiline && s.item === '|') return
	if (!CHARS.NEWLINES(s.item)) throwSyntaxError(s, 'Expected EOL')
}

/**
 * Consume the next character if it's whitespace, if not, throw a syntax error.
 *
 * Throw if there are 2 space characters in a row
 */
export function expectAndConsumeEOA(s: Stream) {
	if (s.item === undefined) return
	if (s.look(0, 2) === '  ') throwSyntaxError(s, 'Too much whitespace', undefined, s.column + 1)
	else if (CHARS.WHITESPACE(s.item)) {
		if (CHARS.SPACING(s.item)) s.consume()
		// s.consume()
	} else throwSyntaxError(s, 'Expected whitespace to end argument')
}

function optionalValue<T extends Token>(
	s: Stream,
	collectFunc: (s: Stream, ...args: any[]) => T,
	args?: any[]
): undefined | T {
	if (s.item !== ',') return args ? collectFunc(s, ...args) : collectFunc(s)
}

// * Token Collectors * //
function collectComment(s: Stream): TokenComment {
	const line = s.line
	const column = s.column
	s.consume() // Consume #
	const str = s.collect(s => !CHARS.NEWLINES(s.item))
	return {
		type: 'comment',
		comment: str,
		raw: `#${str}`,
		line,
		column,
	}
}

function collectBoolean(s: Stream): TokenBoolean {
	const line = s.line
	const column = s.column
	let value = false

	if (s.look(0, 4) === 'true') {
		value = true
		s.consume(4)
	} else if (s.look(0, 5) === 'false') {
		s.consume(5)
	} else {
		throwSyntaxError(s, 'Expected boolean', line, column)
	}

	return {
		type: 'boolean',
		value,
		raw: `${value ? 'true' : 'false'}`,
		line,
		column,
	}
}

function collectString(
	s: Stream,
	allowUnquoted: true,
	allowedQuotes?: (c?: string) => boolean,
	allowEscapedQuotes?: boolean,
	unquotedAllowedCharacters?: (c?: string) => boolean,
	unquotedInverted?: boolean
): TokenString | TokenUnquotedString
function collectString(
	s: Stream,
	allowUnquoted?: false,
	allowedQuotes?: (c?: string) => boolean,
	allowEscapedQuotes?: boolean,
	unquotedAllowedCharacters?: (c?: string) => boolean,
	unquotedInverted?: boolean
): TokenString
function collectString(
	s: Stream,
	allowUnquoted?: boolean,
	allowedQuotes = CHARS.QUOTES,
	allowEscapedQuotes?: boolean,
	unquotedAllowedCharacters?: (c?: string) => boolean,
	unquotedInverted?: boolean
) {
	if (allowedQuotes(s.item)) {
		const line = s.line
		const column = s.column
		const quote = s.item!
		s.consume()
		let value = ''
		while (s.item) {
			value += s.collect(s => !(s.item === quote))
			if (s.look(-1, 1) === '\\') {
				if (!allowEscapedQuotes)
					throwSyntaxError(s, 'Invalid string. Escaped quotes are not allowed')
				value += s.item
				s.consume()
			} else {
				break
			}
		}
		assertItem(
			s,
			quote,
			`Invalid string. Missing closing ${quote} for string starting`,
			line,
			column
		)
		s.consume()
		return { type: 'string', value, raw: `${quote}${value}${quote}` }
	} else if (allowUnquoted) {
		return collectUnquotedString(s, unquotedAllowedCharacters, unquotedInverted)
	} else throwSyntaxError(s, 'Expected quoted string')
}

function collectUnquotedString(
	s: Stream,
	compFunc = CHARS.UNQUOTED_STRING,
	inverted?: boolean
): TokenUnquotedString {
	const line = s.line
	const column = s.column
	let str
	if (inverted) str = s.collect(s => !compFunc(s.item))
	else str = s.collect(s => compFunc(s.item))
	if (!str) throwSyntaxError(s, 'Expected unquoted string')
	return {
		type: 'unquotedString',
		value: str,
		raw: str,
		line,
		column,
	}
}

export function collectLiteral<V extends string[]>(
	s: Stream,
	expectedValues: V
): TokenLiteral & { value: V[any] } {
	const line = s.line
	const column = s.column

	const str = expectedValues.find(v => s.look(0, v.length) === v)!
	if (!str) throwSyntaxError(s, `Expected string literal <${expectedValues.join(' | ')}>`)
	s.consume(str.length)
	return { type: 'literal', value: str, raw: str, line, column }
}

function collectInt<T extends string[]>(
	s: Stream,
	allowedIndicators?: T
): TokenInt & { indicator?: T[any] } {
	const line = s.line
	const column = s.column

	let sign = ''
	if (s.item === '-') {
		sign = '-'
		s.consume()
	}
	const num = s.collect(s => CHARS.NUMBER(s.item))
	if (!num) throwSyntaxError(s, 'Expected int')
	const value = Number(sign + num)
	if (value > 2147483647 || -2147483648 > value)
		throwSyntaxError(s, `Int value '${value}' out of range (-2147483648..2147483647)`)

	let indicator
	if (allowedIndicators) indicator = allowedIndicators.find(v => s.item === v)
	if (indicator) s.consume()

	return {
		type: 'int',
		value,
		indicator,
		raw: `${sign}${num}${indicator ? indicator : ''}`,
		line,
		column,
	}
}

function collectDouble(s: Stream): TokenDouble {
	const line = s.line
	const column = s.column

	let sign = ''
	if (s.item === '-') {
		sign = '-'
		s.consume()
	}
	let num = ''
	num += s.collect(s => CHARS.NUMBER(s.item))
	if (s.item === '.' && CHARS.NUMBER(s.look(1, 1))) {
		num += '.'
		s.consume()
		num += s.collect(s => CHARS.NUMBER(s.item))
	}

	if (!num) throwSyntaxError(s, 'Expected double')

	const value = Number(sign + num)

	return { type: 'double', value, raw: `${sign}${num}`, line, column }
}

function collectNumber(
	s: Stream,
	expectedType?: 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'
): TokenByte | TokenShort | TokenInt | TokenLong | TokenFloat | TokenDouble {
	const line = s.line
	const column = s.column

	let isFloating
	let sign = ''
	if (s.item === '-') {
		sign = '-'
		s.consume()
	}
	let num = ''
	num += s.collect(s => CHARS.NUMBER(s.item))
	// Check for floating point
	if (s.item === '.' && CHARS.NUMBER(s.look(1, 1))) {
		num += '.'
		s.consume()
		num += s.collect(s => CHARS.NUMBER(s.item))
		isFloating = true
	}

	if (!num) throwSyntaxError(s, `Expected number`)

	let typeChar
	if (CHARS.NUMBER_TYPE(s.item)) {
		typeChar = s.item
		s.consume()
	}
	let _type: 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'
	switch (typeChar?.toLowerCase()) {
		case 'b':
			_type = 'byte'
			break
		case 's':
			_type = 'short'
			break
		case 'l':
			_type = 'long'
			break
		case 'f':
			_type = 'float'
			break
		case 'd':
			_type = 'double'
			break
		default:
			_type = isFloating ? 'double' : 'int'
			break
	}

	if (expectedType && _type !== expectedType) throwSyntaxError(s, `Expected ${expectedType}`)

	const value = Number(sign + num)
	return { type: _type, value, raw: `${sign}${num}${typeChar ? typeChar : ''}`, line, column }
}

function collectResourceLocation(s: Stream): TokenResourceLocation {
	const line = s.line
	const column = s.column

	let namespace, id
	let str = ''
	if (s.item === '#') {
		str += '#'
		s.consume()
	}
	str += s.collect(s => CHARS.RESOURCE_LOCATION(s.item))

	if (str.includes(':')) {
		;[namespace, id] = str.split(':')
	} else {
		id = str
	}

	if (!id) throwSyntaxError(s, 'Invalid resource location')
	return {
		type: 'resourceLocation',
		namespace,
		id,
		raw: `${namespace ? `${namespace}:` : ''}${id}`,
		line,
		column,
	}
}

function collectRangeableInt(s: Stream): TokenInt | TokenIntRange {
	const line = s.line
	const column = s.column

	let min: TokenInt
	let max: TokenInt

	if (s.look(0, 2) === '..') {
		// Maximum only range
		s.consume(2)
		consumeWhitespace(s, true)
		max = collectInt(s)
		return { type: 'intRange', max, raw: `..${max.raw}`, line, column }
	} else {
		// Possible single value OR complete range OR only range
		min = collectInt(s)
		consumeWhitespace(s, true)
		if (s.look(0, 2) === '..') {
			// Possible complete range OR minimum only range
			s.consume(2)
			consumeWhitespace(s, true)
			if (CHARS.NUMBER(s.item)) {
				max = collectInt(s)
				return {
					type: 'intRange',
					min,
					max,
					raw: `${min.raw}..${max.raw}`,
					line,
					column,
				}
			}
			return { type: 'intRange', min, raw: `${min.raw}..`, line, column }
		} else {
			// Single value
			return min
		}
	}
}

function collectRangeableDouble(s: Stream): TokenDouble | TokenDoubleRange {
	const line = s.line
	const column = s.column

	let min: TokenDouble
	let max: TokenDouble

	if (s.look(0, 2) === '..') {
		// Maximum only range
		s.consume(2)
		consumeWhitespace(s, true)
		max = collectDouble(s)
		return { type: 'doubleRange', max, raw: `..${max.raw}`, line, column }
	} else {
		// Possible single value OR complete range OR only range
		min = collectDouble(s)
		consumeWhitespace(s, true)
		if (s.look(0, 2) === '..') {
			// Possible complete range OR minimum only range
			s.consume(2)
			consumeWhitespace(s, true)
			if (CHARS.NUMBER(s.item)) {
				max = collectDouble(s)
				return {
					type: 'doubleRange',
					min,
					max,
					raw: `${min.raw}..${max.raw}`,
					line,
					column,
				}
			}
			return { type: 'doubleRange', min, raw: `${min.raw}..`, line, column }
		} else {
			// Single value
			return min
		}
	}
}

function collectSwizzle(s: Stream): TokenSwizzle {
	const line = s.line
	const column = s.column

	let value = ''
	s.consumeWhile(s => {
		if (value.length < 3 && CHARS.SWIZZLE(s.item)) {
			if (s.item && value.includes(s.item))
				throwSyntaxError(s, 'Cannot have duplicate axies in swizzle')
			else value += s.item
			return true
		}
	})
	if (!value) throwSyntaxError(s, 'Expected swizzle')

	return {
		type: 'swizzle',
		value,
		raw: value,
		line,
		column,
	}
}

function collectCoordinateScope(s: Stream) {
	switch (s.item) {
		case '~':
			s.consume()
			return 'relative'
		case '^':
			s.consume()
			return 'local'
	}
}

function collectRotVec2(s: Stream): TokenRotVec2 {
	const line = s.line
	const column = s.column

	let x!: TokenCoordinate, z!: TokenCoordinate
	let error
	try {
		x = collectCoordinate(s)
		expectAndConsumeEOA(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error || !x) throwSyntaxError(s, 'Expected first coordinate of rot vec2')
	try {
		z = collectCoordinate(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error || !z) throwSyntaxError(s, 'Expected second coordinate of rot vec2')

	if (x.scope === 'local' || z.scope === 'local') {
		throwSyntaxError(
			s,
			'Invalid rot vec2. Cannot use local scope in rotations',
			undefined,
			s.column - `${x!.raw} ${z!.raw}`.length
		)
	}

	return {
		type: 'rotVec2',
		x,
		z,
		raw: `${x.raw} ${z.raw}`,
		line,
		column,
	}
}

function collectCoordinate(s: Stream): TokenCoordinate {
	const line = s.line
	const column = s.column

	const scope = collectCoordinateScope(s)
	const sign = s.look(0, 1)
	let value!: TokenDouble
	try {
		value = collectDouble(s)
	} catch (err) {
		if (!scope || sign === '-') throwSyntaxError(s, 'Expected coordinate')
	}
	return {
		type: 'coordinate',
		value,
		scope: scope,
		raw: `${scope === 'relative' ? '~' : scope === 'local' ? '^' : ''}${
			value ? value.raw : ''
		}`,
		line,
		column,
	}
}

function collectPosVec3(s: Stream): TokenPosVec3 {
	const line = s.line
	const column = s.column

	let x!: TokenCoordinate, y!: TokenCoordinate, z!: TokenCoordinate
	let error
	try {
		x = collectCoordinate(s)
		expectAndConsumeEOA(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error || !x) throwSyntaxError(s, 'Expected first coordinate of pos vec3')
	try {
		y = collectCoordinate(s)
		expectAndConsumeEOA(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error || !y) throwSyntaxError(s, 'Expected second coordinate of pos vec3')
	try {
		z = collectCoordinate(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error || !z) throwSyntaxError(s, 'Expected third coordinate of pos vec3')

	if (
		(x.scope === 'local' || y.scope === 'local' || z.scope === 'local') &&
		!(x.scope === 'local' && y.scope === 'local' && z.scope === 'local')
	)
		throwSyntaxError(
			s,
			'Invalid pos vec3. Cannot mix local coordinate scope with relative or global scopes',
			undefined,
			column
		)

	return {
		type: 'posVec3',
		x,
		y,
		z,
		raw: `${x.raw} ${y.raw} ${z.raw}`,
		line,
		column,
	}
}

function collectPosVec2(s: Stream): TokenPosVec2 {
	const line = s.line
	const column = s.column

	let x!: TokenCoordinate, z!: TokenCoordinate
	let error
	try {
		x = collectCoordinate(s)
		expectAndConsumeEOA(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error || !x) throwSyntaxError(s, 'Expected first coordinate of pos vec2')
	try {
		z = collectCoordinate(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error || !z) throwSyntaxError(s, 'Expected second coordinate of pos vec2')

	if (
		(x.scope === 'local' || z.scope === 'local') &&
		!(x.scope === 'local' && z.scope === 'local')
	)
		throwSyntaxError(
			s,
			'Invalid pos vec2. Cannot mix local coordinate scope with relative or global scopes',
			undefined,
			column
		)

	return {
		type: 'posVec2',
		x,
		z,
		raw: `${x.raw} ${z.raw}`,
		line,
		column,
	}
}

function collectScoresObject(s: Stream): TokenScoresObject {
	const token: TokenScoresObject = {
		type: 'scoresObject',
		checks: [],
		raw: '',
		line: s.line,
		column: s.column,
	}
	assertItem(s, '{', 'Invalid scores object')
	s.consume()
	consumeWhitespace(s, !GLOBALS.multiline)

	while (s.item) {
		const line = s.line
		const column = s.column
		const key = s.collect(s => CHARS.SCOREBOARD_OBJECTIVE(s.item))
		consumeWhitespace(s, !GLOBALS.multiline)
		assertItem(s, '=', 'Invalid scores object. Missing =')
		s.consume()
		consumeWhitespace(s, !GLOBALS.multiline)
		const range = collectRangeableInt(s)
		token.checks.push({
			type: 'scoreCheck',
			objective: key,
			value: range,
			raw: `${key}=${range.raw}`,
			line,
			column,
		})
		consumeWhitespace(s, !GLOBALS.multiline)

		if (s.item === '}') {
			s.consume()
			token.raw = `{${token.checks.map(v => v.raw).join(',')}}`
			return token
		} else if (s.item === ',') {
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
		} else throwSyntaxError(s, 'Invalid scores object. Missing ,')
	}

	throwSyntaxError(s, 'Invalid scores object. Missing closing }')
}

function collectAdvancementObject(s: Stream): TokenAdvancementObject {
	const token: TokenAdvancementObject = {
		type: 'advancementObject',
		checks: [],
		raw: '',
		line: s.line,
		column: s.column,
	}
	assertItem(s, '{', 'Invalid advancements object')
	s.consume()
	consumeWhitespace(s, !GLOBALS.multiline)

	while (s.item) {
		const line = s.line
		const column = s.column

		const advancement = collectResourceLocation(s)
		consumeWhitespace(s, !GLOBALS.multiline)
		assertItem(s, '=', 'Invalid advancements object')
		s.consume()
		consumeWhitespace(s, !GLOBALS.multiline)
		const value = collectBoolean(s)
		consumeWhitespace(s, !GLOBALS.multiline)
		token.checks.push({
			type: 'advancementCheck',
			advancement,
			value,
			raw: `${advancement.raw}=${value.raw}`,
			line,
			column,
		})

		if (s.item === '}') {
			s.consume()
			token.raw = `{${token.checks.map(v => v.raw).join(',')}}`
			return token
		} else if (s.item === ',') {
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
			if (!CHARS.WORD(s.item)) throwSyntaxError(s, 'Expected advancement check after ,')
		} else throwSyntaxError(s, 'Invalid advancement object. Missing ,')
	}

	throwSyntaxError(s, 'Invalid advancement object. Missing closing curly bracket')
}

function collectNbtList(s: Stream): TokenNbtList {
	const line = s.line
	const column = s.column

	const items: TokenAnyNbt[] = []
	let itemType!: string
	assertItem(s, '[', 'Invalid NBT list')
	s.consume()
	consumeWhitespace(s, !GLOBALS.multiline)

	while (s.item) {
		let value!: TokenAnyNbt
		switch (itemType) {
			default:
				if (CHARS.NUMBER_START(s.item)) {
					value = collectNumber(s)
				} else if (CHARS.QUOTES(s.item)) {
					value = collectString(s)
				} else if (s.item === '{') {
					value = collectNbtObject(s)
				}
				itemType = value?.type
				if (!itemType) throwSyntaxError(s, 'Unknown type for list')
				break
			case 'byte':
			case 'short':
			case 'int':
			case 'long':
			case 'float':
			case 'double':
				value = collectNumber(s, itemType)
				break
			case 'string':
				value = collectString(s)
				break
			case 'nbtObject':
				value = collectNbtObject(s)
		}
		items.push(value)
		consumeWhitespace(s, !GLOBALS.multiline)
		if (s.item === ',') {
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
		}
		if (s.item === ']') {
			s.consume()
			break
		}
	}

	return {
		type: 'nbtList',
		itemType,
		items,
		raw: `[${items.map(v => v.raw).join(',')}]`,
		line,
		column,
	}
}

function collectNbtObject(s: Stream): TokenNbtObject {
	const line = s.line
	const column = s.column

	const obj: { [key: string]: TokenAnyNbt } = {}
	assertItem(s, '{', 'Invalid NBT object. Missing {')
	s.consume()
	consumeWhitespace(s, !GLOBALS.multiline)

	if (!(s.item === '}')) {
		while (s.item) {
			const key = CHARS.QUOTES(s.item)
				? collectString(s).raw
				: s.collect(s => CHARS.OBJECT_KEY(s.item))
			consumeWhitespace(s, !GLOBALS.multiline)
			assertItem(s, ':', 'Invalid NBT object. Missing :')
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
			let value
			if (CHARS.NUMBER_START(s.item)) {
				value = collectNumber(s)
			} else if (CHARS.QUOTES(s.item)) {
				value = collectString(s)
			} else if (s.item === 'f' || s.item === 't') {
				value = collectBoolean(s)
			} else if (s.item === '[') {
				value = collectNbtList(s)
			} else if (s.item === '{') {
				value = collectNbtObject(s)
			}

			if (value === undefined) throwSyntaxError(s, `Expected value for '${key}'`)
			obj[key] = value

			consumeWhitespace(s, !GLOBALS.multiline)
			if (s.item === '}') {
				s.consume()
				break
			} else if (s.item === ',') {
				s.consume()
				consumeWhitespace(s, !GLOBALS.multiline)
			} else throwSyntaxError(s, 'Expected ,')
		}
	} else s.consume()

	return {
		type: 'nbtObject',
		object: obj,
		raw: `{${Object.entries(obj).map(([k, v]) => `${k}:${v.raw}`)}}`,
		line,
		column,
	}
}

function collectNbtPath(s: Stream): TokenNbtPath {
	const line = s.line
	const column = s.column

	let path = ''
	while (s.item) {
		if (CHARS.QUOTES(s.item)) {
			path += collectString(s).raw
		} else if (CHARS.WHITESPACE(s.item)) {
			break
		} else {
			path += s.item
			s.consume()
		}
	}

	return {
		type: 'nbtPath',
		path,
		raw: path,
		line,
		column,
	}
}

function collectAnyNbt(s: Stream): TokenAnyNbt {
	let value!: TokenAnyNbt
	if (CHARS.NUMBER_START(s.item)) {
		value = collectNumber(s)
	} else if (CHARS.QUOTES(s.item)) {
		value = collectString(s)
	} else if (s.item === 'f' || s.item === 't') {
		value = collectBoolean(s)
	} else if (s.item === '[') {
		value = collectNbtList(s)
	} else if (s.item === '{') {
		value = collectNbtObject(s)
	}
	return value
}

function collectItemPredicate(s: Stream): TokenItem {
	const line = s.line
	const column = s.column

	let nbt
	const id = collectResourceLocation(s)
	if (s.item === '{') nbt = collectNbtObject(s)

	return {
		type: 'item',
		id,
		nbt,
		raw: `${id.raw}${nbt ? nbt.raw : ''}`,
		line,
		column,
	}
}

function collectBlockStates(s: Stream): BlockStates {
	const states: BlockStates = {}
	assertItem(s, '[', 'Invalid blockstate')
	s.consume()
	consumeWhitespace(s, !GLOBALS.multiline)

	while (s.item) {
		const key = s.collect(s => CHARS.UNQUOTED_STRING(s.item))
		consumeWhitespace(s, !GLOBALS.multiline)
		assertItem(s, '=', 'Invalid blockstate')
		s.consume()
		consumeWhitespace(s, !GLOBALS.multiline)
		let value
		if (CHARS.BOOLEAN_START(s.item)) value = collectBoolean(s)
		else if (CHARS.QUOTES(s.item)) value = collectString(s)
		else if (CHARS.UNQUOTED_STRING(s.item)) value = collectUnquotedString(s)
		else if (CHARS.INT_START(s.item)) value = collectInt(s)
		else throwSyntaxError(s, `Expected value for key '${key}'`)

		consumeWhitespace(s, !GLOBALS.multiline)
		states[key] = value

		if (s.item === ']') {
			s.consume()
			return states
		} else if (s.item === ',') {
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
		} else throwSyntaxError(s, 'Invalid blockstate. Missing ,')
	}

	throwSyntaxError(s, 'Invalid blockstate. Missing closing curly bracket')
}

function collectBlockPredicate(s: Stream, allowNbt: boolean = true): TokenBlock {
	const line = s.line
	const column = s.column

	let nbt, blockStates
	const id = collectResourceLocation(s)
	if (s.item === '[') blockStates = collectBlockStates(s)
	if (allowNbt && s.item === '{') nbt = collectNbtObject(s)

	return {
		type: 'block',
		id,
		blockStates,
		nbt,
		raw: `${id.raw}${
			blockStates
				? `[${Object.entries(blockStates)
						.map(([k, v]) => `${k}=${v.raw}`)
						.join(',')}]`
				: ''
		}${nbt ? nbt.raw : ''}`,
		line,
		column,
	}
}

function collectSubSelectors(s: Stream): TokenEntitySubSelector[] {
	const tokens: TokenEntitySubSelector[] = []

	function isInverted(s: Stream, canInvert: boolean, key: string) {
		if (s.item === '!') {
			if (!canInvert)
				throwSyntaxError(
					s,
					`Invalid entity subselector. Cannot invert entity subselector '${key}'`,
					undefined,
					s.column
				)
			s.consume()
			return true
		}
	}

	function collect(): TokenEntitySubSelector {
		const line = s.line
		const column = s.column

		const key = s.collect(s => CHARS.WORD(s.item))
		consumeWhitespace(s, !GLOBALS.multiline)
		assertItem(s, '=', 'Invalid entity subselector. Missing =')
		s.consume()
		consumeWhitespace(s, !GLOBALS.multiline)
		let inverted
		let value: Token | undefined
		switch (key) {
			// x = <float>
			case 'x':
			// y = <float>
			case 'y':
			// z = <float>
			case 'z':
			// dx = <float>
			case 'dx':
			// dy = <float>
			case 'dy':
			// dz = <float>
			case 'dz':
				inverted = isInverted(s, false, key)
				value = collectDouble(s)
				break
			// limit = <int>
			case 'limit':
				inverted = isInverted(s, false, key)
				value = collectInt(s)
				break
			// level = <rangeableInt>
			case 'level':
				inverted = isInverted(s, false, key)
				value = collectRangeableInt(s)
				break
			// distance = <rangeableFloat>
			case 'distance':
			// x_rotation = <rangeableFloat>
			case 'x_rotation':
			// y_rotation = <rangeableFloat>
			case 'y_rotation':
				inverted = isInverted(s, false, key)
				value = collectRangeableDouble(s)
				break
			// team = !?<string || unquotedString>
			case 'team':
			// tag = !?<string || unquotedString>
			case 'tag':
				inverted = isInverted(s, true, key)
				if (CHARS.QUOTES(s.item)) value = optionalValue(s, collectString)
				else value = optionalValue(s, collectUnquotedString, [CHARS.ENTITY_TAG])
				break
			// name = !?<string || unquotedString>
			case 'name':
				inverted = isInverted(s, true, key)
				if (CHARS.QUOTES(s.item)) value = optionalValue(s, collectString, [true])
				else value = optionalValue(s, collectUnquotedString, [CHARS.ENTITY_TAG])
				break
			// scores = <scoresObject>
			case 'scores':
				isInverted(s, false, key)
				value = collectScoresObject(s)
				break
			// gamemode = !?<creative|survival|adventure|spectator>
			case 'gamemode':
				inverted = isInverted(s, true, key)
				value = collectLiteral(s, ['creative', 'survival', 'adventure', 'spectator'])
				break
			// sort = <arbitrary|furthest|nearest|random>
			case 'sort':
				inverted = isInverted(s, false, key)
				value = collectLiteral(s, ['arbitrary', 'furthest', 'nearest', 'random'])
				break
			// type = !?<entityId>
			case 'type':
				inverted = isInverted(s, true, key)
				value = collectResourceLocation(s)
				break
			case 'advancements':
				inverted = isInverted(s, false, key)
				value = collectAdvancementObject(s)
				break
			case 'predicate':
				inverted = isInverted(s, true, key)
				value = collectResourceLocation(s)
				break
			case 'nbt':
				inverted = isInverted(s, true, key)
				value = collectNbtObject(s)
				break
			default:
				throwSyntaxError(
					s,
					`Unknown entity subselector '${key}'`,
					undefined,
					s.column - key.length - 1
				)
				break
		}
		return {
			type: 'entitySubSelector',
			key,
			value,
			inverted,
			raw: `${key}=${inverted ? '!' : ''}${value ? value.raw : ''}`,
			line,
			column,
		}
	}

	while (s.item) {
		consumeWhitespace(s, !GLOBALS.multiline)

		if (CHARS.WORD(s.item)) {
			tokens.push(collect())
			consumeWhitespace(s, !GLOBALS.multiline)
		}
		if (s.item === ',') {
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
			if (!CHARS.WORD(s.item)) throwSyntaxError(s, 'Expected entity subselector after ,')
		} else if (s.item === ']') {
			s.consume()
			return tokens
		} else throwSyntaxError(s, 'Invalid entity selector. Missing ,')
	}
	throwSyntaxError(s, 'Invalid entity selector. Missing closing square bracket')
}

function collectEntitySelector(s: Stream): TokenEntitySelector {
	const line = s.line
	const column = s.column
	// assertItem(s, '@', 'Invalid entity selector. Missing @')
	s.consume() // Consume @
	const target = (CHARS.SELECTOR_TARGETS(s.item) ? s.item : '') as EntitySelectorTarget
	if (!target) throwSyntaxError(s, 'Invalid entity selector. Missing target entity list')
	s.consume()
	let subSelectors: TokenEntitySubSelector[] | undefined
	if (s.item === '[') {
		s.consume()
		subSelectors = collectSubSelectors(s)
	}

	return {
		type: 'entitySelector',
		target,
		subSelectors,
		raw: `@${target}${
			subSelectors?.length ? `[${subSelectors.map(v => v.raw).join(',')}]` : ''
		}`,
		line,
		column,
	}
}

function collectPlayerName(s: Stream): TokenPlayerName {
	const line = s.line
	const column = s.column

	const value = collectString(s, true, CHARS.DOUBLE_QUOTES, false, CHARS.PLAYER_NAME)
	if (!value) throwSyntaxError(s, 'Expected player name')

	return {
		type: 'playerName',
		value,
		raw: value.raw,
		line,
		column,
	}
}

function collectFakePlayer(s: Stream): TokenFakePlayer {
	const line = s.line
	const column = s.column

	const value = collectUnquotedString(s, CHARS.FAKE_PLAYER)
	if (!value) throwSyntaxError(s, 'Expected player name')

	return {
		type: 'fakePlayer',
		value,
		raw: value.raw,
		line,
		column,
	}
}

function collectUuid(s: Stream): TokenUuid {
	const line = s.line
	const column = s.column

	let value = s.collect(s => CHARS.UUID(s.item))
	let n0, n1, n2, n3, n4
	try {
		;[n0, n1, n2, n3, n4] = value.split('-')
	} catch (err) {
		throwSyntaxError(s, 'Invalid UUID', undefined, s.column - value.length)
	}

	if (!(n0 && n1 && n2 && n3 && n4))
		throwSyntaxError(s, 'Invalid UUID', undefined, s.column - value.length)

	return {
		type: 'uuid',
		n0,
		n1,
		n2,
		n3,
		n4,
		raw: value,
		line,
		column,
	}
}

function collectEntity(s: Stream, allowFakePlayers: boolean): TokenEntity {
	const line = s.line
	const column = s.column

	let entity: TokenEntitySelector | TokenPlayerName | TokenFakePlayer | TokenUuid

	if (s.item === '@') entity = collectEntitySelector(s)
	else if (s.slice(s.index, s.seek(CHARS.WHITESPACE, 37)).split('-').length === 5) {
		entity = collectUuid(s)
	} else {
		let value!: TokenString | TokenUnquotedString
		try {
			value = collectString(s, true, CHARS.DOUBLE_QUOTES, false, CHARS.FAKE_PLAYER)
		} catch (err: any) {
			if (err.name === 'MinecraftSyntaxError')
				throwSyntaxError(s, 'Expected entity selector, player name, or UUID')
		}
		if ([...value.raw].find(CHARS.FAKE_PLAYER_START)) {
			if (!allowFakePlayers) throwSyntaxError(s, 'Cannot use fakeplayer')
			entity = {
				type: 'fakePlayer',
				value,
				raw: value.raw,
				line,
				column,
			}
		} else {
			entity = {
				type: 'playerName',
				value,
				raw: value.raw,
				line,
				column,
			}
		}
	}
	return { type: 'entity', entity, raw: entity.raw, line, column }
}

function collectCommandName(s: Stream) {
	let name = s.collect(s => CHARS.COMMAND_NAME(s.item))
	if (!name) throwSyntaxError(s, 'Expected command')
	try {
		expectAndConsumeEOA(s)
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError') throwSyntaxError(s, 'Expected end of command name')
		else throw err
	}
	return name
}

function collectJsonArray(s: Stream): any {
	s.consume() // Consume opening [
	const json: any[] = []
	consumeWhitespace(s, !GLOBALS.multiline)

	if (s.item === ']') return json

	while (s.item) {
		let value
		if (s.item === '{') {
			value = collectJsonObject(s)
		} else if (s.item === '[') {
			value = collectJsonArray(s)
		} else if (s.item === '"') {
			value = collectString(s, false, CHARS.DOUBLE_QUOTES).value
		} else if (CHARS.NUMBER_START(s.item)) {
			value = collectDouble(s).value
		} else if (CHARS.BOOLEAN_START(s.item)) {
			value = collectBoolean(s).value
		} else throwSyntaxError(s, `Expected an array item at`)

		json.push(value)
		consumeWhitespace(s, !GLOBALS.multiline)

		if (s.item === ']') {
			s.consume()
			return json
		} else if (s.item === ',') {
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
		} else throwSyntaxError(s, 'Invalid json array. Missing ,')
	}
	throwSyntaxError(s, 'Invalid json array. Missing closing ]')
}

function collectJsonObject(s: Stream): any {
	s.consume() // Consume opening {
	const json: any = {}
	consumeWhitespace(s, !GLOBALS.multiline)

	if (s.item === '}') return json

	while (s.item) {
		const key = collectString(s, false, CHARS.DOUBLE_QUOTES)
		consumeWhitespace(s, !GLOBALS.multiline)
		assertItem(s, ':', 'Invalid blockstate. Missing :')
		s.consume()
		consumeWhitespace(s, !GLOBALS.multiline)

		let value
		if (s.item === '{') {
			value = collectJsonObject(s)
		} else if (s.item === '[') {
			value = collectJsonArray(s)
		} else if (s.item === '"') {
			value = collectString(s, false, CHARS.DOUBLE_QUOTES).value
		} else if (CHARS.NUMBER_START(s.item)) {
			value = collectDouble(s).value
		} else if (CHARS.BOOLEAN_START(s.item)) {
			value = collectBoolean(s).value
		} else throwSyntaxError(s, `Expected a value for key '${key.value}'`)

		json[key.value] = value

		consumeWhitespace(s, !GLOBALS.multiline)

		if (s.item === '}') {
			s.consume()
			return json
		} else if (s.item === ',') {
			s.consume()
			consumeWhitespace(s, !GLOBALS.multiline)
		} else throwSyntaxError(s, 'Invalid json object. Missing ,')
	}
	throwSyntaxError(s, 'Invalid json object. Missing closing ]')
}

function collectJson(s: Stream): TokenJson {
	const line = s.line
	const column = s.column

	let json
	switch (s.item) {
		case '{':
			json = collectJsonObject(s)
			break
		case '[':
			json = collectJsonArray(s)
			break
		case '"':
			json = collectString(s, false, CHARS.DOUBLE_QUOTES).value
			break
		case "'":
		default:
			throwSyntaxError(s, 'Invalid JSON')
			break
	}

	return {
		type: 'json',
		json,
		raw: `${json ? JSON.stringify(json) : ''}`,
		line,
		column,
	}
}

/**
 * Catch-all for undefined commands
 */
export interface TokenUnknownCommand extends Token {
	type: 'unknownCommand'
	name: string
	args: {
		all: TokenUnquotedString
	}
}
function tokenizeUnknownCommand(s: Stream, name: string): TokenUnknownCommand {
	const line = s.line
	const column = s.column

	if (GLOBALS.multiline) throwSyntaxError(s, 'Attempted to multiline an unknown command')
	console.log(`[WARN] Unknown command '${name}' at ${s.line}:${s.column - name.length - 1}`)

	return {
		type: 'unknownCommand',
		name,
		args: {
			all: collectUnquotedString(s, CHARS.NEWLINES, true),
		},
		raw: '',
		line,
		column,
	}
}

interface CommandArgs {
	[key: string]: Token | Token[]
}

export interface TokenCommand extends Token {
	type: 'command'
	id: `${string}:${string}`
	keyword: string
	args: CommandArgs
}

export class CommandRegister {
	id: string
	commands: { [name: string]: Command<TokenCommand> } = {}

	constructor(id: string) {
		this.id = id
		this.commands = {}
	}

	newCommand<T extends TokenCommand>(
		id: T['id'],
		keyword: T['keyword'],
		meta: CommandMeta,
		tokenizer: (s: Stream, token: T, command: Command<T>, context: TokenizerContext) => T
	) {
		if (this.commands[keyword]) throw new Error(`A command named '${keyword}' already exists!`)
		const command = new Command(id, keyword, meta, tokenizer)
		// @ts-ignore
		this.commands[keyword] = command
		return command
	}
}

type CommandMeta = { [key: string]: any }
export class Command<T extends TokenCommand> {
	id: TokenCommand['id']
	keyword: string
	meta: CommandMeta
	tokenizer: (s: Stream, token: T, command: this, context: TokenizerContext) => T
	constructor(
		id: T['id'],
		keyword: T['keyword'],
		meta: CommandMeta,
		tokenizer: (s: Stream, token: T, command: Command<T>, context: TokenizerContext) => T
	) {
		this.id = id
		this.keyword = keyword
		this.meta = meta
		this.tokenizer = tokenizer
	}

	tokenize(s: Stream, context: TokenizerContext): T {
		const token = {
			type: 'command',
			id: this.id,
			keyword: this.keyword,
			args: {},
			raw: '',
		} as T

		try {
			context.stack.push(this)
			this.tokenizer(s, token, this, context)
			context.stack.pop()
		} catch (err: any) {
			if (err.name === 'MinecraftSyntaxError')
				throw new MinecraftSyntaxError(
					`Error while parsing command ${this.keyword} (${this.id})\n${err.message
						.split('\n')
						.join('\n| ')}`
				)
			else
				throw new Error(
					`Error while parsing command ${this.keyword} (${this.id})\n${err.stack
						.split('\n')
						.join('\n| ')}`
				)
		}

		return token
	}

	static requiredArg<V extends Token>(
		s: Stream,
		collectorFunc: (s: Stream, ...args: any[]) => V,
		args?: any[] // Extra arguments for the collector function
	): V {
		if (GLOBALS.multiline) consumeWhitespace(s)
		const result = args ? collectorFunc(s, ...args) : collectorFunc(s)
		expectAndConsumeEOA(s)
		return result
	}

	static optionalArg<V extends Token>(
		s: Stream,
		collectorFunc: (s: Stream, ...args: any[]) => V,
		args?: any[], // Extra arguments for the collector function
		catchErrors?: boolean
	): V | undefined {
		switch (s.item) {
			case '|':
				if (GLOBALS.multiline) return
				break
			case '\n':
			case '\r':
			case undefined:
				if (!GLOBALS.multiline) return
				consumeWhitespace(s)
				break
		}
		try {
			const result = args ? collectorFunc(s, ...args) : collectorFunc(s)
			expectAndConsumeEOA(s)
			return result
		} catch (err) {
			if (!catchErrors) throw err
		}
		return undefined
	}

	// WARNING: Consumes performance to exist. Only use if absolutely necessary
	static choiceArg(
		s: Stream,
		collectors: [(s: Stream, ...args: any[]) => Token, ...any][]
	): [undefined | Token, Error | MinecraftSyntaxError[]] {
		const errors = []
		let result
		for (const [collector, ...args] of collectors) {
			try {
				result = args ? collector(s, ...args) : collector(s)
				errors.push(undefined)
				break
			} catch (err: any) {
				if (err.name !== 'MinecraftSyntaxError') throw err
				errors.push(err)
			}
		}
		if (result) expectAndConsumeEOA(s)
		return [result, errors]
	}
}

export interface TokenizerContext {
	registers: CommandRegister[]
	stack: Command<any>[]
}

function collectCommand(s: Stream, context: TokenizerContext) {
	const line = s.line
	const column = s.column
	const keyword = collectCommandName(s)

	let cmd
	try {
		for (const r of context.registers) {
			cmd = r.commands[keyword]?.tokenize(s, context)
			if (cmd) break
		}
		if (!cmd) cmd = tokenizeUnknownCommand(s, keyword)

		expectEndOfLine(s)
		// Add more context to command syntax errors
	} catch (err: any) {
		if (err.name === 'MinecraftSyntaxError')
			throw new MinecraftSyntaxError(
				GLOBALS.multiline
					? `Failed to parse multiline command '${keyword}' at ${line}:${column}\n${err.message
							.split('\n')
							.join('\n| ')}`
					: `Failed to parse command '${keyword}' at ${line}:${column}\n${err.message
							.split('\n')
							.join('\n| ')}`
			)
		throw new Error(
			GLOBALS.multiline
				? `Encountered unexpected error while parsing multiline command '${keyword}' starting on line ${line}:${column}\n${err.stack
						.split('\n')
						.join('\n| ')}`
				: `Encountered unexpected error while parsing command '${keyword}' on line ${line}:${column}\n${err.stack
						.split('\n')
						.join('\n| ')}`
		)
	}

	const argsStr = Object.values(cmd.args)
		.filter(v => (Array.isArray(v) ? v.length : v)) // Remove sneaky undefined arguments, and empty arrays
		.map(v => (Array.isArray(v) ? v.map(i => i.raw).join(' ') : v.raw))
		.join(' ')
	cmd.raw = `${keyword}${argsStr ? ` ${argsStr}` : ''}`

	return cmd
}

export const TokenCollectors = {
	AnyNbt: collectAnyNbt,
	Block: collectBlockPredicate,
	Boolean: collectBoolean,
	Command: collectCommand,
	Comment: collectComment,
	Coordinate: collectCoordinate,
	CoordinateScope: collectCoordinateScope,
	Double: collectDouble,
	Entity: collectEntity,
	EntitySelector: collectEntitySelector,
	FakePlayer: collectFakePlayer,
	Int: collectInt,
	Item: collectItemPredicate,
	Json: collectJson,
	JsonArray: collectJsonArray,
	JsonObject: collectJsonObject,
	Literal: collectLiteral,
	NBTObject: collectNbtObject,
	NBTPath: collectNbtPath,
	Number: collectNumber,
	PlayerName: collectPlayerName,
	PosVec2: collectPosVec2,
	PosVec3: collectPosVec3,
	RangeableDouble: collectRangeableDouble,
	RangeableInt: collectRangeableInt,
	ResourceLocation: collectResourceLocation,
	RotVec2: collectRotVec2,
	String: collectString,
	Swizzle: collectSwizzle,
	UnquotedString: collectUnquotedString,
	UUID: collectUuid,
}

export const Consumers = {
	whitespace: consumeWhitespace,
}

// TODO Add a way to define different commands/envornments for each tokenize() call
// * Main Parser Logic * //
export function tokenize(
	str: string,
	registers: CommandRegister[],
	allowMultilineCommands?: boolean
): Token[] {
	SETTINGS.multilineCommandsEnabled = Boolean(allowMultilineCommands)

	const tokens: Token[] = []
	const s = new Stream(str)
	const context: TokenizerContext = { registers, stack: [] }
	consumeWhitespace(s)

	while (s.item) {
		if (s.item === '#') {
			tokens.push(collectComment(s))
		} else if (CHARS.COMMAND_NAME(s.item)) {
			tokens.push(collectCommand(s, context))
		} else if (s.item === '|') {
			if (allowMultilineCommands) {
				s.consume()
				consumeWhitespace(s, true)
				if (CHARS.COMMAND_NAME(s.item)) {
					GLOBALS.multiline = true
					tokens.push(collectCommand(s, context))
					GLOBALS.multiline = false
				}
			} else
				throwSyntaxError(
					s,
					'MinecraftSyntaxError: Multiline commands are not enabled. Mutliline command defined'
				)
		} else throwSyntaxError(s, `Unexpected ${s.item}`)

		// s.consume()
		// Consume whitespace after parsing so undefined s items are caught by the while loop
		consumeWhitespace(s)
	}

	console.log(s.lines)
	return tokens
}
