import { Stream } from './stream'
import { genComparison } from './util'

// TODO Add line, column, and index to Tokens to allow better AST debugging messages post-parsing
export interface Token {
	type: string
	raw: string
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
	subSelectors: TokenEntitySubSelector[]
}

export interface TokenEntitySubSelector extends Token {
	type: 'entitySubSelector'
	key: string
	value?: TokenAny
	inverted?: boolean
}

export interface TokenTargetEntity extends Token {
	type: 'targetEntity'
	entity: TokenEntitySelector | TokenPlayerName | TokenFakePlayer | TokenUuid
}

export interface TokenResourceLocation extends Token {
	type: 'resourceLocation'
	namespace: string
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

export interface TokenRotationCoordinate extends Token {
	type: 'rotationCoordinate'
	value: TokenDouble
	scope?: 'relative'
}

export interface TokenCoordinate extends Token {
	type: 'coordinate'
	value: TokenDouble
	scope?: 'local' | 'relative'
}

export interface TokenCoordinateTriplet extends Token {
	type: 'coordinateTriplet'
	x: TokenCoordinate
	y: TokenCoordinate
	z: TokenCoordinate
}

export interface TokenCoordinatePair extends Token {
	type: 'coordinatePair'
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

export type TokenAny =
	| TokenInt
	| TokenJson
	| TokenByte
	| TokenItem
	| TokenUuid
	| TokenLong
	| TokenBlock
	| TokenShort
	| TokenFloat
	| TokenAnyNbt
	| TokenDouble
	| TokenString
	| TokenDouble
	| TokenBoolean
	| TokenComment
	| TokenCommand
	| TokenLiteral
	| TokenNbtList
	| TokenNbtPath
	| TokenSwizzle
	| TokenIntRange
	| TokenNbtObject
	| TokenFakePlayer
	| TokenCoordinate
	| TokenPlayerName
	| TokenDoubleRange
	| TokenScoresObject
	| TokenTargetEntity
	| TokenCoordinatePair
	| TokenUnknownCommand
	| TokenUnquotedString
	| TokenEntitySelector
	| TokenResourceLocation
	| TokenEntitySubSelector
	| TokenCoordinateTriplet
	| TokenAdvancementObject
	| TokenRotationCoordinate

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'
export const CHARS = {
	QUOTES: genComparison(`'"`),
	SPACING: genComparison(' \t'),
	SWIZZLE: genComparison('xyz'),
	NUMBER: genComparison(numbers),
	NEWLINES: genComparison('\n\r'),
	SINGLE_QUOTES: genComparison(`'`),
	DOUBLE_QUOTES: genComparison(`"`),
	BOOLEAN_START: genComparison('tf'),
	WHITESPACE: genComparison(' \t\n\r'),
	FAKE_PLAYER_START: genComparison('.#'),
	INT_START: genComparison(`-${numbers}`),
	NUMBER_TYPE: genComparison(`bBsSlLfFdD`),
	SELECTOR_TARGETS: genComparison('aepsr'),
	NUMBER_START: genComparison(`-.${numbers}`),
	UUID: genComparison(`${numbers}abcdefABCDEF-`),
	COMMAND_NAME: genComparison(`${alphabet}${alphabet.toUpperCase()}`),
	WORD: genComparison(`${numbers}${alphabet}${alphabet.toUpperCase()}_`),
	OBJECT_KEY: genComparison(`${numbers}${alphabet}${alphabet.toUpperCase()}_`),
	ENTITY_TAG: genComparison(`${numbers}${alphabet}${alphabet.toUpperCase()}_+.-`),
	FAKE_PLAYER: genComparison(`${numbers}${alphabet}${alphabet.toUpperCase()}_.#`),
	UNQUOTED_STRING: genComparison(`${numbers}${alphabet}${alphabet.toUpperCase()}_.-`),
	RESOURCE_LOCATION: genComparison(`${numbers}${alphabet}${alphabet.toUpperCase()}_:/.`),
	SCOREBOARD_OBJECTIVE: genComparison(`${numbers}${alphabet}${alphabet.toUpperCase()}_.-`),
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

function createPointerErrorMessage(stream: Stream, line: number, column: number) {
	const lineStart = stream.lineNumberToIndex(line)
	const i = stream.seek('\n') - 1
	const halfTerm = Math.ceil(process.stdout.columns / 2)
	let start = stream.slice(lineStart, lineStart + column).replaceAll('\t', ' ')
	if (column > halfTerm) start = start.slice(column - halfTerm)
	const end = stream.slice(lineStart + column, i).slice(0, process.stdout.columns - start.length)
	let spacing = ''
	if (column > 0) spacing = ' '.repeat(start.length)
	return `${start}${end}\n${spacing}^`
}

export function throwSyntaxError(stream: Stream, message: string, line?: number, column?: number) {
	if (!line) line = stream.line
	if (!column) column = stream.column
	throw new MinecraftSyntaxError(
		`${message} at ${line}:${column}\n${createPointerErrorMessage(stream, line, column - 1)}`
	)
}

function assertItem(
	stream: Stream,
	char: string,
	errorMessage: string,
	line?: number,
	column?: number
) {
	if (stream.item !== char) throwSyntaxError(stream, errorMessage, line, column)
}

function consumeWhitespace(stream: Stream, inline?: boolean) {
	if (inline) stream.consumeWhile(s => CHARS.SPACING(s.item))
	else stream.consumeWhile(s => CHARS.WHITESPACE(s.item))
}

function expectEndOfLine(stream: Stream) {
	consumeWhitespace(stream, true)
	if (stream.item === undefined) return
	if (GLOBALS.multiline && stream.item === '|') return
	if (!CHARS.NEWLINES(stream.item)) throwSyntaxError(stream, 'Expected EOL')
}

/**
 * Consume the next character if it's whitespace, if not, throw a syntax error.
 *
 * Throw if there are 2 space characters in a row
 */
function expectAndConsumeEOA(stream: Stream) {
	if (stream.item === undefined) return
	if (stream.look(0, 2) === '  ')
		throwSyntaxError(stream, 'Too much whitespace', null, stream.column + 1)
	else if (CHARS.WHITESPACE(stream.item)) {
		if (CHARS.SPACING(stream.item)) stream.consume()
		// stream.consume()
	} else throwSyntaxError(stream, 'Expected whitespace to end argument')
}

function optionalValue<T extends TokenAny>(
	stream: Stream,
	collectFunc: (stream: Stream, ...args: any[]) => T,
	args?: any[]
): undefined | T {
	if (stream.item !== ',') return args ? collectFunc(stream, ...args) : collectFunc(stream)
}

// * Token Collectors * //
function collectComment(stream: Stream): TokenComment {
	stream.consume() // Consume #
	const str = stream.collect(s => !CHARS.NEWLINES(s.item))
	return {
		type: 'comment',
		comment: str,
		raw: `#${str}`,
	}
}

function collectBoolean(stream: Stream): TokenBoolean {
	const line = stream.line
	const column = stream.column
	let value = false

	if (stream.look(0, 4) === 'true') {
		value = true
		stream.consume(4)
	} else if (stream.look(0, 5) === 'false') {
		stream.consume(5)
	} else {
		throwSyntaxError(stream, 'Expected boolean', line, column)
	}

	return {
		type: 'boolean',
		value,
		raw: `${value ? 'true' : 'false'}`,
	}
}

function collectString(
	stream: Stream,
	allowUnquoted: true,
	allowedQuotes?: (c: string) => boolean,
	allowEscapedQuotes?: boolean,
	unquotedAllowedCharacters?: (c: string) => boolean,
	unquotedInverted?: boolean
): TokenString | TokenUnquotedString
function collectString(
	stream: Stream,
	allowUnquoted?: false,
	allowedQuotes?: (c: string) => boolean,
	allowEscapedQuotes?: boolean,
	unquotedAllowedCharacters?: (c: string) => boolean,
	unquotedInverted?: boolean
): TokenString
function collectString(
	stream: Stream,
	allowUnquoted?: boolean,
	allowedQuotes: (c: string) => boolean = CHARS.QUOTES,
	allowEscapedQuotes?: boolean,
	unquotedAllowedCharacters?: (c: string) => boolean,
	unquotedInverted?: boolean
) {
	if (allowedQuotes(stream.item)) {
		const line = stream.line
		const column = stream.column
		const quote = stream.item
		stream.consume()
		let value = ''
		while (stream.item) {
			value += stream.collect(s => !(s.item === quote))
			if (stream.look(-1, 1) === '\\') {
				if (!allowEscapedQuotes)
					throwSyntaxError(stream, 'Invalid string. Escaped quotes are not allowed')
				value += stream.item
				stream.consume()
			} else {
				break
			}
		}
		assertItem(
			stream,
			quote,
			`Invalid string. Missing closing ${quote} for string starting`,
			line,
			column
		)
		stream.consume()
		return { type: 'string', value, raw: `${quote}${value}${quote}` }
	} else if (allowUnquoted) {
		return collectUnquotedString(stream, unquotedAllowedCharacters, unquotedInverted)
	} else throwSyntaxError(stream, 'Expected quoted string')
}

function collectUnquotedString(
	stream: Stream,
	compFunc: (c: string) => boolean = CHARS.UNQUOTED_STRING,
	inverted?: boolean
): TokenUnquotedString {
	let str
	if (inverted) str = stream.collect(s => !compFunc(s.item))
	else str = stream.collect(s => compFunc(s.item))
	if (!str) throwSyntaxError(stream, 'Expected unquoted string')
	return {
		type: 'unquotedString',
		value: str,
		raw: str,
	}
}

export function collectStringLiteral<V extends string[]>(
	stream: Stream,
	expectedValues: V
): TokenLiteral & { value: V[any] } {
	const str = expectedValues.find(v => stream.look(0, v.length) === v)
	if (!str) throwSyntaxError(stream, `Expected string literal <${expectedValues.join(' | ')}>`)
	stream.consume(str.length)
	return { type: 'literal', value: str, raw: str }
}

function collectInt(stream: Stream, allowedIndicators?: string[]): TokenInt {
	let sign = ''
	if (stream.item === '-') {
		sign = '-'
		stream.consume()
	}
	const num = stream.collect(s => CHARS.NUMBER(s.item))
	if (!num) throwSyntaxError(stream, 'Expected int')
	const value = Number(sign + num)
	if (value > 2147483647 || -2147483648 > value)
		throwSyntaxError(stream, `Int value '${value}' out of range (-2147483648..2147483647)`)

	let indicator
	if (allowedIndicators) indicator = allowedIndicators.find(v => stream.item === v)
	if (indicator) stream.consume()

	return { type: 'int', value, indicator, raw: `${sign}${num}${indicator ? indicator : ''}` }
}

function collectDouble(stream: Stream): TokenDouble {
	let sign = ''
	if (stream.item === '-') {
		sign = '-'
		stream.consume()
	}
	let num = ''
	num += stream.collect(s => CHARS.NUMBER(s.item))
	if (stream.item === '.' && CHARS.NUMBER(stream.look(1, 1))) {
		num += '.'
		stream.consume()
		num += stream.collect(s => CHARS.NUMBER(s.item))
	}

	if (!num) throwSyntaxError(stream, 'Expected double')

	const value = Number(sign + num)

	return { type: 'double', value, raw: `${sign}${num}` }
}

function collectNumber(
	stream: Stream,
	expectedType?: 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'
): TokenByte | TokenShort | TokenInt | TokenLong | TokenFloat | TokenDouble {
	let isFloating
	let sign = ''
	if (stream.item === '-') {
		sign = '-'
		stream.consume()
	}
	let num = ''
	num += stream.collect(s => CHARS.NUMBER(s.item))
	// Check for floating point
	if (stream.item === '.' && CHARS.NUMBER(stream.look(1, 1))) {
		num += '.'
		stream.consume()
		num += stream.collect(s => CHARS.NUMBER(s.item))
		isFloating = true
	}

	if (!num) throwSyntaxError(stream, `Expected number`)

	let typeChar
	if (CHARS.NUMBER_TYPE(stream.item)) {
		typeChar = stream.item
		stream.consume()
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

	if (expectedType && _type !== expectedType) throwSyntaxError(stream, `Expected ${expectedType}`)

	const value = Number(sign + num)
	return { type: _type, value, raw: `${sign}${num}${typeChar ? typeChar : ''}` }
}

function collectResourceLocation(stream: Stream): TokenResourceLocation {
	let namespace: string, id: string
	let str = ''
	if (stream.item === '#') {
		str += '#'
		stream.consume()
	}
	str += stream.collect(s => CHARS.RESOURCE_LOCATION(s.item))

	if (str.includes(':')) {
		;[namespace, id] = str.split(':')
	} else {
		id = str
	}

	if (!id) throwSyntaxError(stream, 'Invalid resource location')
	return {
		type: 'resourceLocation',
		namespace,
		id,
		raw: `${namespace ? `${namespace}:` : ''}${id}`,
	}
}

function collectRangeableInt(stream: Stream): TokenInt | TokenIntRange {
	let min: TokenInt
	let max: TokenInt

	if (stream.look(0, 2) === '..') {
		// Maximum only range
		stream.consume(2)
		consumeWhitespace(stream, true)
		max = collectInt(stream)
		return { type: 'intRange', max, raw: `..${max.raw}` }
	} else {
		// Possible single value OR complete range OR only range
		min = collectInt(stream)
		consumeWhitespace(stream, true)
		if (stream.look(0, 2) === '..') {
			// Possible complete range OR minimum only range
			stream.consume(2)
			consumeWhitespace(stream, true)
			if (CHARS.NUMBER(stream.item)) {
				max = collectInt(stream)
				return {
					type: 'intRange',
					min,
					max,
					raw: `${min.raw}..${max.raw}`,
				}
			}
			return { type: 'intRange', min, raw: `${min.raw}..` }
		} else {
			// Single value
			return min
		}
	}
}

function collectRangeableDouble(stream: Stream): TokenDouble | TokenDoubleRange {
	let min: TokenDouble
	let max: TokenDouble

	if (stream.look(0, 2) === '..') {
		// Maximum only range
		stream.consume(2)
		consumeWhitespace(stream, true)
		max = collectDouble(stream)
		return { type: 'doubleRange', max, raw: `..${max.raw}` }
	} else {
		// Possible single value OR complete range OR only range
		min = collectDouble(stream)
		consumeWhitespace(stream, true)
		if (stream.look(0, 2) === '..') {
			// Possible complete range OR minimum only range
			stream.consume(2)
			consumeWhitespace(stream, true)
			if (CHARS.NUMBER(stream.item)) {
				max = collectDouble(stream)
				return {
					type: 'doubleRange',
					min,
					max,
					raw: `${min.raw}..${max.raw}`,
				}
			}
			return { type: 'doubleRange', min, raw: `${min.raw}..` }
		} else {
			// Single value
			return min
		}
	}
}

function collectSwizzle(stream: Stream): TokenSwizzle {
	let value = ''
	stream.consumeWhile(s => {
		if (value.length < 3 && CHARS.SWIZZLE(s.item)) {
			if (value.includes(s.item))
				throwSyntaxError(s, 'Cannot have duplicate axies in swizzle')
			else value += s.item
			return true
		}
	})
	if (!value) throwSyntaxError(stream, 'Expected swizzle')

	return {
		type: 'swizzle',
		value,
		raw: value,
	}
}

function collectCoordinateScope(stream: Stream) {
	switch (stream.item) {
		case '~':
			stream.consume()
			return 'relative'
		case '^':
			stream.consume()
			return 'local'
	}
}

function collectRotationCoordinate(stream: Stream): TokenRotationCoordinate {
	const scope = collectCoordinateScope(stream)
	if (scope === 'local') throwSyntaxError(stream, 'Rotation coordinate cannot be in local scope')
	const sign = stream.look(0, 1)
	let value
	try {
		value = collectDouble(stream)
	} catch (err) {
		if (!scope || sign === '-') throwSyntaxError(stream, 'Expected coordinate')
	}
	return {
		type: 'rotationCoordinate',
		value,
		scope: scope ? 'relative' : undefined,
		raw: `${scope === 'relative' ? '~' : ''}${value ? value.raw : ''}`,
	}
}

function collectCoordinate(stream: Stream): TokenCoordinate {
	const scope = collectCoordinateScope(stream)
	const sign = stream.look(0, 1)
	let value
	try {
		value = collectDouble(stream)
	} catch (err) {
		if (!scope || sign === '-') throwSyntaxError(stream, 'Expected coordinate')
	}
	return {
		type: 'coordinate',
		value,
		scope: scope,
		raw: `${scope === 'relative' ? '~' : scope === 'local' ? '^' : ''}${
			value ? value.raw : ''
		}`,
	}
}

function collectCoordinateTriplet(stream: Stream): TokenCoordinateTriplet {
	let x, y, z
	let error
	try {
		x = collectCoordinate(stream)
		expectAndConsumeEOA(stream)
	} catch (err) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error) throwSyntaxError(stream, 'Expected first coordinate of coordinate triplet')
	try {
		y = collectCoordinate(stream)
		expectAndConsumeEOA(stream)
	} catch (err) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error) throwSyntaxError(stream, 'Expected second coordinate of coordinate triplet')
	try {
		z = collectCoordinate(stream)
	} catch (err) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error) throwSyntaxError(stream, 'Expected third coordinate of coordinate triplet')

