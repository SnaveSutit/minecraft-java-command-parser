import { Stream } from "./stream"

interface Token {
	type: string
	raw: string
}

interface TokenCommand {
	type: 'command'
	args: { [key: string]: TokenAny }
}

type TokenAny = Token

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'
const CHARS = {
	INT: numbers,
	FLOAT: `${numbers}.`,
	WHITESPACE: ' \t\n\r',
	COMMAND_NAME: `${alphabet}${alphabet.toUpperCase()}`
}

function consumeWhitespace(stream: Stream) {
	stream.consumeWhile(s => )
}

export function parse(str: string): TokenAny[] {
	const tokens: TokenAny[] = []
	const stream = new Stream(str)



	return tokens
}
