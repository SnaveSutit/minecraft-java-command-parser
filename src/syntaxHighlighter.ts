import { AnySyntaxToken } from './vanillaParser'
import { terminal as term } from 'terminal-kit'
import { AnyToken } from './vanillaTokenizer'

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
			term.brightCyan(token.value)
			break
		case 'float':
			term.brightGreen(String(token.value))
			break
		case 'int':
			term.brightGreen(String(token.value))
			break
		case 'literal':
			term.white(token.value)
			break
		case 'newline':
			term('\n')
			break
		case 'quotedString':
			term.green(escape(token.bracket + token.value + token.bracket))
			break
		case 'space':
			term(' ')
			break
	}
}

export function highlightSyntaxTree(syntaxTree: AnySyntaxToken[]) {
	function recurse(syntax: AnySyntaxToken) {
		switch (syntax.type) {
			case 'command':
				term('\n').brightCyan(escape(syntax.name))(' ')
				switch (syntax.name) {
					default:
						break
				}
				// if (syntax)
				// 	for (const child of syntax) {
				// 		colorToken(child)
				// 	}
				break
			case 'unknownCommand':
				term('\n').cyan(escape(syntax.name))(' ')
				term(escape(syntax.content))
		}
	}
	syntaxTree.forEach(v => recurse(v))
}