	if (
		(x.scope === 'local' || y.scope === 'local' || z.scope === 'local') &&
		!(x.scope === 'local' && y.scope === 'local' && z.scope === 'local')
	)
		throwSyntaxError(
			stream,
			'Invalid coordinate triplet Cannot mix local coordinate scope with relative or global scopes',
			null,
			stream.column - `${x.raw} ${y.raw} ${z.raw}`.length
		)

	return {
		type: 'coordinateTriplet',
		x,
		y,
		z,
		raw: `${x.raw} ${y.raw} ${z.raw}`,
	}
}

function collectCoordinatePair(stream: Stream): TokenCoordinatePair {
	let x, z
	let error
	try {
		x = collectCoordinate(stream)
		expectAndConsumeEOA(stream)
	} catch (err) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error) throwSyntaxError(stream, 'Expected first coordinate of coordinate pair')
	try {
		z = collectCoordinate(stream)
	} catch (err) {
		if (err.name === 'MinecraftSyntaxError') error = err
		else throw err
	}
	if (error) throwSyntaxError(stream, 'Expected second coordinate of coordinate pair')

	if (
		(x.scope === 'local' || z.scope === 'local') &&
		!(x.scope === 'local' && z.scope === 'local')
	)
		throwSyntaxError(
			stream,
			'Invalid coordinate pair. Cannot mix local coordinate scope with relative or global scopes',
			null,
			stream.column - `${x.raw} ${z.raw}`.length
		)

