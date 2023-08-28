import { StringStream } from 'generic-stream'
import { AnyToken, IToken, ITokens, tokenize as vanillaTokenize } from './vanillaTokenizer'

export interface IMCBTokens extends ITokens {
	inlineJS: IToken<'inlineJS', string>
	multilineJS: IToken<'multilineJS', string>
}
export type AnyMCBToken = IMCBTokens[keyof IMCBTokens] | AnyToken

function collectInlineJS(s: StringStream): IMCBTokens['inlineJS'] {
	const { line, column } = s
	s.consume() // Consume '<'
	s.consume() // Consume '%'
	let value = ''

	value += s.collectWhile(s => !(s.look(0, 2) === '%>'))

	s.consume() // Consume '%'
	s.consume() // Consume '>'

	return {
		type: 'inlineJS',
		value,
		line,
		column,
	}
}

function collectMultilineJS(s: StringStream): IMCBTokens['multilineJS'] {
	const { line, column } = s
	s.consume() // Consume '<'
	s.consume() // Consume '%'
	s.consume() // Consume '%'
	let value = ''

	value += s.collectWhile(s => !(s.look(0, 3) === '%%>'))

	s.consume() // Consume '%'
	s.consume() // Consume '%'
	s.consume() // Consume '>'

	return {
		type: 'multilineJS',
		value,
		line,
		column,
	}
}

function tokenizer(s: StringStream, tokens: AnyMCBToken[]): boolean {
	if (s.look(0, 3) === '<%%') tokens.push(collectMultilineJS(s))
	else if (s.look(0, 2) === '<%') tokens.push(collectInlineJS(s))
	else return false
	return true
}

export function tokenize(s: StringStream) {
	return vanillaTokenize(s, tokenizer)
}
