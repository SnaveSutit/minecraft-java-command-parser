import { CharacterStream } from './characterStream'
import { AnyToken } from './tokenizers/vanillaTokenizer'

export class MinecraftSyntaxError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'MinecraftSyntaxError'
	}
}

export class MinecraftTokenError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'MinecraftTokenError'
	}
}

function createPointerErrorMessage(s: CharacterStream, line: number, column: number) {
	let lineStart
	if (line == 0) lineStart = 0
	else lineStart = s.lineNumberToIndex(line)
	const i = (s.seek('\n') || 0) - 1
	const halfTerm = Math.ceil(process.stdout.columns / 2)
	let start = s.slice(lineStart, lineStart + column).replaceAll('\t', ' ')
	if (column > halfTerm) start = start.slice(column - halfTerm)
	const end = s.slice(lineStart + column, i).slice(0, process.stdout.columns - start.length)
	let spacing = ''
	if (column > 0) spacing = ' '.repeat(start.length)
	return `${start}${end}\n${spacing}^`
}

export function throwTokenError(
	s: CharacterStream,
	message: string,
	line?: number,
	column?: number
): never {
	if (!line) line = s.line
	if (!column) column = s.column
	throw new MinecraftTokenError(
		`${message
			.replaceAll('\r', '\\r')
			.replaceAll('\n', '\\n')
			.replaceAll('\t', '\\t')} at ${line}:${column}\n${createPointerErrorMessage(
			s,
			line,
			column - 1
		)}`
	)
}

export function throwSyntaxError(
	token: AnyToken,
	message: string,
	line?: number,
	column?: number
): never {
	if (!line) line = token.line
	if (!column) column = token.column
	throw new MinecraftSyntaxError(
		message
			.replaceAll('\r', '\\r')
			.replaceAll('\n', '\\n')
			.replaceAll('\t', '\\t')
			.replaceAll('%POS', `${line}:${column - 1}`)
	)
}