	return {
		type: 'coordinatePair',
		x,
		z,
		raw: `${x.raw} ${z.raw}`,
	}
}

function collectScoresObject(stream: Stream): TokenScoresObject {
	const token: TokenScoresObject = {
		type: 'scoresObject',
		checks: [],
		raw: '',
	}
	assertItem(stream, '{', 'Invalid scores object')
	stream.consume()
	consumeWhitespace(stream, !GLOBALS.multiline)

	while (stream.item) {
		const key = stream.collect(s => CHARS.SCOREBOARD_OBJECTIVE(s.item))
		consumeWhitespace(stream, !GLOBALS.multiline)
		assertItem(stream, '=', 'Invalid scores object. Missing =')
		stream.consume()
		consumeWhitespace(stream, !GLOBALS.multiline)
		const range = collectRangeableInt(stream)
		token.checks.push({
			type: 'scoreCheck',
			objective: key,
			value: range,
			raw: `${key}=${range.raw}`,
		})
		consumeWhitespace(stream, !GLOBALS.multiline)

		if (stream.item === '}') {
			stream.consume()
			token.raw = `{${token.checks.map(v => v.raw).join(',')}}`
			return token
		} else if (stream.item === ',') {
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
		} else throwSyntaxError(stream, 'Invalid scores object. Missing ,')
	}

	throwSyntaxError(stream, 'Invalid scores object. Missing closing }')
}

