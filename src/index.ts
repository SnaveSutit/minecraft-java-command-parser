import { CharacterStream } from './characterStream'
import { tokenize } from './tokenizer'
import * as fs from 'fs'

const content = fs.readFileSync('./tests/debug.mcfunction', 'utf-8')

const tokens = tokenize(new CharacterStream(content))

console.log(tokens)
