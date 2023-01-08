import { CharacterStream } from './characterStream'
import { tokenize } from './tokenizer'
import * as fs from 'fs'

const content = fs.readFileSync('./tests/debug.mcfunction', 'utf-8')

let tokens
try {
	tokens = tokenize(new CharacterStream(content))
} catch (e: any) {
	if (e.name === 'MinecraftSyntaxError') {
		console.log(e.message)
	} else {
		console.error(e)
	}
}

console.log(tokens)
fs.writeFileSync('./debug/tokens.json', JSON.stringify(tokens, null, '\t'))