function collectAdvancementObject(stream: Stream): TokenAdvancementObject {
	const token: TokenAdvancementObject = {
		type: 'advancementObject',
		checks: [],
		raw: '',
	}
	assertItem(stream, '{', 'Invalid advancements object')
	stream.consume()
	consumeWhitespace(stream, !GLOBALS.multiline)

	while (stream.item) {
		const advancement = collectResourceLocation(stream)
		consumeWhitespace(stream, !GLOBALS.multiline)
		assertItem(stream, '=', 'Invalid advancements object')
		stream.consume()
		consumeWhitespace(stream, !GLOBALS.multiline)
		const value = collectBoolean(stream)
		consumeWhitespace(stream, !GLOBALS.multiline)
		token.checks.push({
			type: 'advancementCheck',
			advancement,
			value,
			raw: `${advancement.raw}=${value.raw}`,
		})

		if (stream.item === '}') {
			stream.consume()
			token.raw = `{${token.checks.map(v => v.raw).join(',')}}`
			return token
		} else if (stream.item === ',') {
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
			if (!CHARS.WORD(stream.item))
				throwSyntaxError(stream, 'Expected advancement check after ,')
		} else throwSyntaxError(stream, 'Invalid advancement object. Missing ,')
	}

	throwSyntaxError(stream, 'Invalid advancement object. Missing closing curly bracket')
}

function collectNbtList(stream: Stream): TokenNbtList {
	const items: TokenAnyNbt[] = []
	let itemType
	assertItem(stream, '[', 'Invalid NBT list')
	stream.consume()
	consumeWhitespace(stream, !GLOBALS.multiline)

	while (stream.item) {
		let value
		switch (itemType) {
			default:
				if (CHARS.NUMBER_START(stream.item)) {
					value = collectNumber(stream)
				} else if (CHARS.QUOTES(stream.item)) {
					value = collectString(stream)
				} else if (stream.item === '{') {
					value = collectNbtObject(stream)
				}
				itemType = value?.type
				if (!itemType) throwSyntaxError(stream, 'Unknown type for list')
				break
			case 'byte':
			case 'short':
			case 'int':
			case 'long':
			case 'float':
			case 'double':
				value = collectNumber(stream, itemType)
				break
			case 'string':
				value = collectString(stream)
				break
			case 'nbtObject':
				value = collectNbtObject(stream)
		}
		items.push(value)
		consumeWhitespace(stream, !GLOBALS.multiline)
		if (stream.item === ',') {
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
		}
		if (stream.item === ']') {
			stream.consume()
			break
		}
	}

	return {
		type: 'nbtList',
		itemType,
		items,
		raw: `[${items.map(v => v.raw).join(',')}]`,
	}
}

