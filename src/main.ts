import { tokenize } from './lexer'
import { register as VanillaCommandRegister } from './vanillaCommands'

// Object.fromEntries(Object.entries(test).filter(i => i[1] instanceof Command))

import * as fs from 'fs'
import { roundToN } from './util'

async function compile(str: string) {
	const start = Date.now()
	const tokens = tokenize(str, [VanillaCommandRegister], true)
	const end = Date.now()

	const total = end - start
	console.log(
		`Took ${total}ms to parse ${str.length} characters. (${roundToN(
			(total / str.length) * 1000,
			100000
		)}μs/char) \u{1F52C}`
	)

	return tokens
}

async function main() {
	const buffer = await fs.promises.readFile('./debug.mcfunction')
	await compile(buffer.toString()).then(
		tokens => fs.promises.writeFile('./ast.json', JSON.stringify(tokens, null, '\t')),
		err => {
			if (err.name === 'MinecraftSyntaxError') console.log(err.message)
			else throw err
		}
	)
}

main()
