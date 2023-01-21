import { CharacterStream } from './characterStream'
import { throwTokenError } from './errors'
import * as vanilla from './vanillaTokenizer'

export type Tokens = vanilla.Tokens | ITokenInlineJS | ITokenMultilineJS | ITokenCompileIf | ITokenCompileLoop

export interface ITokenInlineJS extends vanilla.IToken {
	type: 'inlineJS'
	js: string
}

export interface ITokenMultilineJS extends vanilla.IToken {
	type: 'multilineJS'
	js: string
}

export interface ITokenCompileIf extends vanilla.IToken {
	type: 'compileIf'
	js: string
}

export interface ITokenCompileLoop extends vanilla.IToken {
	type: 'compileLoop'
	js: string
}

function collectInlineJS(s: CharacterStream): ITokenInlineJS {
	const { line, column } = s
	s.consume(2)
	let value = ''
	while (s.item) {
		if (s.item === undefined) throwTokenError(s, `Expected %> to close inlineJS block`)
		else if (s.look(0, 2) === '%>') break
		value += s.item
		s.consume()
	}
	s.consume(2)
	return {
		type: 'inlineJS',
		js: value,
		line,
		column,
	}
}

function collectMultilineJS(s: CharacterStream): ITokenMultilineJS {
	const { line, column } = s
	s.consume(2)
	let value = ''
	while (s.item) {
		if (s.item === undefined) throwTokenError(s, `Expected %%> to close multilineJS block`)
		else if (s.look(0, 3) === '%%>') break
		value += s.item
		s.consume()
	}
	s.consume(3)
	return {
		type: 'multilineJS',
		js: value,
		line,
		column,
	}
}

function collectCompileIf(s: CharacterStream): ITokenCompileIf {
	const { line, column } = s
	s.consume(2) // Consume IF
	s.consumeWhile(s => vanilla.COMP.whitespace(s.itemCode)) // Consume whitespace between IF and (
	s.consume() // Consume (
	let value = ''
	let depth = 1
	while (depth > 0) {
		if (s.item == undefined) throwTokenError(s, `Expected closing bracket for compileIf Condition`)
		else if (s.item === '(') depth += 1
		else if (s.item === ')') depth -= 1
		if (depth == 0) break
		value += s.item
		s.consume()
	}
	s.consume() // Consume )

	return {
		type: 'compileIf',
		js: value,
		line,
		column,
	}
}

function collectCompileLoop(s: CharacterStream): ITokenCompileLoop {
	const { line, column } = s
	s.consume(4) // Consume LOOP
	s.consumeWhile(s => vanilla.COMP.whitespace(s.itemCode)) // Consume whitespace between LOOP and (
	s.consume() // Consume (
	let value = ''
	let depth = 1
	while (depth > 0) {
		if (s.item == undefined) throwTokenError(s, `Expected closing bracket for compileLoop Condition`, line, column)
		else if (s.item === '(') depth += 1
		else if (s.item === ')') depth -= 1
		if (depth == 0) break
		value += s.item
		s.consume()
	}
	s.consume() // Consume )

	return {
		type: 'compileLoop',
		js: value,
		line,
		column,
	}
}

export function tokenize(s: CharacterStream): Tokens[] {
	return vanilla.tokenize(s, (s, tokens: Tokens[]) => {
		if (s.look(0, 2) === '<%') {
			tokens.push(collectInlineJS(s))
			return true
		} else if (s.look(0, 3) === '<%%') {
			tokens.push(collectMultilineJS(s))
			return true
		} else if (s.look(0, 2) === 'IF') {
			tokens.push(collectCompileIf(s))
			return true
		} else if (s.look(0, 4) === 'LOOP') {
			tokens.push(collectCompileLoop(s))
			return true
		}
	})
}