function collectNbtObject(stream: Stream): TokenNbtObject {
	const obj: { [key: string]: TokenAnyNbt } = {}
	assertItem(stream, '{', 'Invalid NBT object. Missing {')
	stream.consume()
	consumeWhitespace(stream, !GLOBALS.multiline)

	if (!(stream.item === '}')) {
		while (stream.item) {
			const key = CHARS.QUOTES(stream.item)
				? collectString(stream).raw
				: stream.collect(s => CHARS.OBJECT_KEY(s.item))
			consumeWhitespace(stream, !GLOBALS.multiline)
			assertItem(stream, ':', 'Invalid NBT object. Missing :')
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
			let value
			if (CHARS.NUMBER_START(stream.item)) {
				value = collectNumber(stream)
			} else if (CHARS.QUOTES(stream.item)) {
				value = collectString(stream)
			} else if (stream.item === 'f' || stream.item === 't') {
				value = collectBoolean(stream)
			} else if (stream.item === '[') {
				value = collectNbtList(stream)
			} else if (stream.item === '{') {
				value = collectNbtObject(stream)
			}

			if (value === undefined) throwSyntaxError(stream, `Expected value for '${key}'`)
			obj[key] = value

			consumeWhitespace(stream, !GLOBALS.multiline)
			if (stream.item === '}') {
				stream.consume()
				break
			} else if (stream.item === ',') {
				stream.consume()
				consumeWhitespace(stream, !GLOBALS.multiline)
			} else throwSyntaxError(stream, 'Expected ,')
		}
	} else stream.consume()

	return {
		type: 'nbtObject',
		object: obj,
		raw: `{${Object.entries(obj).map(([k, v]) => `${k}:${v.raw}`)}}`,
	}
}

function collectNbtPath(stream: Stream): TokenNbtPath {
	let path = ''

	while (stream.item) {
		if (CHARS.QUOTES(stream.item)) {
			path += collectString(stream).raw
		} else if (CHARS.WHITESPACE(stream.item)) {
			break
		} else {
			path += stream.item
			stream.consume()
		}
	}

	return {
		type: 'nbtPath',
		path,
		raw: path,
	}
}

function collectAnyNbt(stream: Stream): TokenAnyNbt {
	let value
	if (CHARS.NUMBER_START(stream.item)) {
		value = collectNumber(stream)
	} else if (CHARS.QUOTES(stream.item)) {
		value = collectString(stream)
	} else if (stream.item === 'f' || stream.item === 't') {
		value = collectBoolean(stream)
	} else if (stream.item === '[') {
		value = collectNbtList(stream)
	} else if (stream.item === '{') {
		value = collectNbtObject(stream)
	}
	return value
}

function collectItemPredicate(stream: Stream): TokenItem {
	let nbt
	const id = collectResourceLocation(stream)
	if (stream.item === '{') nbt = collectNbtObject(stream)

	return {
		type: 'item',
		id,
		nbt,
		raw: `${id.raw}${nbt ? nbt.raw : ''}`,
	}
}

function collectBlockStates(stream: Stream): BlockStates {
	const states: BlockStates = {}
	assertItem(stream, '[', 'Invalid blockstate')
	stream.consume()
	consumeWhitespace(stream, !GLOBALS.multiline)

	while (stream.item) {
		const key = stream.collect(s => CHARS.UNQUOTED_STRING(s.item))
		consumeWhitespace(stream, !GLOBALS.multiline)
		assertItem(stream, '=', 'Invalid blockstate')
		stream.consume()
		consumeWhitespace(stream, !GLOBALS.multiline)
		let value
		if (CHARS.BOOLEAN_START(stream.item)) value = collectBoolean(stream)
		else if (CHARS.QUOTES(stream.item)) value = collectString(stream)
		else if (CHARS.UNQUOTED_STRING(stream.item)) value = collectUnquotedString(stream)
		else if (CHARS.INT_START(stream.item)) value = collectInt(stream)
		else throwSyntaxError(stream, `Expected value for key '${key}'`)

		consumeWhitespace(stream, !GLOBALS.multiline)
		states[key] = value

		if (stream.item === ']') {
			stream.consume()
			return states
		} else if (stream.item === ',') {
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
		} else throwSyntaxError(stream, 'Invalid blockstate. Missing ,')
	}

	throwSyntaxError(stream, 'Invalid blockstate. Missing closing curly bracket')
}

function collectBlockPredicate(stream: Stream, allowNbt: boolean = true): TokenBlock {
	let nbt, blockStates
	const id = collectResourceLocation(stream)
	if (stream.item === '[') blockStates = collectBlockStates(stream)
	if (allowNbt && stream.item === '{') nbt = collectNbtObject(stream)

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
	}
}

