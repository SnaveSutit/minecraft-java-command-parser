import {
	assertTypeAndConsume,
	createParserFunc,
	ISyntaxTokens,
	TokenStream,
} from '../../parsers/vanillaParser'
import {
	ICommandSyntaxTokens,
	isEndOfCommand,
	parseNbtObject,
	parseNbtPath,
	parseResourceLocation,
	parseTargetSelector,
	parseVec3,
} from '../vanillaCommands'

export const parseFunctionCommand = createParserFunc(
	'at Function command at %POS',
	function (s: TokenStream): ICommandSyntaxTokens['function'] {
		const { line, column } = s.item!
		let args: ISyntaxTokens['nbtObject'] | undefined = undefined
		s.consume() // Consume literal:'function'
		assertTypeAndConsume(s, 'space')
		const functionName = parseResourceLocation(s, true)

		if (isEndOfCommand(s))
			return {
				type: 'command',
				name: 'function',
				functionName,
				line,
				column,
			}

		assertTypeAndConsume(s, 'space')

		if (s.item?.value === 'with') {
			// With Branch
			s.consume() // Consume literal:'with'
			assertTypeAndConsume(s, 'space')
			switch (s.item?.value as 'block' | 'entity' | 'storage') {
				case 'block': {
					s.collect() // Collect literal:'block'
					assertTypeAndConsume(s, 'space')
					const sourcePos = parseVec3(s)
					assertTypeAndConsume(s, 'space')
					const path = parseNbtPath(s)
					return {
						type: 'command',
						name: 'function',
						functionName,
						line,
						column,
						withBranch: 'block',
						sourcePos,
						path,
					}
				}
				case 'entity': {
					s.collect() // Collect literal:'entity'
					assertTypeAndConsume(s, 'space')
					const source = parseTargetSelector(s)
					assertTypeAndConsume(s, 'space')
					const path = parseNbtPath(s)
					return {
						type: 'command',
						name: 'function',
						functionName,
						line,
						column,
						withBranch: 'entity',
						source,
						path,
					}
				}
				case 'storage': {
					s.collect() // Collect literal:'storage'
					assertTypeAndConsume(s, 'space')
					const storage = parseResourceLocation(s, false)
					assertTypeAndConsume(s, 'space')
					const path = parseNbtPath(s)
					return {
						type: 'command',
						name: 'function',
						functionName,
						line,
						column,
						withBranch: 'storage',
						storage,
						path,
					}
				}
				default:
					throw Error(
						`Unexpected nbt target type '${s.item?.value}' when parsing 'with' branch of function command`
					)
			}
		}

		if (s.item?.type === 'bracket') {
			args = parseNbtObject(s)
		}

		return {
			type: 'command',
			name: 'function',
			functionName,
			line,
			column,
			withBranch: undefined,
			arguments: args,
		}
	}
)
