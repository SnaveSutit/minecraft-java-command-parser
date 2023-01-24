import { StringStream } from './util/stringStream'
import { AnyToken } from './tokenizers/vanillaTokenizer'
import { tokenToString } from './util'

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

function createPointerErrorMessage(s: StringStream, line: number, column: number) {
	let lineStart
	if (line == 0) lineStart = 0
	else if (line > s.lines.length) lineStart = s.lineStart
	else lineStart = s.lineNumberToIndex(line)
	const i = (s.seek('\n') || 0) - 1
	const halfTerm = Math.ceil(process.stdout.columns / 2)
	let start = s.string.slice(lineStart, lineStart + column).replaceAll('\t', ' ')
	if (column > halfTerm) start = start.slice(column - halfTerm)
	const end = s.string
		.slice(lineStart + column, i)
		.slice(0, process.stdout.columns - start.length)
	let spacing = ''
	if (column > 0) spacing = ' '.repeat(start.length - 1)
	return `${start}${end}\n${spacing}^`
}

export function throwTokenError(
	s: StringStream,
	message: string,
	line?: number,
	column?: number
): never {
	if (!line) line = s.line
	if (!column) column = s.column
	throw new MinecraftTokenError(
		`${message.replaceAll('\r', '\\r').replaceAll('\n', '\\n').replaceAll('\t', '\\t')} at ${
			line + 1
		}:${column}\n${createPointerErrorMessage(s, line + 1, column)}`
	)
}

export function throwSyntaxError(
	token: AnyToken | undefined,
	message: string,
	line?: number,
	column?: number
): never {
	if (!line) line = token!.line
	if (!column) column = token!.column
	throw new MinecraftSyntaxError(
		message
			.replaceAll('%POS', `${line + 1}:${column}`)
			.replaceAll(
				'%TOKEN',
				`${tokenToString(token)
					.replaceAll('\r', '\\r')
					.replaceAll('\n', '\\n')
					.replaceAll('\t', '\\t')}`
			)
	)
}
