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
		case 'block':
			highlightSyntaxToken(token.block)
			if (token.blockstate) highlightSyntaxToken(token.blockstate)
			break
		case 'blockstate':
			term.brightRed('[')
			const states = Object.entries(token.states)
			states.forEach(([k, v], i) => {
				term(k).brightCyan('=')
				highlightSyntaxToken(v)
				if (i < states.length - 1) term.brightCyan(',')
			})
			term.brightRed(']')
			break
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
			term.yellow(token.name)(' ')
			switch (token.name) {
				case 'align':
					term.yellow(token.swizzle)
					break
				case 'anchored':
					term.yellow(token.anchor)
					break
				case 'as':
					highlightSyntaxToken(token.target)
					break
				case 'at':
					highlightSyntaxToken(token.target)
					break
				case 'facing':
					if (token.entityBranch) {
						highlightSyntaxToken(token.target)
						term(' ')
						term.yellow(token.anchor)
					} else highlightSyntaxToken(token.position)
					break
				case 'if':
				case 'unless':
					term.yellow(token.conditionBranch)(' ')
					switch (token.conditionBranch) {
						case 'block':
							highlightSyntaxToken(token.position)
							term(' ')
							highlightSyntaxToken(token.block)
							break
						default:
							throw new Error(`Unknown if condition '${token.name}'`)
					}
					break
				default:
					throw new Error(`Unknown executeSubCommand '${token.name}'`)
			}
			term(' ')
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
					term.brightCyan('@' + token.selectorChar)
					if (token.args.length > 0) {
						term.brightRed('[')
						token.args.forEach((t, i) => {
							highlightSyntaxToken(t)
							if (i < token.args.length - 1) term.brightCyan(',')
						})
						term.brightRed(']')
					}
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
		case 'vec3':
			if (token.xSpace) term.brightGreen(token.xSpace)
			if (token.x) highlightSyntaxToken(token.x)
			term(' ')
			if (token.ySpace) term.brightGreen(token.ySpace)
			if (token.y) highlightSyntaxToken(token.y)
			term(' ')
			if (token.zSpace) term.brightGreen(token.zSpace)
			if (token.z) highlightSyntaxToken(token.z)
			break
		default:
			throw new Error(
				`Syntax highligher encountered unexpected token '${(token as AnySyntaxToken).type}'`
			)
	}
}

export function highlightSyntaxTree(syntaxTree: AnySyntaxToken[]) {
	syntaxTree.forEach(v => highlightSyntaxToken(v))
}