function collectSubSelectors(stream: Stream): TokenEntitySubSelector[] {
	const tokens: TokenEntitySubSelector[] = []

	function isInverted(stream: Stream, canInvert: boolean, key: string) {
		if (stream.item === '!') {
			if (!canInvert)
				throwSyntaxError(
					stream,
					`Invalid entity subselector. Cannot invert entity subselector '${key}'`,
					null,
					stream.column
				)
			stream.consume()
			return true
		}
	}

	function collect(): TokenEntitySubSelector {
		const key = stream.collect(s => CHARS.WORD(s.item))
		consumeWhitespace(stream, !GLOBALS.multiline)
		assertItem(stream, '=', 'Invalid entity subselector. Missing =')
		stream.consume()
		consumeWhitespace(stream, !GLOBALS.multiline)
		let inverted
		let value: TokenAny
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
				inverted = isInverted(stream, false, key)
				value = collectDouble(stream)
				break
			// limit = <int>
			case 'limit':
				inverted = isInverted(stream, false, key)
				value = collectInt(stream)
				break
			// level = <rangeableInt>
			case 'level':
				inverted = isInverted(stream, false, key)
				value = collectRangeableInt(stream)
				break
			// distance = <rangeableFloat>
			case 'distance':
			// x_rotation = <rangeableFloat>
			case 'x_rotation':
			// y_rotation = <rangeableFloat>
			case 'y_rotation':
				inverted = isInverted(stream, false, key)
				value = collectRangeableDouble(stream)
				break
			// team = !?<string || unquotedString>
			case 'team':
			// tag = !?<string || unquotedString>
			case 'tag':
				inverted = isInverted(stream, true, key)
				if (CHARS.QUOTES(stream.item)) value = optionalValue(stream, collectString)
				else value = optionalValue(stream, collectUnquotedString, [CHARS.ENTITY_TAG])
				break
			// name = !?<string || unquotedString>
			case 'name':
				inverted = isInverted(stream, true, key)
				if (CHARS.QUOTES(stream.item)) value = optionalValue(stream, collectString, [true])
				else value = optionalValue(stream, collectUnquotedString, [CHARS.ENTITY_TAG])
				break
			// scores = <scoresObject>
			case 'scores':
				isInverted(stream, false, key)
				value = collectScoresObject(stream)
				break
			// gamemode = !?<creative|survival|adventure|spectator>
			case 'gamemode':
				inverted = isInverted(stream, true, key)
				value = collectStringLiteral(stream, [
					'creative',
					'survival',
					'adventure',
					'spectator',
				])
				break
			// sort = <arbitrary|furthest|nearest|random>
			case 'sort':
				inverted = isInverted(stream, false, key)
				value = collectStringLiteral(stream, ['arbitrary', 'furthest', 'nearest', 'random'])
				break
			// type = !?<entityId>
			case 'type':
				inverted = isInverted(stream, true, key)
				value = collectResourceLocation(stream)
				break
			case 'advancements':
				inverted = isInverted(stream, false, key)
				value = collectAdvancementObject(stream)
				break
			case 'predicate':
				inverted = isInverted(stream, true, key)
				value = collectResourceLocation(stream)
				break
			case 'nbt':
				inverted = isInverted(stream, true, key)
				value = collectNbtObject(stream)
				break
			default:
				throwSyntaxError(
					stream,
					`Unknown entity subselector '${key}'`,
					null,
					stream.column - key.length - 1
				)
				break
		}
		return {
			type: 'entitySubSelector',
			key,
			value,
			inverted,
			raw: `${key}=${inverted ? '!' : ''}${value ? value.raw : ''}`,
		}
	}

	while (stream.item) {
		consumeWhitespace(stream, !GLOBALS.multiline)

		if (CHARS.WORD(stream.item)) {
			tokens.push(collect())
			consumeWhitespace(stream, !GLOBALS.multiline)
		}
		if (stream.item === ',') {
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
			if (!CHARS.WORD(stream.item))
				throwSyntaxError(stream, 'Expected entity subselector after ,')
		} else if (stream.item === ']') {
			stream.consume()
			return tokens
		} else throwSyntaxError(stream, 'Invalid entity selector. Missing ,')
	}
	throwSyntaxError(stream, 'Invalid entity selector. Missing closing square bracket')
}

function collectEntitySelector(stream: Stream): TokenEntitySelector {
	// assertItem(stream, '@', 'Invalid entity selector. Missing @')
	stream.consume() // Consume @
	const target = (CHARS.SELECTOR_TARGETS(stream.item) ? stream.item : '') as EntitySelectorTarget
	if (!target) throwSyntaxError(stream, 'Invalid entity selector. Missing target entity list')
	stream.consume()
	let subSelectors
	if (stream.item === '[') {
		stream.consume()
		subSelectors = collectSubSelectors(stream)
	}

	return {
		type: 'entitySelector',
		target,
		subSelectors,
		raw: `@${target}${
			subSelectors?.length ? `[${subSelectors.map(v => v.raw).join(',')}]` : ''
		}`,
	}
}

function collectPlayerName(stream: Stream): TokenPlayerName {
	const value = collectString(stream, true, CHARS.DOUBLE_QUOTES, false, CHARS.WORD)
	if (!value) throwSyntaxError(stream, 'Expected player name')
	return {
		type: 'playerName',
		value,
		raw: value.raw,
	}
}

function collectFakePlayer(stream: Stream): TokenFakePlayer {
	const value = collectUnquotedString(stream, CHARS.FAKE_PLAYER)
	if (!value) throwSyntaxError(stream, 'Expected player name')
	return {
		type: 'fakePlayer',
		value,
		raw: value.raw,
	}
}

function collectUuid(stream: Stream): TokenUuid {
	let value = stream.collect(s => CHARS.UUID(s.item))
	let n0, n1, n2, n3, n4
	try {
		;[n0, n1, n2, n3, n4] = value.split('-')
	} catch (err) {
		throwSyntaxError(stream, 'Invalid UUID', null, stream.column - value.length)
	}

	if (!(n0 && n1 && n2 && n3 && n4))
		throwSyntaxError(stream, 'Invalid UUID', null, stream.column - value.length)

	return {
		type: 'uuid',
		n0,
		n1,
		n2,
		n3,
		n4,
		raw: value,
	}
}

function collectTargetEntity(stream: Stream, allowFakePlayers: boolean): TokenTargetEntity {
	let entity: TokenEntitySelector | TokenPlayerName | TokenFakePlayer | TokenUuid

	if (stream.item === '@') entity = collectEntitySelector(stream)
	else if (
		stream.slice(stream.index, stream.seek(CHARS.WHITESPACE, 37)).split('-').length === 5
	) {
		entity = collectUuid(stream)
	} else {
		let value
		try {
			value = collectString(stream, true, CHARS.DOUBLE_QUOTES, false, CHARS.FAKE_PLAYER)
		} catch (err) {
			if (err.name === 'MinecraftSyntaxError')
				throwSyntaxError(stream, 'Expected entity selector, player name, or UUID')
		}
		if ([...value.raw].find(CHARS.FAKE_PLAYER_START)) {
			if (!allowFakePlayers) throwSyntaxError(stream, 'Cannot use fakeplayer')
			entity = {
				type: 'fakePlayer',
				value,
				raw: value.raw,
			}
		} else {
			entity = {
				type: 'playerName',
				value,
				raw: value.raw,
			}
		}
	}
	return { type: 'targetEntity', entity, raw: entity.raw }
}

