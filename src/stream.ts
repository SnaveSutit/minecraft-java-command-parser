interface Line {
	number: number
	startIndex: number
	content: string
}

/**
 * A simple text stream class.
 * Useful for language parsing
 */
export class CharacterStream {
	string: string
	index: number = -1
	item?: string
	line: number = 0
	lineStart: number = 0
	column: number = 1
	length: number
	lines: Line[] = []

	constructor(str: string) {
		this.string = str
		this.length = str.length
		this.consume()
	}

	/**
	 * Returns the next character in the stream.

	 * Does not consume
	 */
	next() {
		return this.string.at(this.index + 1)
	}

	/**
	 * Returns a string slice of the stream relative to the current item

	 * Does not consume
	 * @param start Where to start the slice relative to the current index
	 * @param end How many characters after the start to collect. Defaults to 0
	 */
	look(start: number, end: number = 1) {
		return this.string.slice(this.index + start, this.index + start + end)
	}

	/**
	 * Returns a string slice of the stream.

	 * Does not consume
	 * @param start Start index of the slice
	 * @param end End index of the slice
	 */
	slice(start: number, end: number = 1) {
		return this.string.slice(start, end)
	}

	/**
	 * Returns a string consisting of all consecutive characters in the stream from the current index that match the condition.

	 * Does Consume
	 * @param condition
	 * @returns
	 */
	collect(condition: (stream: CharacterStream) => any) {
		let str = ''
		while (this.item && condition(this)) {
			str += this.item
			this.consume()
		}
		return str
	}

	/**
	 * Returns the next index of the provided character in the stream

	 * Does not consume
	 * @param comparison The character to search for, or a function that takes a character and returns a boolean
	 * @returns The index of the character if found. Otherwise false
	 */
	seek(comparison: string | ((c: string) => boolean), max?: number): number | undefined {
		if (max) max = this.index + max
		else max = this.string.length
		if (typeof comparison === 'string') {
			for (let i = this.index; i < max; i++) {
				const c = this.string.at(i)
				if (c && c === comparison) return i
			}
		} else {
			for (let i = this.index; i < max; i++) {
				const c = this.string.at(i)
				if (c && comparison(c)) return i
			}
		}
		return
	}

	/**
	 * Returns the stream index of the line specified
	 * @param lineNumber The ID of the line
	 */
	lineNumberToIndex(lineNumber: number) {
		// const line = this.lines.find(l => l.number === lineNumber)
		const line = this.lines.at(lineNumber - 1)
		if (!line) throw new Error(`Tried to access line ${lineNumber} before stream reached it.`)
		return line.startIndex
	}

	/**
	 * Returns a value of 0 - 1 based on how much of the stream has been consumed
	 */
	getProgress() {
		return Math.min(this.index / this.string.length, 1)
	}

	/**
	 * Consumes while a condition is true
	 */
	consumeWhile(condition: (stream: CharacterStream) => any) {
		while (this.item && condition(this)) this.consume()
	}

	/**
	 * Consumes the next character(s) in the stream
	 * @param n How many caracters to consume
	 */
	consume(n = 1) {
		this.item = this.string.at(this.index + n)
		this.column += n
		this.index += n
		if (this.string.at(this.index - 1) === '\n') this.addLine()
	}

	private addLine() {
		this.line++
		this.lineStart = this.index
		const i = this.seek('\n')
		this.lines.push({
			number: this.line,
			startIndex: this.lineStart,
			content: this.string.slice(this.lineStart, i ? i + 1 : this.string.length),
		})
		this.column = 1
	}
}
