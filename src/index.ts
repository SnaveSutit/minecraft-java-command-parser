import { StringStream } from './util/stringStream'
// import * as mcbuild from './mcbuildTokenizer'
import * as vanillaTokenizer from './tokenizers/vanillaTokenizer'
import * as fs from 'fs'
import * as vanillaParser from './parsers/vanillaParser'
import { terminal as term } from 'terminal-kit'
import { Clock, roundToN } from './util'

function logResults(clock: Clock, length: number, message: string) {
	const diff = clock.diff!

	term.brightGreen(
		message.replaceAll('%MS', `${diff}ms`).replaceAll('%LENGTH', String(length))
	).brightGreen(`(${roundToN((diff / length) * 1000, 100000)}μs/item) \u{1F52C}\n`)
}

async function main() {
	// const code = fs.readFileSync('./tests/microchip_tick.mcfunction', 'utf-8')
	const code = fs.readFileSync('./tests/execute.mcfunction', 'utf-8')
	// const code = fs.readFileSync('./tests/debug.mcfunction', 'utf-8')
	// const code = fs.readFileSync('./tests/redstone_microchip.mc', 'utf-8')
	// const code = fs.readFileSync('./tests/astar.mc', 'utf-8')

	let tokens: vanillaTokenizer.AnyToken[] | undefined
	const tokenClock = new Clock()
	try {
		tokenClock.start()
		tokens = vanillaTokenizer.tokenize(new StringStream(code))
		tokenClock.end()
	} catch (e: any) {
		throw e
	}

	if (!tokens) process.exit()
	// term('\n')('--- Tokens ---')('\n')
	// for (const token of tokens) {
	// 	highlightToken(token)
	// }
	// term('\n')('--------------')('\n')
	logResults(tokenClock, code.length, 'Took %MS to parse %LENGTH characters. ')
	term.brightCyan(`Created ${tokens.length} tokens.\n`)

	fs.writeFileSync('./debug/tokens.json', JSON.stringify(tokens, null, '\t'))

	// Syntax
	let syntaxTree: vanillaParser.AnySyntaxToken[] | undefined
	const syntaxClock = new Clock()
	try {
		syntaxClock.start()
		syntaxTree = vanillaParser.parse(tokens)
		syntaxClock.end()
	} catch (e: any) {
		throw e
	}

	if (!syntaxTree) process.exit()

	// term('\n')('--- Syntax ---')('\n')
	// highlightSyntaxTree(syntaxTree)
	// term('\n')('--------------')('\n')
	logResults(syntaxClock, tokens.length, 'Took %MS to parse %LENGTH tokens. ')
	term.brightCyan(`Created ${syntaxTree.length} Syntax Tokens.\n`)

	fs.writeFileSync('./debug/syntaxTree.json', JSON.stringify(syntaxTree, null, '\t'))
}

main()