function collectCommandName(stream: Stream) {
	let name = stream.collect(s => CHARS.COMMAND_NAME(s.item))
	if (!name) throwSyntaxError(stream, 'Expected command')
	try {
		expectAndConsumeEOA(stream)
	} catch (err) {
		if (err.name === 'MinecraftSyntaxError')
			throwSyntaxError(stream, 'Expected end of command name')
		else throw err
	}
	return name
}

function collectJsonArray(stream: Stream): any {
	stream.consume() // Consume opening [
	const json: any[] = []
	consumeWhitespace(stream, !GLOBALS.multiline)

	if (stream.item === ']') return json

	while (stream.item) {
		let value
		if (stream.item === '{') {
			value = collectJsonObject(stream)
		} else if (stream.item === '[') {
			value = collectJsonArray(stream)
		} else if (stream.item === '"') {
			value = collectString(stream, false, CHARS.DOUBLE_QUOTES).value
		} else if (CHARS.NUMBER_START(stream.item)) {
			value = collectDouble(stream).value
		} else if (CHARS.BOOLEAN_START(stream.item)) {
			value = collectBoolean(stream).value
		} else throwSyntaxError(stream, `Expected an array item at`)

		json.push(value)
		consumeWhitespace(stream, !GLOBALS.multiline)

		if (stream.item === ']') {
			stream.consume()
			return json
		} else if (stream.item === ',') {
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
		} else throwSyntaxError(stream, 'Invalid json array. Missing ,')
	}
	throwSyntaxError(stream, 'Invalid json array. Missing closing ]')
}

function collectJsonObject(stream: Stream): any {
	stream.consume() // Consume opening {
	const json: any = {}
	consumeWhitespace(stream, !GLOBALS.multiline)

	if (stream.item === '}') return json

	while (stream.item) {
		const key = collectString(stream, false, CHARS.DOUBLE_QUOTES)
		consumeWhitespace(stream, !GLOBALS.multiline)
		assertItem(stream, ':', 'Invalid blockstate. Missing :')
		stream.consume()
		consumeWhitespace(stream, !GLOBALS.multiline)

		let value
		if (stream.item === '{') {
			value = collectJsonObject(stream)
		} else if (stream.item === '[') {
			value = collectJsonArray(stream)
		} else if (stream.item === '"') {
			value = collectString(stream, false, CHARS.DOUBLE_QUOTES).value
		} else if (CHARS.NUMBER_START(stream.item)) {
			value = collectDouble(stream).value
		} else if (CHARS.BOOLEAN_START(stream.item)) {
			value = collectBoolean(stream).value
		} else throwSyntaxError(stream, `Expected a value for key '${key.value}'`)

		json[key.value] = value

		consumeWhitespace(stream, !GLOBALS.multiline)

		if (stream.item === '}') {
			stream.consume()
			return json
		} else if (stream.item === ',') {
			stream.consume()
			consumeWhitespace(stream, !GLOBALS.multiline)
		} else throwSyntaxError(stream, 'Invalid json object. Missing ,')
	}
	throwSyntaxError(stream, 'Invalid json object. Missing closing ]')
}

