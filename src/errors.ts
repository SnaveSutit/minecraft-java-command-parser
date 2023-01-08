import { CharacterStream } from './characterStream'

export class MinecraftSyntaxError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'MinecraftSyntaxError'
	}
}

function createPointerErrorMessage(stream: CharacterStream, line: number, column: number) {
	const lineStart = stream.lineNumberToIndex(line)
	const i = (stream.seek('\n') || 0) - 1
	const halfTerm = Math.ceil(process.stdout.columns / 2)
	let start = stream.slice(lineStart, lineStart + column).replaceAll('\t', ' ')
	if (column > halfTerm) start = start.slice(column - halfTerm)
	const end = stream.slice(lineStart + column, i).slice(0, process.stdout.columns - start.length)
	let spacing = ''
	if (column > 0) spacing = ' '.repeat(start.length)
	return `${start}${end}\n${spacing}^`
}

export function throwSyntaxError(stream: CharacterStream, message: string, line?: number, column?: number) {
	if (!line) line = stream.line
	if (!column) column = stream.column
	throw new MinecraftSyntaxError(
		`${message} at ${line}:${column}\n${createPointerErrorMessage(stream, line, column - 1)}`
	)
}
