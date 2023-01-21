interface IToken<T, V> {
	type: T
	value: V
	raw: string
	line: number
	column: number
}

interface ITokens {
	literal: IToken<'literal', string>
	control: IToken<'control', string>
	bracket: IToken<'bracket', string>
}

type AnyToken = ITokens[keyof ITokens]

const t: AnyToken[] = []

const control: ITokens['literal'] = {
	type: 'literal',
	value: '',
	raw: '',
	line: 1,
	column: 1,
}

t.push(
	control,
	{
		type: 'bracket',
		value: '',
		raw: '',
		line: 1,
		column: 1,
	},
	{
		type: 'control',
		value: '',
		raw: '',
		line: 1,
		column: 1,
	}
)

export const f = false
