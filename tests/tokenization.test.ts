import { StringStream } from '../src/util/stringStream'
import * as vanillaTokenizer from '../src/tokenizers/vanillaTokenizer'
import * as fs from 'fs'

describe('StringStream', () => {
	const testFile = fs.readFileSync('./tests/tokenization.test.mcfunction', 'utf-8')

	it('gets the right line number', () => {
		const s = new StringStream(testFile)
		expect(s.line).toBe(0)

		s.consumeWhile(s => s.item !== '\n')
		expect(s.item).toBe('\n')
		s.consume() // Consume \n
		expect(s.line).toBe(1)

		s.consumeWhile(s => s.item !== '\n')
		expect(s.item).toBe('\n')
		s.consume() // Consume \n
		expect(s.line).toBe(2)

		s.consumeWhile(s => s.item !== '\n')
		expect(s.item).toBe('\n')
		s.consume() // Consume \n
		expect(s.line).toBe(3)
	})

	it('gets the right column number', () => {
		const s = new StringStream(testFile)
		for (let i = 0; i < 5; i++) s.consume()
		expect(s.column).toBe(6)

		s.consumeWhile(s => s.item !== '\n')
		expect(s.item).toBe('\n')
		s.consume() // Consume \n

		for (let i = 0; i < 9; i++) s.consume()
		expect(s.column).toBe(10)
	})
})

describe('Tokenization', () => {
	it('tokenizes comments and newlines', () => {
		const tokens = vanillaTokenizer.tokenize(
			new StringStream('# Hello World!\n# Hello Again!\n')
		)
		expect(tokens[0].type).toBe('comment')
		expect(tokens[0].value).toBe(' Hello World!')

		expect(tokens[1].type).toBe('newline')
		expect(tokens[1].value).toBe('\n')

		expect(tokens[2].type).toBe('comment')
		expect(tokens[2].value).toBe(' Hello Again!')

		expect(tokens[3].type).toBe('newline')
		expect(tokens[3].value).toBe('\n')
	})

	it('tokenizes literals and spaces', () => {
		const tokens = vanillaTokenizer.tokenize(new StringStream('say greetings'))
		expect(tokens[0].type).toBe('literal')
		expect(tokens[0].value).toBe('say')

		expect(tokens[1].type).toBe('space')
		expect(tokens[1].value).toBe(' ')

		expect(tokens[2].type).toBe('literal')
		expect(tokens[2].value).toBe('greetings')
	})

	it('tokenizes numbers', () => {
		let tokens = vanillaTokenizer.tokenize(new StringStream('0 -3 16 4000 .2 10.5 15.'))
		expect(tokens[0].type).toBe('number')
		expect(tokens[0].value).toBe('0')

		expect(tokens[2].type).toBe('control')
		expect(tokens[2].value).toBe('-')
		expect(tokens[3].type).toBe('number')
		expect(tokens[3].value).toBe('3')

		expect(tokens[5].type).toBe('number')
		expect(tokens[5].value).toBe('16')

		expect(tokens[7].type).toBe('number')
		expect(tokens[7].value).toBe('4000')

		expect(tokens[9].type).toBe('control')
		expect(tokens[9].value).toBe('.')
		expect(tokens[10].type).toBe('number')
		expect(tokens[10].value).toBe('2')

		expect(tokens[12].type).toBe('number')
		expect(tokens[12].value).toBe('10')
		expect(tokens[13].type).toBe('control')
		expect(tokens[13].value).toBe('.')
		expect(tokens[14].type).toBe('number')
		expect(tokens[14].value).toBe('5')

		expect(tokens[16].type).toBe('number')
		expect(tokens[16].value).toBe('15')
		expect(tokens[17].type).toBe('control')
		expect(tokens[17].value).toBe('.')
	})
})

describe('Parsing', () => {})
