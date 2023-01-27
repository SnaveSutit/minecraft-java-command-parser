import { StringStream } from 'generic-stream'
import { tokenize as mcbuildTokenizer } from './tokenizers/mcbuildTokenizer'
import { parser as mcbuildParser } from './parsers/mcbuildParser'
import { tokenize as vanillaTokenizer } from './tokenizers/vanillaTokenizer'
import { parse as vanillaParser } from './parsers/vanillaParser'
import * as fs from 'fs'
import { terminal as term } from 'terminal-kit'
import { Clock, roundToN } from './util'

function logResults(clock: Clock, length: number, message: string) {
	const diff = clock.diff!

	term.brightGreen(
		message.replaceAll('%MS', `${diff}ms`).replaceAll('%LENGTH', String(length))
	).brightGreen(`(${roundToN((diff / length) * 1000, 100000)}μs/item) \u{1F52C}\n`)
}

async function runPerfTest(n: number = 1000) {
	const progressBar = term.progressBar({
		title: 'Running performance test...',
		percent: true,
	})

	const times: {
		tokenCount: number
		tokenTime: number
		syntaxCount: number
		syntaxTime: number
		totalTime: number
	}[] = []

	const code = await fs.promises.readFile('./tests/microchip_tick.mcfunction', 'utf-8')
	for (let i = 0; i < n; i++) {
		const totalClock = new Clock()
		const tokenClock = new Clock()
		const syntaxClock = new Clock()

		totalClock.start()
		tokenClock.start()
		const tokens = vanillaTokenizer(new StringStream(code))
		tokenClock.end()

		syntaxClock.start()
		const syntaxTree = vanillaParser(tokens)
		syntaxClock.end()
		totalClock.end()

		times.push({
			tokenCount: tokens.length,
			tokenTime: tokenClock.diff!,
			syntaxCount: syntaxTree.length,
			syntaxTime: syntaxClock.diff!,
			totalTime: totalClock.diff!,
		})

		progressBar.update(i / n)
		// Wait for progress bar to update
		await new Promise(resolve => setTimeout(resolve, 1))
	}

	progressBar.update(1)
	progressBar.stop()
	term('\n')

	const averageTokenTime = times.reduce((a, b) => a + b.tokenTime, 0) / n
	const averageSyntaxTime = times.reduce((a, b) => a + b.syntaxTime, 0) / n
	const averageTotalTime = times.reduce((a, b) => a + b.totalTime, 0) / n

	term.brightGreen('---- Performance Results ----\n')
	term.brightGreen('Parsed ')
		.brightCyan(code.length)
		.brightGreen(' characters ')
		.brightCyan(n)
		.brightGreen(' times.\n')

	term.brightGreen('Average total time: ').brightCyan(roundToN(averageTotalTime, 100000) + 'ms\n')
	term.brightGreen('Average tokenization time: ').brightCyan(
		roundToN(averageTokenTime, 100000) + 'ms\n'
	)
	term.brightGreen('Average syntax time: ').brightCyan(
		roundToN(averageSyntaxTime, 100000) + 'ms\n'
	)
	term.brightGreen('Average tokenization time per character: ').brightCyan(
		roundToN(times.reduce((a, b) => a + b.tokenTime / code.length, 0) / n, 100000) + 'μs\n'
	)
	term.brightGreen('Average syntax time per token: ').brightCyan(
		roundToN(times.reduce((a, b) => a + b.syntaxTime / b.tokenCount, 0) / n, 100000) + 'μs\n'
	)
	term.brightGreen('Average syntax parsing time per syntax node: ').brightCyan(
		roundToN(times.reduce((a, b) => a + b.syntaxTime / b.syntaxCount, 0) / n, 100000) + 'μs\n'
	)

	term.brightGreen('-----------------------------\n')
}

async function vanillaTest() {
	const code = fs.readFileSync('./tests/microchip_tick.mcfunction', 'utf-8')

	const tokenClock = new Clock()
	tokenClock.start()
	const tokens = vanillaTokenizer(new StringStream(code))
	tokenClock.end()

	if (!tokens) process.exit()
	logResults(tokenClock, code.length, 'Took %MS to parse %LENGTH characters. ')
	term.brightCyan(`Created ${tokens.length} tokens.\n`)
	// fs.writeFileSync('./debug/tokens.json', JSON.stringify(tokens, null, '\t'))
	const syntaxClock = new Clock()
	syntaxClock.start()
	const syntaxTree = vanillaParser(tokens)
	syntaxClock.end()

	logResults(syntaxClock, tokens.length, 'Took %MS to parse %LENGTH tokens. ')
	term.brightCyan(`Created ${syntaxTree.length} Syntax Tokens.\n`)
	// fs.writeFileSync('./debug/syntaxTree.json', JSON.stringify(syntaxTree, null, '\t'))
}

async function mcbuildTest() {
	const code = fs.readFileSync('./tests/mcb_syntax.mc', 'utf-8')

	const tokenClock = new Clock()
	tokenClock.start()
	const tokens = mcbuildTokenizer(new StringStream(code))
	tokenClock.end()

	if (!tokens) process.exit()
	logResults(tokenClock, code.length, 'Took %MS to parse %LENGTH characters. ')
	term.brightCyan(`Created ${tokens.length} tokens.\n`)
	fs.writeFileSync('./debug/tokens.json', JSON.stringify(tokens, null, '\t'))
	const syntaxClock = new Clock()
	syntaxClock.start()
	const syntaxTree = mcbuildParser(tokens)
	syntaxClock.end()

	logResults(syntaxClock, tokens.length, 'Took %MS to parse %LENGTH tokens. ')
	term.brightCyan(`Created ${syntaxTree.length} Syntax Tokens.\n`)
	fs.writeFileSync('./debug/syntaxTree.json', JSON.stringify(syntaxTree, null, '\t'))
}

// vanillaTest()
mcbuildTest()
// runPerfTest(1000)