function collectJson(stream: Stream): TokenJson {
	let json
	switch (stream.item) {
		case '{':
			json = collectJsonObject(stream)
			break
		case '[':
			json = collectJsonArray(stream)
			break
		case '"':
			json = collectString(stream, false, CHARS.DOUBLE_QUOTES).value
			break
		case "'":
		default:
			throwSyntaxError(stream, 'Invalid JSON')
			break
	}

	return {
		type: 'json',
		json,
		raw: `${json ? JSON.stringify(json) : ''}`,
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
function tokenizeUnknownCommand(stream: Stream, name: string): TokenUnknownCommand {
	if (GLOBALS.multiline) throwSyntaxError(stream, 'Attempted to multiline an unknown command')
	console.log(`[WARN] Unknown command '${name}' at ${stream.line}:${stream.column - name.length}`)
	const str = stream.collect(s => !CHARS.NEWLINES(s.item))
	return {
		type: 'unknownCommand',
		name,
		args: {
			all: { type: 'unquotedString', value: str, raw: str },
		},
		raw: '',
	}
}

interface CommandArgs {
	[key: string]: TokenAny | TokenAny[]
}

export interface TokenCommand extends Token {
	type: 'command'
	name: string
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
		name: T['name'],
		meta: CommandMeta,
		tokenizer: (
			stream: Stream,
			token: T,
			command: Command<T>,
			registers: CommandRegister[]
		) => T
	) {
		if (this.commands[name]) throw new Error(`A command named '${name}' already exists!`)
		const command = new Command(name, meta, tokenizer)
		this.commands[name] = command
		return command
	}
}

type CommandMeta = { [key: string]: any }
export class Command<T extends TokenCommand> {
	name: string
	meta: CommandMeta
	tokenizer: (stream: Stream, token: T, command: this, registers: CommandRegister[]) => T
	constructor(
		name: T['name'],
		meta: CommandMeta,
		tokenizer: (
			stream: Stream,
			token: T,
			command: Command<T>,
			registers: CommandRegister[]
		) => T
	) {
		this.name = name
		this.meta = meta
		this.tokenizer = tokenizer
	}

	tokenize(stream: Stream, registers: CommandRegister[]): T {
		const token = {
			type: 'command',
			name: this.name,
			args: {},
			raw: '',
		} as T

		this.tokenizer(stream, token, this, registers)

		return token
	}

	static requiredArg<V extends TokenAny, A>(
		stream: Stream,
		collectorFunc: (stream: Stream, ...args: A[]) => V,
		args?: A[] // Extra arguments for the collector function
	): V {
		if (GLOBALS.multiline) consumeWhitespace(stream)
		const result = args ? collectorFunc(stream, ...args) : collectorFunc(stream)
		expectAndConsumeEOA(stream)
		return result
	}

	static optionalArg<V extends TokenAny, A>(
		stream: Stream,
		collectorFunc: (stream: Stream, ...args: A[]) => V,
		args?: A[], // Extra arguments for the collector function
		catchErrors?: boolean
	): V | undefined {
		switch (stream.item) {
			case '|':
				if (GLOBALS.multiline) return
				break
			case '\n':
			case '\r':
			case undefined:
				if (!GLOBALS.multiline) return
				consumeWhitespace(stream)
				break
		}
		try {
			const result = args ? collectorFunc(stream, ...args) : collectorFunc(stream)
			expectAndConsumeEOA(stream)
			return result
		} catch (err) {
			if (!catchErrors) throw err
		}
		return undefined
	}

	//! WARNING: Consumes performance to exist. Only use if absolutely necessary
	static choiceArg(
		stream: Stream,
		collectors: [(s: Stream, ...args: any[]) => TokenAny, ...any][]
	): [undefined | TokenAny, Error | MinecraftSyntaxError[]] {
		const errors = []
		let result
		for (const [collector, ...args] of collectors) {
			try {
				result = args ? collector(stream, ...args) : collector(stream)
				errors.push(undefined)
				break
			} catch (err) {
				if (err.name !== 'MinecraftSyntaxError') throw err
				errors.push(err)
			}
		}
		if (result) expectAndConsumeEOA(stream)
		return [result, errors]
	}
}

function collectCommand(stream: Stream, registers: CommandRegister[]) {
	const line = stream.line
	const column = stream.column
	const name = collectCommandName(stream)

	let cmd
	try {
		for (const r of registers) {
			cmd = r.commands[name]?.tokenize(stream, registers)
			if (cmd) break
		}
		if (!cmd) cmd = tokenizeUnknownCommand(stream, name)

		expectEndOfLine(stream)
		// Add more context to command syntax errors
	} catch (err) {
		if (err.name === 'MinecraftSyntaxError')
			throw new MinecraftSyntaxError(
				GLOBALS.multiline
					? `MinecraftSyntaxError: Failed to parse multiline command '${name}' starting on line ${line}:${column}\n${err.message}`
					: `MinecraftSyntaxError: Failed to parse command '${name}' at ${line}:${column}\n${err.message}`
			)
		throw new Error(
			GLOBALS.multiline
				? `Encountered unexpected error while parsing multiline command '${name}' starting on line ${line}:${column}\n${err.stack}`
				: `Encountered unexpected error while parsing command '${name}' on line ${line}:${column}\n${err.stack}`
		)
	}

	const argsStr = Object.values(cmd.args)
		.filter(v => (Array.isArray(v) ? v.length : v)) // Remove sneaky undefined arguments, and empty arrays
		.map(v => (Array.isArray(v) ? v.map(i => i.raw).join(' ') : v.raw))
		.join(' ')
	cmd.raw = `${name}${argsStr ? ` ${argsStr}` : ''}`

	return cmd
}

export const TokenCollectors = {
	AnyNbt: collectAnyNbt,
	Block: collectBlockPredicate,
	Boolean: collectBoolean,
	Command: collectCommand,
	Coordinate: collectCoordinate,
	CoordinatePair: collectCoordinatePair,
	CoordinateScope: collectCoordinateScope,
	CoordinateTriplet: collectCoordinateTriplet,
	Double: collectDouble,
	EntitySelector: collectEntitySelector,
	FakePlayer: collectFakePlayer,
	Int: collectInt,
	Item: collectItemPredicate,
	Json: collectJson,
	JsonArray: collectJsonArray,
	JsonObject: collectJsonObject,
	Literal: collectStringLiteral,
	NBTObject: collectNbtObject,
	NBTPath: collectNbtPath,
	Number: collectNumber,
	PlayerName: collectPlayerName,
	RangeableDouble: collectRangeableDouble,
	RangeableInt: collectRangeableInt,
	ResourceLocation: collectResourceLocation,
	RotationCoordinate: collectRotationCoordinate,
	String: collectString,
	Swizzle: collectSwizzle,
	TargetEntity: collectTargetEntity,
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
): TokenAny[] {
	SETTINGS.multilineCommandsEnabled = allowMultilineCommands

	const tokens: TokenAny[] = []
	const stream = new Stream(str)
	consumeWhitespace(stream)

	while (stream.item) {
		if (stream.item === '#') {
			tokens.push(collectComment(stream))
		} else if (CHARS.COMMAND_NAME(stream.item)) {
			tokens.push(collectCommand(stream, registers))
		} else if (stream.item === '|') {
			if (allowMultilineCommands) {
				stream.consume()
				consumeWhitespace(stream, true)
				if (CHARS.COMMAND_NAME(stream.item)) {
					GLOBALS.multiline = true
					tokens.push(collectCommand(stream, registers))
					GLOBALS.multiline = false
				}
			} else
				throwSyntaxError(
					stream,
					'MinecraftSyntaxError: Multiline commands are not enabled. Mutliline command defined'
				)
		} else throwSyntaxError(stream, `Unexpected ${stream.item}`)

		// stream.consume()
		// Consume whitespace after parsing so undefined stream items are caught by the while loop
		consumeWhitespace(stream)
	}

	return tokens
}
