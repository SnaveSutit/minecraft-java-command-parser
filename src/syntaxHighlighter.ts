import { AnySyntaxToken } from './parsers/vanillaParser'
import { terminal as term } from 'terminal-kit'
import { AnyToken } from './tokenizers/vanillaTokenizer'

function escape(str: string) {
	return str.replace(/\%/g, '%%')
}

export function highlightToken(token: AnyToken) {
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
		case 'boolean':
			term.red(token.value)
			break
		default:
			// @ts-ignore
			throw Error(`Unexpected token type '${token.type}' when highlighting tokens`)
	}
}

function highlightSyntaxToken(token: AnySyntaxToken) {
	switch (token.type) {
		case 'advancementObject':
			term.brightRed('{')
			let i = 0
			token.advancements.forEach((v, k) => {
				highlightSyntaxToken(k)
				term.brightCyan('=')
				highlightSyntaxToken(v)
				if (i < token.advancements.size - 1) term.brightCyan(',')
				i++
			})
			term.brightRed('}')
			break
		// case 'block':
		// case 'blockstate':
		case 'boolean':
			term.red(String(token.value))
			break
		case 'command':
			if (token.name === 'unknown') {
				term.brightBlue(token.commandName)(' ')
				token.tokens.forEach(t => highlightToken(t))
				term('\n')
			} else {
				term.brightBlue(token.name)(' ')
				token.subCommands.forEach(t => highlightSyntaxToken(t))
				term('\n')
			}
			break
		case 'executeSubCommand':
			if (token.name === 'as') {
				term.yellow('as')(' ')
				highlightSyntaxToken(token.target)
				term(' ')
			}
			break
		case 'int':
		case 'float':
			term.brightGreen(token.value)
			if (token.identifier) term.green(token.identifier)
			break
		case 'intRange':
		case 'floatRange':
			if (token.min) highlightSyntaxToken(token.min)
			term.brightCyan('..')
			if (token.max) highlightSyntaxToken(token.max)
			break
		case 'literal':
			term(token.value)
			break
		case 'nbtList':
			term.brightRed('[')
			switch (token.itemType) {
				case 'int':
					term.cyan('I;')
					break
				case 'byte':
					term.cyan('B;')
					break
				case 'long':
					term.cyan('L;')
					break
			}
			token.items.forEach((v, i) => {
				highlightSyntaxToken(v)
				if (i < token.items.length - 1) term.brightCyan(',')
			})
			term.brightRed(']')
			break
		case 'nbtObject':
			term.brightRed('{')
			const obj = Object.entries(token.value)
			obj.forEach(([k, v], i) => {
				term(k).brightCyan(':')
				highlightSyntaxToken(v)
				if (i < obj.length - 1) term.brightCyan(',')
			})
			term.brightRed('}')
			break
		// case 'nbtPath':
		case 'quotedString':
			term.brightBlue(token.bracket + token.value + token.bracket)
			break
		case 'resourceLocation':
			term.brightBlue(token.namespace + ':' + token.path)
			break
		case 'scoreObject':
			term.brightRed('{')
			const scores = Object.entries(token.scores)
			scores.forEach(([k, v], i) => {
				term(k).brightCyan('=')
				highlightSyntaxToken(v)
				if (i < scores.length - 1) term.brightCyan(',')
			})
			term.brightRed('}')
			break
		case 'targetSelector':
			switch (token.targetType) {
				case 'uuid':
					term.brightMagenta(token.value)(' ')
					break
				case 'literal':
					term(token.value)(' ')
					break
				case 'selector':
					term.brightCyan('@' + token.selectorChar).brightRed('[')
					token.args.forEach((t, i) => {
						highlightSyntaxToken(t)
						if (i < token.args.length - 1) term.brightCyan(',')
					})
					term.brightRed(']')
					break
			}
			break
		case 'targetSelectorArgument':
			term(token.key).brightCyan('=')
			if (token.inverted) term.brightRed('!')
			if (token.value) highlightSyntaxToken(token.value)
			break
		// case 'uuid':
		// case 'vec2':
		// case 'vec3':
		default:
			throw new Error(
				`Syntax highligher encountered unexpected token '${(token as AnySyntaxToken).type}'`
			)
	}
}

export function highlightSyntaxTree(syntaxTree: AnySyntaxToken[]) {
	syntaxTree.forEach(v => highlightSyntaxToken(v))
}
