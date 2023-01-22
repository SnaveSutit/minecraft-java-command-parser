import { AnySyntaxToken } from './parsers/vanillaParser'
import { terminal as term } from 'terminal-kit'
import { AnyToken } from './tokenizers/vanillaTokenizer'

function escape(str: string) {
	return str.replace(/\%/g, '%%')
}

export function colorToken(token: AnyToken) {
	switch (token.type) {
		case 'bracket':
			term.brightRed(token.value)
			break
		case 'comment':
			term.gray(escape('#' + token.value))
			break
		case 'control':
			term.cyan(token.value)
			break
		case 'number':
			term.brightGreen(String(token.value))
			break
		case 'int':
			term.brightGreen(String(token.value))
			break
		case 'float':
			term.brightGreen(String(token.value))
			break
		case 'literal':
			term.white(token.value)
			break
		case 'newline':
			term('\n')
			break
		case 'quotedString':
			term.brightBlue(escape(token.bracket + token.value + token.bracket))
			break
		case 'space':
			term(' ')
			break
		default:
			// @ts-ignore
			throw Error(`Unexpected token type '${token.type}' when highlighting tokens`)
	}
}

export function highlightSyntaxTree(syntaxTree: AnySyntaxToken[]) {
	function recurse(syntax: AnySyntaxToken) {
		switch (syntax.type) {
			case 'command':
				if (syntax.name === 'unknown') {
					term('\n').cyan(escape(syntax.name))(' ')
					term(escape(syntax.content))
				} else {
					term('\n').brightCyan(escape(syntax.name))(' ')
					switch (syntax.name) {
						default:
							break
					}
					// if (syntax)
					// 	for (const child of syntax) {
					// 		colorToken(child)
					// 	}
				}
				break
		}
	}
	syntaxTree.forEach(v => recurse(v))
}
