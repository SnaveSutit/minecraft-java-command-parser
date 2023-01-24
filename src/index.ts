import { StringStream } from './util/stringStream'
// import * as mcbuild from './mcbuildTokenizer'
import * as vanillaTokenizer from './tokenizers/vanillaTokenizer'
import * as fs from 'fs'
import * as vanillaParser from './parsers/vanillaParser'
import { terminal as term } from 'terminal-kit'
import { highlightToken, highlightSyntaxTree } from './syntaxHighlighter'

async function main() {
	const code = fs.readFileSync('./tests/debug.mcfunction', 'utf-8')
	// const code = fs.readFileSync('./tests/redstone_microchip.mc', 'utf-8')
	// const code = fs.readFileSync('./tests/astar.mc', 'utf-8')

	let tokens: vanillaTokenizer.AnyToken[] | undefined
	try {
		tokens = vanillaTokenizer.tokenize(new StringStream(code))
	} catch (e: any) {
		throw e
		if (e.name === 'MinecraftTokenError') {
			console.log(e.message)
		} else {
			throw e
		}
	}

	if (!tokens) process.exit()
	term('\n')('--- Tokens ---')('\n')
	for (const token of tokens) {
		highlightToken(token)
	}
	term('--------------')('\n')

	fs.writeFileSync('./debug/tokens.json', JSON.stringify(tokens, null, '\t'))

	// Syntax
	let syntaxTree: vanillaParser.AnySyntaxToken[] | undefined
	try {
		syntaxTree = vanillaParser.parse(tokens)
	} catch (e: any) {
		throw e
		if (e.name === 'MinecraftSyntaxError' || e.name === 'MinecraftTokenError') {
			console.log(e.message)
		} else {
			throw e
		}
	}

	if (!syntaxTree) process.exit()

	term('\n')('--- Syntax ---')('\n')
	highlightSyntaxTree(syntaxTree)
	term('--------------')('\n')

	fs.writeFileSync('./debug/syntaxTree.json', JSON.stringify(syntaxTree, null, '\t'))
}

main()
// console.log(
// 	`Took an average of ${average}ms to parse ${code.length} characters over ${iterations} iterations. (${roundToN(
// 		(average / code.length) * 1000,
// 		100000
// 	)}μs/char) \u{1F52C}`
// )
// console.log('Attempts:', attempts.join('ms, '))
