import {
	CommandRegister,
	Command as C,
	TokenAnyNbt,
	TokenBlock,
	TokenBoolean,
	TokenCollectors as Token,
	TokenCommand,
	TokenCoordinateTriplet,
	TokenDouble,
	TokenInt,
	TokenItem,
	TokenJson,
	TokenNbtObject,
	TokenNbtPath,
	TokenResourceLocation,
	TokenRotationCoordinate,
	TokenString,
	TokenLiteral,
	TokenSwizzle,
	TokenTargetEntity,
	TokenUnquotedString,
	TokenUuid,
	GLOBALS as G,
	Consumers as Consume,
	throwSyntaxError,
	CHARS,
	TokenUnknownCommand,
	TokenIntRange,
	SETTINGS,
	TokenCoordinatePair,
	TokenArray,
	TokenAny,
} from './lexer'

const CR = new CommandRegister('minecraft:vanilla')
export { CR as register }

/**
 * ```html
 * /advancement <action: (grant|revoke)> ...
 * - grant <target: targetEntity> <operation: (everything|only|from|through|until)> ...
 *   - everything
 *   - only <advancement: resourceLocation> [<criterion: unquotedString>]
 *   - from ...
 *   - through ...
 *   - until ...
 *     - <advancement: resourceLocation>
 * - revoke <target: targetEntity> <operation: (everything|only|from|through|until)> ...
 *   - everything
 *   - only <advancement: resourceLocation> [<criterion: unquotedString>]
 *   - from ...
 *   - through ...
 *   - until ...
 *     - <advancement: resourceLocation>
 * ```
 */
interface TokenAdvancementCommand extends TokenCommand {
	name: 'advancement'
	args: {
		action: TokenLiteral
		target: TokenTargetEntity
		operation: TokenLiteral
		advancement?: TokenResourceLocation
		criterion?: TokenUnquotedString
	}
}
export const advancementCommand = CR.newCommand<TokenAdvancementCommand>(
	'advancement',
	{
		action: ['grant', 'revoke'],
		operation: ['everything', 'only', 'from', 'through', 'until'],
	},
	(s, t, c) => {
		// <action: (grant|revoke)>
		t.args.action = C.requiredArg(s, Token.Literal, [c.meta.action])
		// <target: targetEntity>
		t.args.target = C.requiredArg(s, Token.TargetEntity)
		// <operation: (everything|only|from|through|until)>
		t.args.operation = C.requiredArg(s, Token.Literal, [c.meta.operation])

		if (t.args.operation.value !== 'everything') {
			// <advancement: resourceLocation>
			t.args.advancement = C.requiredArg(s, Token.ResourceLocation)
		}

		if (t.args.operation.value === 'only') {
			// [<criterion: unquotedString>]
			t.args.criterion = C.optionalArg(s, Token.UnquotedString)
		}

		return t
	}
)

/**
 * ```html
 * /attribute <target: targetEntity> <attribute: resourceLocation> <action: (get|base|modifier)> ...
 * - get [<scale: double>]
 * - base <operation: (get|set)> ...
 *   - get [<scale: double>]
 *   - set <value: double>
 * - modifier <operation: (add|remove|value get)> ...
 *   - add <uuid: uuid> <name: string|unquotedString> <value: double> <modifierOperation: (add|multiply|multiply_base)>
 *   - remove <uuid: uuid>
 *   - value get <uuid: uuid> [<scale: double>]
 * ```
 */
interface TokenAttributeCommand extends TokenCommand {
	name: 'attribute'
	args: {
		target: TokenTargetEntity
		attribute: TokenResourceLocation
		action: TokenLiteral & { value: 'get' | 'base' | 'modifier' }
		scale?: TokenDouble
		operation?: TokenLiteral & { value: 'get' | 'set' }
		value?: TokenDouble
		uuid?: TokenUuid
		name?: TokenString | TokenUnquotedString
		modifierMode?: TokenLiteral & { value: 'add' | 'remove' | 'value get' }
		modifierOperation?: TokenLiteral & { value: 'add' | 'multiply_base' | 'multiply' }
	}
}
export const attributeCommand = CR.newCommand<TokenAttributeCommand>(
	'attribute',
	{
		action: ['get', 'base', 'modifier'],
		operation: ['get', 'set'],
		modifierMode: ['add', 'remove', 'value get'],
		modifierOperation: ['add', 'multiply_base', 'multiply'],
	},
	(s, t, c) => {
		// <target: targetEntity>
		t.args.target = C.requiredArg(s, Token.TargetEntity)
		// <attribute: resourceLocation>
		t.args.attribute = C.requiredArg(s, Token.ResourceLocation)
		// <action: (get|base|modifier)>
		t.args.action = C.requiredArg(s, Token.Literal, [c.meta.action])
		switch (t.args.action.value) {
			case 'get':
				// get [<scale: double>]
				t.args.scale = C.optionalArg(s, Token.Double)
				break
			case 'base':
				// <operation: (get|set)>
				t.args.operation = C.requiredArg(s, Token.Literal, [c.meta.operation])
				if (t.args.operation.value === 'get') {
					// [<scale: double>]
					t.args.scale = C.optionalArg(s, Token.Double)
				} else {
					// <value: double>
					t.args.value = C.requiredArg(s, Token.Double)
				}
				break
			case 'modifier':
				// <modifierMode: (add|remove|value get)>
				t.args.modifierMode = C.requiredArg(s, Token.Literal, [c.meta.modifierMode])
				switch (t.args.modifierMode.value) {
					case 'add':
						// <uuid: uuid>
						t.args.uuid = C.requiredArg(s, Token.UUID)
						// <name: string|unquotedString>
						t.args.name = C.requiredArg(s, Token.String, [true])
						// <value: double>
						t.args.value = C.requiredArg(s, Token.Double)
						// <modifierOperation: (add|multiply|multiply_base)>
						t.args.modifierOperation = C.requiredArg(s, Token.Literal, [
							c.meta.modifierOperation,
						])
						break
					case 'remove':
						// <uuid: uuid>
						t.args.uuid = C.requiredArg(s, Token.UUID)
						break
					case 'value get':
						// <uuid: uuid>
						t.args.uuid = C.requiredArg(s, Token.UUID)
						// [<scale: double>]
						t.args.scale = C.optionalArg(s, Token.Double)
						break
				}
				break
		}
		return t
	}
)

/**
 * ```html
 * /bossbar <mode: (add|get|list|remove|set)> ...
 * - add <id: resourceLocation> <name: textComponent>
 * - get <id: resourceLocation> <query: (max|players|value|visible)>
 * - list
 * - remove <id: resourceLocation>
 * - set <id: resourceLocation> <property: (color|max|name|players|style|value|visible)> ...
 *   - color <color: (blue|green|pink|purple|red|white|yellow)>
 *   - max <max: int>
 *   - name <name: textComponent>
 *   - players [<targets: targetEntity>]
 *   - style <style: (notched_6|notched_10|notched_12|notched_20|progress)>
 *   - value <value: int>
 *   - visible <visible: boolean>
 * ```
 */
interface TokenBossbarCommand extends TokenCommand {
	name: 'bossbar'
	args: {
		mode: TokenLiteral & { value: 'add' | 'get' | 'list' | 'remove' | 'set' }
		id?: TokenResourceLocation
		name?: TokenJson
		query?: TokenLiteral & { value: 'max' | 'players' | 'value' | 'visible' }
		property?: TokenLiteral & {
			value: 'color' | 'max' | 'name' | 'players' | 'style' | 'value' | 'visible'
		}
		color?: TokenLiteral & {
			value: 'blue' | 'green' | 'pink' | 'purple' | 'red' | 'white' | 'yellow'
		}
		max?: TokenInt
		targets?: TokenTargetEntity
		style?: TokenLiteral & {
			value: 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20' | 'progress'
		}
		value?: TokenInt
		visible?: TokenBoolean
	}
}
export const bossbarCommand = CR.newCommand<TokenBossbarCommand>(
	'bossbar',
	{
		mode: ['add', 'get', 'list', 'remove', 'set'],
		query: ['max', 'players', 'value', 'visible'],
		property: ['color', 'max', 'name', 'players', 'style', 'value', 'visible'],
		color: ['blue', 'green', 'pink', 'purple', 'red', 'white', 'yellow'],
		style: ['notched_6', 'notched_10', 'notched_12', 'notched_20', 'progress'],
	},
	(s, t, c) => {
		// <mode: (add|get|list|remove|set)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])

		switch (t.args.mode.value) {
			case 'add':
				// add
				// <id: resourceLocation>
				t.args.id = C.requiredArg(s, Token.ResourceLocation)
				// <name: textComponent>
				t.args.name = C.requiredArg(s, Token.Json)
				break
			case 'get':
				// get
				// <id: resourceLocation>
				t.args.id = C.requiredArg(s, Token.ResourceLocation)
				// <query: (max|players|value|visible)>
				t.args.query = C.requiredArg(s, Token.Literal, [c.meta.query])
				break
			case 'set':
				// set
				// <id: resourceLocation>
				t.args.id = C.requiredArg(s, Token.ResourceLocation)
				// <property: (color|max|name|players|style|value|visible)> ...
				t.args.property = C.requiredArg(s, Token.Literal, [c.meta.property])
				switch (t.args.property.value) {
					case 'color':
						// color
						// <color: (blue|green|pink|purple|red|white|yellow)>
						t.args.color = C.requiredArg(s, Token.Literal, [c.meta.color])
						break
					case 'max':
						// max
						// <max: int>
						t.args.max = C.requiredArg(s, Token.Int)
						break
					case 'name':
						// name
						// <name: textComponent>
						t.args.name = C.requiredArg(s, Token.Json)
						break
					case 'players':
						// players
						// [<targets: targetEntity>]
						t.args.targets = C.optionalArg(s, Token.TargetEntity)
						break
					case 'style':
						// style
						// <style: (notched_6|notched_10|notched_12|notched_20|progress)>
						t.args.style = C.requiredArg(s, Token.Literal, [c.meta.style])
						break
					case 'value':
						// value
						// <value: int>
						t.args.value = C.requiredArg(s, Token.Int)
						break
					case 'visible':
						// visible
						// <visible: boolean>
						t.args.visible = C.requiredArg(s, Token.Boolean)
						break
				}
				break
			case 'list':
				// - list
				break
			case 'remove':
				// - remove <id: resourceLocation>
				t.args.id = C.requiredArg(s, Token.ResourceLocation)
				break
		}

		return t
	}
)

/**
 * ```html
 * /clear [<targets: targetEntity>] [<item: item>] [<maxCount: int>]
 * ```
 */
interface TokenClearCommand extends TokenCommand {
	name: 'clear'
	args: {
		targets?: TokenTargetEntity
		item?: TokenItem
		maxCount?: TokenInt
	}
}
export const clearCommand = CR.newCommand<TokenClearCommand>('clear', {}, (s, t, c) => {
	// [<targets: targetEntity>]
	t.args.targets = C.optionalArg(s, Token.TargetEntity)
	// [<item: item>]
	t.args.item = C.optionalArg(s, Token.Item)
	// [<maxCount: int>]
	t.args.maxCount = C.optionalArg(s, Token.Int)

	return t
})

/**
 * ```html
 * /clone <from: coordinateTriplet> <to: coordinateTriplet> <destination: coordinateTriplet> [<maskMode: (replace|masked|filtered)>] ...
 * - replace ...
 * - masked ...
 * - filtered <filter: block> ...
 *   - [<cloneMode: (force|move|normal)>]
 * ```
 */
interface TokenCloneCommand extends TokenCommand {
	name: 'clone'
	args: {
		from: TokenCoordinateTriplet
		to: TokenCoordinateTriplet
		destination: TokenCoordinateTriplet
		maskMode?: TokenLiteral & { value: 'replace' | 'masked' | 'filtered' }
		filter?: TokenBlock
		cloneMode?: TokenLiteral & { value: 'force' | 'move' | 'normal' }
	}
}
export const cloneCommand = CR.newCommand<TokenCloneCommand>(
	'clone',
	{
		maskMode: ['replace', 'masked', 'filtered'],
		cloneMode: ['force', 'move', 'normal'],
	},
	(s, t, c) => {
		// <from: coordinateTriplet>
		t.args.from = C.requiredArg(s, Token.CoordinateTriplet)
		// <to: coordinateTriplet>
		t.args.to = C.requiredArg(s, Token.CoordinateTriplet)
		// <destination: coordinateTriplet>
		t.args.destination = C.requiredArg(s, Token.CoordinateTriplet)
		// [<maskMode: (replace|masked|filtered)>] ...
		t.args.maskMode = C.optionalArg(s, Token.Literal, [c.meta.maskMode])
		switch (t.args.maskMode?.value) {
			case 'filtered':
				// filtered
				// <filter: block>
				t.args.filter = C.requiredArg(s, Token.Block)
			case 'masked':
			case 'replace':
				// replace ...
				// masked ...
				// [<cloneMode: (force|move|normal)>]
				t.args.cloneMode = C.optionalArg(s, Token.Literal, [c.meta.cloneMode])
				break
		}

		return t
	}
)

/**
 * ```html
 * /data <mode: (get|merge|modify|remove)> ...
 * - get <dataType: (block|entity|storage)> ...
 *   - block <targetPos: coordinateTriplet> ...
 *   - entity <targetEntity: targetEntity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - [<targetPath: nbtPath>] [<scale: double>]
 * - merge <dataType: (block|entity|storage)> ...
 *   - block <targetPos: coordinateTriplet> ...
 *   - entity <targetEntity: targetEntity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - <nbt: nbtObject>
 * - modify <dataType: (block|entity|storage)> ...
 *   - block <targetPos: coordinateTriplet> ...
 *   - entity <targetEntity: targetEntity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - <targetPath: nbtPath> <modifyMode: (append|insert|merge|prepend|set)> ...
 *       - append <setMode: (from|value)> ...
 *       - insert <index: int> <setMode: (from|value)> ...
 *       - merge <setMode: (from|value)> ...
 *       - prepend <setMode: (from|value)> ...
 *       - set <setMode: (from|value)> ...
 *         - from <fromDataType: (block|entity|storage)>
 *           - block <sourcePos: coordinateTriplet> ...
 *           - entity <sourceEntity: targetEntity> ...
 *           - storage <sourceStorage: resourceLocation> ...
 *             - [<sourcePath: nbtPath>]
 *         - value <value: nbtAny>
 * - remove <dataType: (block|entity|storage)> ...
 *   - block <targetPos: coordinateTriplet> ...
 *   - entity <targetEntity: targetEntity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - <targetPath: nbtPath>
 * ```
 */
interface TokenDataCommand extends TokenCommand {
	name: 'data'
	args: {
		mode: TokenLiteral & { value: 'get' | 'merge' | 'modify' | 'remove' }
		dataType: TokenLiteral & { value: 'block' | 'entity' | 'storage' }
		targetPos?: TokenCoordinateTriplet
		targetEntity?: TokenTargetEntity
		targetStorage?: TokenResourceLocation
		targetPath?: TokenNbtPath
		sourcePos?: TokenCoordinateTriplet
		sourceEntity?: TokenTargetEntity
		sourceStorage?: TokenResourceLocation
		sourcePath?: TokenNbtPath
		scale?: TokenDouble
		nbt?: TokenNbtObject
		modifyMode?: TokenLiteral & {
			value: 'append' | 'insert' | 'merge' | 'prepend' | 'set'
		}
		setMode?: TokenLiteral & { value: 'value' | 'from' }
		index?: TokenInt
		fromDataType?: TokenLiteral & { value: 'block' | 'entity' | 'storage' }
		fromPath?: TokenNbtPath
		value?: TokenAnyNbt
	}
}
export const dataCommand = CR.newCommand<TokenDataCommand>(
	'data',
	{
		mode: ['get', 'merge', 'modify', 'remove'],
		dataType: ['block', 'entity', 'storage'],
		modifyMode: ['append', 'insert', 'merge', 'prepend', 'set'],
		setMode: ['value', 'from'],
	},
	(s, t, c) => {
		// <mode: (get|merge|modify|remove)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		switch (t.args.mode.value) {
			case 'get':
				// get
				// <dataType: (block|entity|storage)>
				t.args.dataType = C.requiredArg(s, Token.Literal, [c.meta.dataType])
				switch (t.args.dataType.value) {
					case 'block':
						// block <targetPos: coordinateTriplet>
						t.args.targetPos = C.requiredArg(s, Token.CoordinateTriplet)
						break
					case 'entity':
						// entity <targetEntity: targetEntity>
						t.args.targetEntity = C.requiredArg(s, Token.TargetEntity)
						break
					case 'storage':
						// storage <targetStorage: resourceLocation>
						t.args.targetStorage = C.requiredArg(s, Token.ResourceLocation)
						break
				}
				// [<targetPath: nbtPath>]
				t.args.targetPath = C.optionalArg(s, Token.NBTPath)
				// [<scale: double>]
				t.args.scale = C.optionalArg(s, Token.Double)
				break
			case 'merge':
				// merge
				// <dataType: (block|entity|storage)>
				t.args.dataType = C.requiredArg(s, Token.Literal, [c.meta.dataType])
				switch (t.args.dataType.value) {
					case 'block':
						// block <targetPos: coordinateTriplet>
						t.args.targetPos = C.requiredArg(s, Token.CoordinateTriplet)
						break
					case 'entity':
						// entity <targetEntity: targetEntity>
						t.args.targetEntity = C.requiredArg(s, Token.TargetEntity)
						break
					case 'storage':
						// storage <targetStorage: resourceLocation>
						t.args.targetStorage = C.requiredArg(s, Token.ResourceLocation)
						break
				}
				// <nbt: nbtObject>
				t.args.nbt = C.requiredArg(s, Token.NBTObject)
				break
			case 'modify':
				// modify
				// <dataType: (block|entity|storage)>
				t.args.dataType = C.requiredArg(s, Token.Literal, [c.meta.dataType])
				switch (t.args.dataType.value) {
					case 'block':
						// block <targetPos: coordinateTriplet>
						t.args.targetPos = C.requiredArg(s, Token.CoordinateTriplet)
						break
					case 'entity':
						// entity <targetEntity: targetEntity>
						t.args.targetEntity = C.requiredArg(s, Token.TargetEntity)
						break
					case 'storage':
						// storage <targetStorage: resourceLocation>
						t.args.targetStorage = C.requiredArg(s, Token.ResourceLocation)
						break
				}
				// <targetPath: nbtPath>
				t.args.targetPath = C.requiredArg(s, Token.NBTPath)
				// <modifyMode: (append|insert|merge|prepend|set)> ...
				t.args.modifyMode = C.requiredArg(s, Token.Literal, [c.meta.modifyMode])
				switch (t.args.modifyMode.value) {
					case 'insert':
						// insert
						// <index: int>
						t.args.index = C.requiredArg(s, Token.Int)
					case 'append':
					case 'merge':
					case 'prepend':
					case 'set':
						// append ...
						// merge ...
						// prepend ...
						// set ...
						// <setMode: (from|value)>
						t.args.setMode = C.requiredArg(s, Token.Literal, [c.meta.setMode])
						break
				}
				if (t.args.setMode.value === 'from') {
					// from
					// <fromDataType: (block|entity|storage)>
					t.args.fromDataType = C.requiredArg(s, Token.Literal, [c.meta.dataType])
					switch (t.args.fromDataType.value) {
						case 'block':
							// block <sourcePos: coordinateTriplet> ...
							t.args.sourcePos = C.requiredArg(s, Token.CoordinateTriplet)
							break
						case 'entity':
							// entity <sourceEntity: targetEntity> ...
							t.args.sourceEntity = C.requiredArg(s, Token.TargetEntity)
							break
						case 'storage':
							// storage <sourceStorage: resourceLocation> ...
							t.args.sourceStorage = C.requiredArg(s, Token.ResourceLocation)
							break
					}
					// [<sourcePath: nbtPath>]
					t.args.sourcePath = C.optionalArg(s, Token.NBTPath)
				} else {
					// value
					// <value: nbtAny>
					t.args.value = C.requiredArg(s, Token.AnyNbt)
				}
				break
			case 'remove':
				// - remove <dataType: (block|entity|storage)> ...
				t.args.dataType = C.requiredArg(s, Token.Literal, [c.meta.dataType])
				switch (t.args.dataType.value) {
					case 'block':
						// block <targetPos: coordinateTriplet> ...
						t.args.targetPos = C.requiredArg(s, Token.CoordinateTriplet)
						break
					case 'entity':
						// entity <targetEntity: targetEntity> ...
						t.args.targetEntity = C.requiredArg(s, Token.TargetEntity)
						break
					case 'storage':
						// storage <targetStorage: resourceLocation> ...
						t.args.targetStorage = C.requiredArg(s, Token.ResourceLocation)
						break
				}
				// <targetPath: nbtPath>
				t.args.targetPath = C.requiredArg(s, Token.NBTPath)
				break
		}

		return t
	}
)

/**
 * ```html
 * /datapack <mode: (enable|disable|list)> ...
 * - disable <name: string|unquotedString>
 * - enable <name: string|unquotedString> [<order: (first|last|before|after)>] ...
 *   - first|last
 *   - before|after <existing: string|unquotedString>
 * - list <listMode: (available|enabled)>
 * ```
 */
interface TokenDatapackCommand extends TokenCommand {
	name: 'datapack'
	args: {
		mode: TokenLiteral & { value: 'enable' | 'disable' | 'list' }
		name?: TokenString | TokenUnquotedString
		order?: TokenLiteral & { value: 'first' | 'last' | 'before' | 'after' }
		existing?: TokenString | TokenUnquotedString
		listMode?: TokenLiteral & { value: 'available' | 'enabled' }
	}
}
export const datapackCommand = CR.newCommand<TokenDatapackCommand>(
	'datapack',
	{
		mode: ['enable', 'disable', 'list'],
		order: ['first', 'last', 'before', 'after'],
		listMode: ['available', 'enabled'],
	},
	(s, t, c) => {
		// <mode: (enable|disable|list)> ...
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		switch (t.args.mode.value) {
			case 'disable':
				// disable
				// <name: string|unquotedString>
				t.args.name = C.requiredArg(s, Token.String, [true])
				break
			case 'enable':
				// enable
				// <name: string|unquotedString>
				t.args.name = C.requiredArg(s, Token.String, [true])
				// [<order: (first|last|before|after)>] ...
				t.args.order = C.optionalArg(s, Token.Literal, [c.meta.order])
				switch (t.args.order?.value) {
					case 'before':
					case 'after':
						// before|after
						// <existing: string|unquotedString>
						t.args.existing = C.requiredArg(s, Token.String, [true])
						break
					default:
						// first|last || undefined
						break
				}
				break
			case 'list':
				// list
				// <listMode: (available|enabled)>
				t.args.listMode = C.optionalArg(s, Token.Literal, [c.meta.listMode])
				break
		}
		return t
	}
)

/**
 * ```html
 * /difficulty [<mode: (easy|hard|normal|peaceful)>]
 * ```
 */
interface TokenDifficultyCommand extends TokenCommand {
	name: 'difficulty'
	args: {
		mode: TokenLiteral & { value: 'easy' | 'hard' | 'normal' | 'peaceful' }
	}
}
export const difficultyCommand = CR.newCommand<TokenDifficultyCommand>(
	'difficulty',
	{
		mode: ['easy', 'hard', 'normal', 'peaceful'],
	},
	(s, t, c) => {
		// [<mode: (easy|hard|normal|peaceful)>]
		t.args.mode = C.optionalArg(s, Token.Literal, [c.meta.mode])
		return t
	}
)

/**
 * ```html
 * /effect <mode: (clear|give)> ...
 * - clear [<targets: targetEntity>] [<effect: resourceLocation>]
 * - give <targets: targetEntity> <effect: resourceLocation> [<seconds: int>] [<amplifier: int>] [<hideParticles: boolean>]
 * ```
 */
interface TokenEffectCommand extends TokenCommand {
	name: 'effect'
	args: {
		mode: TokenLiteral & { value: 'clear' | 'give' }
		targets?: TokenTargetEntity
		effect?: TokenResourceLocation
		seconds?: TokenInt
		amplifier?: TokenInt
		hideParticles?: TokenBoolean
	}
}
export const effectCommand = CR.newCommand<TokenEffectCommand>(
	'effect',
	{
		mode: ['clear', 'give'],
	},
	(s, t, c) => {
		// <mode: (clear|give)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode.value === 'clear') {
			// clear
			// [<targets: targetEntity>]
			t.args.targets = C.optionalArg(s, Token.TargetEntity)
			// [<effect: resourceLocation>]
			t.args.effect = C.optionalArg(s, Token.ResourceLocation)
		} else {
			// give
			// <targets: targetEntity>
			t.args.targets = C.requiredArg(s, Token.TargetEntity)
			// <effect: resourceLocation>
			t.args.effect = C.requiredArg(s, Token.ResourceLocation)
			// [<seconds: int>]
			t.args.seconds = C.optionalArg(s, Token.Int)
			// [<amplifier: int>]
			t.args.amplifier = C.optionalArg(s, Token.Int)
			// [<hideParticles: boolean>]
			t.args.hideParticles = C.optionalArg(s, Token.Boolean)
		}

		return t
	}
)

/**
 * ```html
 * /enchant <targets: targetEntity> <enchantment: resourceLocation> [<level: int>]
 * ```
 */
interface TokenEnchantCommand extends TokenCommand {
	name: 'enchant'
	args: {
		targets: TokenTargetEntity
		enchantment: TokenResourceLocation
		level?: TokenInt
	}
}
export const enchantCommand = CR.newCommand<TokenEnchantCommand>('enchant', {}, (s, t, c) => {
	// <targets: targetEntity>
	t.args.targets = C.requiredArg(s, Token.TargetEntity)
	// <enchantment: resourceLocation>
	t.args.enchantment = C.requiredArg(s, Token.ResourceLocation)
	// [<level: int>]
	t.args.level = C.optionalArg(s, Token.Int)
	return t
})

interface ExecuteAlignSubCommand extends TokenCommand {
	name: 'align'
	args: {
		swizzle: TokenSwizzle
	}
}
interface ExecuteAnchoredSubCommand extends TokenCommand {
	name: 'anchored'
	args: {
		part: TokenLiteral & { value: 'eyes' | 'feet' }
	}
}
interface ExecuteAsSubCommand extends TokenCommand {
	name: 'as'
	args: {
		targets: TokenTargetEntity
	}
}
interface ExecuteAtSubCommand extends TokenCommand {
	name: 'at'
	args: {
		targets: TokenTargetEntity
	}
}
interface ExecuteFacingSubCommand extends TokenCommand {
	name: 'facing'
	args: {
		entity?: TokenLiteral & { value: 'entity' }
		targets?: TokenTargetEntity
		anchor?: TokenLiteral & { value: 'eyes' | 'feet' }
		pos?: TokenCoordinateTriplet
	}
}
interface ExecuteInSubCommand extends TokenCommand {
	name: 'in'
	args: {
		dimension: TokenResourceLocation
	}
}
interface ExecutePositionedSubCommand extends TokenCommand {
	name: 'positioned'
	args: {
		as?: TokenLiteral & { value: 'as' }
		targets?: TokenTargetEntity
		pos?: TokenCoordinateTriplet
	}
}
interface ExecuteRotatedSubCommand extends TokenCommand {
	name: 'rotated'
	args: {
		as?: TokenLiteral & { value: 'as' }
		targets?: TokenTargetEntity
		xRot?: TokenRotationCoordinate
		yRot?: TokenRotationCoordinate
	}
}
interface ExecuteStoreSubCommand extends TokenCommand {
	name: 'store'
	args: {
		mode: TokenLiteral & { value: 'result' | 'success' }
		location: TokenLiteral & { value: 'block' | 'bossbar' | 'entity' | 'score' | 'storage' }
		pos?: TokenCoordinateTriplet
		path?: TokenNbtPath | (TokenLiteral & { value: 'max' | 'value' })
		type?: TokenLiteral & { value: 'byte' | 'short' | 'int' | 'long' | 'float' | 'double' }
		scale?: TokenDouble
		id?: TokenResourceLocation
		target?: TokenTargetEntity
		targets?: TokenTargetEntity
		objective?: TokenUnquotedString
		storage?: TokenResourceLocation
	}
}
interface ExecuteConditionalSubCommand extends TokenCommand {
	name: 'if' | 'unless'
	args: {
		check: TokenLiteral & {
			value: 'blocks' | 'block' | 'data' | 'entity' | 'predicate' | 'score'
		}
		pos?: TokenCoordinateTriplet
		block?: TokenBlock
		from?: TokenCoordinateTriplet
		to?: TokenCoordinateTriplet
		destination?: TokenCoordinateTriplet
		maskMode?: TokenLiteral & { value: 'all' | 'masked' }
		type?: TokenLiteral & { value: 'block' | 'entity' | 'storage' }
		path?: TokenNbtPath
		targets?: TokenTargetEntity
		storage?: TokenResourceLocation
		predicate?: TokenResourceLocation
		target?: TokenTargetEntity
		targetObjective?: TokenUnquotedString
		matches?: TokenLiteral & { value: 'matches' }
		operator?: TokenLiteral & { value: '<=' | '<' | '=' | '>=' | '>' }
		range?: TokenIntRange | TokenInt
		source?: TokenTargetEntity
		sourceObjective?: TokenUnquotedString
	}
}
interface ExecuteRunSubCommand extends TokenCommand {
	name: 'run'
	args: {
		command: TokenCommand | TokenUnknownCommand
	}
}
function newSubCommand<T extends keyof ExecuteSubCommands>(
	target: T,
	args: ExecuteSubCommands[T]['args']
): ExecuteSubCommands[T] {
	// @ts-ignore
	return {
		type: 'command',
		name: target,
		args,
		raw: `${target} ${Object.entries(args)
			.filter(i => i[1])
			.map(([_, v]) => (Array.isArray(v) ? v.filter(i => i).map(i => i.raw) : v.raw))
			.join(' ')}`,
	}
}
type ExecuteSubCommands = {
	align: ExecuteAlignSubCommand
	anchored: ExecuteAnchoredSubCommand
	as: ExecuteAsSubCommand
	at: ExecuteAtSubCommand
	if: ExecuteConditionalSubCommand
	unless: ExecuteConditionalSubCommand
	facing: ExecuteFacingSubCommand
	in: ExecuteInSubCommand
	positioned: ExecutePositionedSubCommand
	rotated: ExecuteRotatedSubCommand
	store: ExecuteStoreSubCommand
	run: ExecuteRunSubCommand
}
type AnyExecuteSubCommand =
	| ExecuteAlignSubCommand
	| ExecuteAnchoredSubCommand
	| ExecuteAsSubCommand
	| ExecuteAtSubCommand
	| ExecuteConditionalSubCommand
	| ExecuteFacingSubCommand
	| ExecuteInSubCommand
	| ExecutePositionedSubCommand
	| ExecuteRotatedSubCommand
	| ExecuteStoreSubCommand
	| ExecuteRunSubCommand
/**
 * ```html
 * /execute <SUBCOMMAND>
 * <SUBCOMMAND>: <name: (align|anchored|as|at|facing|in|positioned|rotated|store|if|unless|run)> ...
 * - align <swizzle: swizzle> <SUBCOMMAND>
 * - anchored <part: (eyes|feet)> <SUBCOMMAND>
 * - as <targets: targetEntity> <SUBCOMMAND>
 * - at <targets: targetEntity> <SUBCOMMAND>
 * - facing ...
 *   - [<entity: (entity)>] <targets: targetEntity> <anchor: (eyes|feet)> <SUBCOMMAND>
 *   - <pos: coordinateTriplet> <SUBCOMMAND>
 * - in <dimension: resourceLocation> <SUBCOMMAND>
 * - positioned ...
 *   - [<as: (as)>] <targets: targetEntity> <SUBCOMMAND>
 *   - <pos: coordinateTriplet> <SUBCOMMAND>
 * - rotated ...
 *   - [<as: (as)>] <targets: targetEntity> <SUBCOMMAND>
 *   - <xRot: rotationCoordinate> <yRot: rotationCoordinate> <SUBCOMMAND>
 * - store <mode: (resultSuccess)> <location: (block|bossbar|entity|score|storage)> ...
 *   - block <pos: coordinateTriplet> <path: nbtPath> <type: (byte|short|int|long|float|double)> <scale: double> <SUBCOMMAND>
 *   - bossbar <id: resourceLocation> <path: (max|value)> <SUBCOMMAND>
 *   - entity <target: targetEntity> <path: nbtPath> <type: (byte|short|int|long|float|double)> <scale: double> <SUBCOMMAND>
 *   - score <targets: targetEntity> <objective: unquotedString> <SUBCOMMAND>
 *   - storage <storage: resourceLocation> <path: nbtPath> <type: (byte|short|int|long|float|double)> <scale: double> <SUBCOMMAND>
 * - if ...
 * - unless ...
 *   - <check: (blocks|block|data|entity|predicate|score)> ...
 *     - block <pos: coordinateTriplet> <block: block> <SUBCOMMAND>
 *     - blocks <from: coordinateTriplet> <to: coordinateTriplet> <destination: coordinateTriplet> <maskMode: (all|masked)> <SUBCOMMAND>
 *     - data <type: (block|entity|storage)> ...
 *       - block <pos: coordinateTriplet> <path: nbtPath> <SUBCOMMAND>
 *       - entity <targets: targetEntity> <path: nbtPath> <SUBCOMMAND>
 *       - storage <storage: resourceLocation> <path: nbtPath> <SUBCOMMAND>
 *     - entity <targets: targetEntity> <SUBCOMMAND>
 *     - predicate <predicate: resourceLocation> <SUBCOMMAND>
 *     - score <target: targetEntity> <targetObjective: unquotedString> ...
 *       - [<matches: (matches)>] <range: rangeableInt> <SUBCOMMAND>
 *       - <operator: (<=|<|=|>=|>)> <source: targetEntity> <sourceObjective: unquotedString> <SUBCOMMAND>
 * - run <command: command>
 * ```
 */
interface TokenExecuteCommand extends TokenCommand {
	name: 'execute'
	args: {
		subCommands: AnyExecuteSubCommand[]
	}
}
export const executeCommand = CR.newCommand<TokenExecuteCommand>(
	'execute',
	{
		subCommands: [
			'align',
			'anchored',
			'as',
			'at',
			'facing',
			'in',
			'positioned',
			'rotated',
			'store',
			'if',
			'unless',
			'run',
		],
		anchorPart: ['eyes', 'feet'],
		entity: ['entity'],
		as: ['as'],
		storeMode: ['result', 'success'],
		location: ['block', 'bossbar', 'entity', 'score', 'storage'],
		dataType: ['byte', 'short', 'int', 'long', 'float', 'double'],
		bossbarPath: ['max', 'value'],
		conditionalCheck: ['blocks', 'block', 'data', 'entity', 'predicate', 'score'],
		maskMode: ['all', 'masked'],
		dataCheckType: ['block', 'entity', 'storage'],
		matches: ['matches'],
		operators: ['<=', '<', '=', '>=', '>'],
	},
	(s, t, c) => {
		t.args.subCommands = []

		Consume.whitespace(s, !G.multiline)
		while (s.item) {
			const name = C.requiredArg(s, Token.Literal, [c.meta.subCommands])
			Consume.whitespace(s, !G.multiline)
			let swizzle,
				part,
				targets,
				entity,
				anchor,
				pos,
				dimension,
				_as,
				xRot,
				yRot,
				mode,
				_location,
				path,
				_type,
				scale,
				_id,
				target,
				objective,
				storage,
				command,
				check,
				block,
				from,
				to,
				destination,
				maskMode,
				predicate,
				matches,
				source,
				sourceObjective,
				range,
				operator,
				targetObjective
			switch (name.value) {
				case 'align':
					// align
					// <swizzle: swizzle>
					swizzle = C.requiredArg(s, Token.Swizzle)
					// return
					t.args.subCommands.push(newSubCommand('align', { swizzle }))
					break
				case 'anchored':
					// anchored
					// <part: (eyes|feet)>
					part = C.requiredArg(s, Token.Literal, [c.meta.anchorPart])
					// return
					t.args.subCommands.push(newSubCommand('anchored', { part }))
					break
				case 'as':
					// as
					// <targets: targetEntity>
					targets = C.requiredArg(s, Token.TargetEntity)
					// return
					t.args.subCommands.push(newSubCommand('as', { targets }))
					break
				case 'at':
					// at
					// <targets: targetEntity>
					targets = C.requiredArg(s, Token.TargetEntity)
					// return
					t.args.subCommands.push(newSubCommand('as', { targets }))
					break
				case 'facing':
					// facing
					// [<entity: (entity)>]
					entity = C.optionalArg(s, Token.Literal, [c.meta.entity], true)
					if (entity) {
						// <targets: targetEntity>
						targets = C.requiredArg(s, Token.TargetEntity)
						// <anchor: (eyes|feet)>
						anchor = C.requiredArg(s, Token.Literal, [c.meta.anchorPart])
					} else {
						// <pos: coordinateTriplet>
						pos = C.requiredArg(s, Token.CoordinateTriplet)
					}
					// return
					t.args.subCommands.push(
						newSubCommand('facing', { entity, targets, anchor, pos })
					)
					break
				case 'in':
					// in
					// <dimension: resourceLocation>
					dimension = C.requiredArg(s, Token.ResourceLocation)
					// return
					t.args.subCommands.push(newSubCommand('in', { dimension }))
					break
				case 'positioned':
					// positioned
					// [<as: (as)>]
					_as = C.optionalArg(s, Token.Literal, [c.meta.as], true)
					if (_as) {
						// <targets: targetEntity>
						targets = C.requiredArg(s, Token.TargetEntity)
					} else {
						// <pos: coordinateTriplet>
						pos = C.requiredArg(s, Token.CoordinateTriplet)
					}
					// return
					t.args.subCommands.push(newSubCommand('positioned', { as: _as, targets, pos }))
					break
				case 'rotated':
					// rotated
					// [<as: (as)>]
					_as = C.optionalArg(s, Token.Literal, [c.meta.as], true)
					if (_as) {
						// <targets: targetEntity>
						targets = C.requiredArg(s, Token.TargetEntity)
					} else {
						// <xRot: rotationCoordinate>
						// <yRot: rotationCoordinate>
						xRot = C.requiredArg(s, Token.RotationCoordinate)
						yRot = C.requiredArg(s, Token.RotationCoordinate)
					}
					// return
					t.args.subCommands.push(
						newSubCommand('rotated', { as: _as, targets, xRot, yRot })
					)
					break
				case 'store':
					// store
					// <mode: (resultSuccess)>
					mode = C.requiredArg(s, Token.Literal, [c.meta.storeMode])
					// <location: (block|bossbar|entity|score|storage)>
					_location = C.requiredArg(s, Token.Literal, [c.meta.location])
					switch (_location.value) {
						case 'block':
							// block
							// <pos: coordinateTriplet>
							pos = C.requiredArg(s, Token.CoordinateTriplet)
							// <path: nbtPath>
							path = C.requiredArg(s, Token.NBTPath)
							// <type: (byte|short|int|long|float|double)>
							_type = C.requiredArg(s, Token.Literal, [c.meta.dataType])
							// <scale: double>
							scale = C.requiredArg(s, Token.Double)
							break
						case 'bossbar':
							// bossbar
							// <id: resourceLocation>
							_id = C.requiredArg(s, Token.ResourceLocation)
							// <path: (max|value)>
							path = C.requiredArg(s, Token.Literal, [c.meta.bossbarPath])
							break
						case 'entity':
							// entity
							// <target: targetEntity>
							target = C.requiredArg(s, Token.TargetEntity)
							// <path: nbtPath>
							path = C.requiredArg(s, Token.NBTPath)
							// <type: (byte|short|int|long|float|double)>
							_type = C.requiredArg(s, Token.Literal, [c.meta.dataType])
							// <scale: double>
							scale = C.requiredArg(s, Token.Double)
							break
						case 'score':
							// score
							// <targets: targetEntity>
							targets = C.requiredArg(s, Token.TargetEntity, [true])
							// <objective: unquotedString>
							objective = C.requiredArg(s, Token.UnquotedString)
							break
						case 'storage':
							// storage
							// <storage: resourceLocation>
							storage = C.requiredArg(s, Token.ResourceLocation)
							// <path: nbtPath>
							path = C.requiredArg(s, Token.NBTPath)
							// <type: (byte|short|int|long|float|double)>
							_type = C.requiredArg(s, Token.Literal, [c.meta.dataType])
							// <scale: double>
							scale = C.requiredArg(s, Token.Double)
							break
					}
					// return
					t.args.subCommands.push(
						newSubCommand('store', {
							mode,
							location: _location,
							pos,
							path,
							type: _type,
							scale,
							id: _id,
							target,
							objective,
							storage,
						})
					)
					break
				case 'if':
				case 'unless':
					// if
					// unless
					// <check: (blocks|block|data|entity|predicate|score)>
					check = C.requiredArg(s, Token.Literal, [c.meta.conditionalCheck])
					switch (check.value) {
						case 'block':
							// block
							// <pos: coordinateTriplet>
							pos = C.requiredArg(s, Token.CoordinateTriplet)
							// <block: block>
							block = C.requiredArg(s, Token.Block)
							break
						case 'blocks':
							// blocks
							// <from: coordinateTriplet>
							from = C.requiredArg(s, Token.CoordinateTriplet)
							// <to: coordinateTriplet>
							to = C.requiredArg(s, Token.CoordinateTriplet)
							// <destination: coordinateTriplet>
							destination = C.requiredArg(s, Token.CoordinateTriplet)
							// <maskMode: (all|masked)>
							maskMode = C.requiredArg(s, Token.Literal, [c.meta.maskMode])
							break
						case 'data':
							// data
							// <type: (block|entity|storage)> ...
							_type = C.requiredArg(s, Token.Literal, [c.meta.dataCheckType])
							switch (_type.value) {
								case 'block':
									// block
									// <pos: coordinateTriplet>
									pos = C.requiredArg(s, Token.CoordinateTriplet)
									// <path: nbtPath>
									path = C.requiredArg(s, Token.NBTPath)
									break
								case 'entity':
									// entity
									// <targets: targetEntity>
									targets = C.requiredArg(s, Token.TargetEntity)
									// <path: nbtPath>
									path = C.requiredArg(s, Token.NBTPath)
									break
								case 'storage':
									// storage
									// <storage: resourceLocation>
									storage = C.requiredArg(s, Token.ResourceLocation)
									// <path: nbtPath>
									path = C.requiredArg(s, Token.NBTPath)
									break
							}
							break
						case 'entity':
							// entity
							// <targets: targetEntity>
							targets = C.requiredArg(s, Token.TargetEntity)
							break
						case 'predicate':
							// predicate
							// <predicate: resourceLocation>
							predicate = C.requiredArg(s, Token.ResourceLocation)
							break
						case 'score':
							// score
							// <target: targetEntity>
							target = C.requiredArg(s, Token.TargetEntity, [true])
							// <targetObjective: unquotedString>
							targetObjective = C.requiredArg(s, Token.UnquotedString)
							// [<matches: (matches)>]
							matches = C.optionalArg(s, Token.Literal, [c.meta.matches], true)
							if (matches) {
								// <range: rangeableInt>
								range = C.requiredArg(s, Token.RangeableInt)
							} else {
								// <operator: (<=|<|=|>=|>)>
								operator = C.requiredArg(s, Token.Literal, [c.meta.operators])
								// <source: targetEntity>
								source = C.requiredArg(s, Token.TargetEntity, [true])
								// <sourceObjective: unquotedString>
								sourceObjective = C.requiredArg(s, Token.UnquotedString)
							}
							break
					}
					// return
					t.args.subCommands.push(
						newSubCommand(name.value as 'if' | 'unless', {
							check,
							pos,
							block,
							from,
							to,
							destination,
							maskMode,
							type: _type,
							path: path as TokenNbtPath,
							targets,
							storage,
							predicate,
							target,
							targetObjective,
							matches,
							operator,
							range,
							source,
							sourceObjective,
						})
					)
					break
				case 'run':
					// run
					if (G.multiline && s.item !== '|') {
						G.multiline = false
						// <command: command>
						command = Token.Command(s, [CR])
						G.multiline = true
					} else {
						if (!SETTINGS.multilineCommandsEnabled)
							throwSyntaxError(
								s,
								'MinecraftSyntaxError: Multiline commands are not enabled. Mutliline command defined'
							)
						else if (s.item === '|') {
							s.consume()
							Consume.whitespace(s, false)
						}
						// <command: command>
						command = Token.Command(s, [CR])
					}
					// return
					t.args.subCommands.push(newSubCommand('run', { command }))
					// end command
					return t
			}

			Consume.whitespace(s, !G.multiline)
			if (CHARS.NEWLINES(s.item)) break
		}

		return t
	}
)

/**
 * ```html
 * /(experiance|xp) <mode: (add|set|query)> ...
 * - add ...
 * - set ...
 *   - <targets: targetEntity> <amount: int> [<valueNode: (levels|points)>]
 * - query <targets: targetEntity> [<valueNode: (levels|points)>]
 * ```
 */
interface TokenExperienceCommand extends TokenCommand {
	name: 'experience' | 'xp'
	args: {
		mode: TokenLiteral & { value: 'add' | 'set' | 'query' }
		targets: TokenTargetEntity
		amount: TokenInt
		valueMode: TokenLiteral & { value: 'levels' | 'points' }
	}
}
export const experienceCommand = CR.newCommand<TokenExperienceCommand>(
	'experience',
	{
		mode: ['add', 'set', 'query'],
		valueMode: ['levels', 'points'],
	},
	(s, t, c) => {
		// <mode: (add|set|query)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		// <targets: targetEntity>
		t.args.targets = C.requiredArg(s, Token.TargetEntity)
		if (t.args.mode.value !== 'query')
			// <amount: int>
			t.args.amount = C.requiredArg(s, Token.Int)
		// [<valueNode: (levels|points)>]
		t.args.valueMode = C.optionalArg(s, Token.Literal, [c.meta.valueMode])
		return t
	}
)
export const xp = CR.newCommand<TokenExperienceCommand>(
	'xp',
	experienceCommand.meta,
	experienceCommand.tokenizer
)

/**
 * ```html
 * /fill <from: coordinateTriplet> <to: coordinateTriplet> <block: block> [<mode: (destroy|hollow|keep|outline|replace)>] ...
 * - destroy
 * - hollow
 * - keep
 * - outline
 * - replace [<filter: block>]
 * ```
 */
interface TokenFillCommand extends TokenCommand {
	name: 'fill'
	args: {
		from: TokenCoordinateTriplet
		to: TokenCoordinateTriplet
		block: TokenBlock
		mode?: TokenLiteral & { value: 'destroy' | 'hollow' | 'keep' | 'outline' | 'replace' }
		filter?: TokenBlock
	}
}
export const fillCommand = CR.newCommand<TokenFillCommand>(
	'fill',
	{
		mode: ['destroy', 'hollow', 'keep', 'outline', 'replace'],
	},
	(s, t, c) => {
		// <from: coordinateTriplet>
		t.args.from = C.requiredArg(s, Token.CoordinateTriplet)
		// <to: coordinateTriplet>
		t.args.to = C.requiredArg(s, Token.CoordinateTriplet)
		// <block: block>
		t.args.block = C.requiredArg(s, Token.Block)
		// [<mode: (destroy|hollow|keep|outline|replace)>] ...
		t.args.mode = C.optionalArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode?.value === 'replace')
			// - replace [<filter: block>]
			t.args.filter = C.optionalArg(s, Token.Block)

		return t
	}
)

/**
 * ```html
 * /forceload <mode: (add|remove|query)> ...
 * - add <from: coordinatePair> [<to: coordinatePair>]
 * - query [<pos: coordinatePair>]
 * - remove ...
 *   - [<all: (all)>]
 *   - <from: coordinatePair> [<to: coordinatePair>]
 * ```
 */
interface TokenForceloadCommand extends TokenCommand {
	name: 'forceload'
	args: {
		mode: TokenLiteral & { value: 'add' | 'remove' | 'query' }
		from: TokenCoordinatePair
		to?: TokenCoordinatePair
		all?: TokenLiteral & { value: 'all' }
		pos?: TokenCoordinatePair
	}
}
export const forceloadCommand = CR.newCommand<TokenForceloadCommand>(
	'forceload',
	{
		mode: ['add', 'remove', 'query'],
		all: ['all'],
	},
	(s, t, c) => {
		// <mode: (add|remove|query)> ...
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		switch (t.args.mode.value) {
			case 'add':
				// add
				// <from: coordinatePair>
				t.args.from = C.requiredArg(s, Token.CoordinatePair)
				// [<to: coordinatePair>]
				t.args.to = C.optionalArg(s, Token.CoordinatePair)
				break
			case 'query':
				// query
				// [<pos: coordinatePair>]
				t.args.pos = C.optionalArg(s, Token.CoordinatePair)
				break
			case 'remove':
				// remove
				// [<all: (all)>]
				t.args.all = C.optionalArg(s, Token.Literal, [c.meta.all], true)
				if (!t.args.all) {
					// <from: coordinatePair>
					t.args.from = C.requiredArg(s, Token.CoordinatePair)
					// [<to: coordinatePair>]
					t.args.to = C.optionalArg(s, Token.CoordinatePair)
				}
				break
		}
		return t
	}
)

/**
 * ```html
 * /function <name: resourceLocation>
 * ```
 */
interface TokenFunctionCommand extends TokenCommand {
	name: 'function'
	args: {
		name: TokenResourceLocation
	}
}
export const functionCommand = CR.newCommand<TokenFunctionCommand>('function', {}, (s, t, c) => {
	// <name: resourceLocation>
	t.args.name = C.requiredArg(s, Token.ResourceLocation)
	return t
})

/**
 * ```html
 * /gamemode <gamemode: (adventure|creative|spectator|survival)> [<targets: targetEntity>]
 * ```
 */
interface TokenGamemodeCommand extends TokenCommand {
	name: 'gamemode'
	args: {
		gamemode: TokenLiteral & { value: 'adventure' | 'creative' | 'spectator' | 'survival' }
		targets?: TokenTargetEntity
	}
}
export const gamemodeCommand = CR.newCommand<TokenGamemodeCommand>(
	'gamemode',
	{
		gamemode: ['adventure', 'creative', 'spectator', 'survival'],
	},
	(s, t, c) => {
		// <gamemode: (adventure|creative|spectator|survival)>
		t.args.gamemode = C.requiredArg(s, Token.Literal, [c.meta.gamemode])
		// [<targets: targetEntity>]
		t.args.targets = C.optionalArg(s, Token.TargetEntity)
		return t
	}
)

/**
 * ```html
 * /gamerule <gamerule: unquotedString> ...
 * - [<value: boolean>]
 * - [<value: int>]
 * ```
 */
interface TokenGameruleCommand extends TokenCommand {
	name: 'gamerule'
	args: {
		gamerule: TokenUnquotedString
		value?: TokenInt | TokenBoolean
	}
}
export const gameruleCommand = CR.newCommand<TokenGameruleCommand>('gamerule', {}, (s, t, c) => {
	// <gamerule: unquotedString>
	t.args.gamerule = C.requiredArg(s, Token.UnquotedString)
	// - [<value: boolean>]
	t.args.value = C.optionalArg(s, Token.Boolean, undefined, true)
	// - [<value: int>]
	t.args.value = C.optionalArg(s, Token.Int)
	return t
})

/**
 * ```html
 * /give <targets: targetEntity> <item: item> [<count: int>]
 * ```
 */
interface TokenGiveCommand extends TokenCommand {
	name: 'give'
	args: {
		targets: TokenTargetEntity
		item: TokenItem
		count?: TokenInt
	}
}
export const giveCommand = CR.newCommand<TokenGiveCommand>('give', {}, (s, t, c) => {
	// <targets: targetEntity>
	t.args.targets = C.requiredArg(s, Token.TargetEntity)
	// <item: item>
	t.args.item = C.requiredArg(s, Token.Item)
	// [<count: int>]
	t.args.count = C.optionalArg(s, Token.Int)
	return t
})

/**
 * ```html
 * /item <mode: (modify|replace)>
 * - modify <targetType: (block|entity)> ...
 *   - block <pos: coordinateTriplet> ...
 *   - entity <target: targetEntity> ...
 *     - <slot: unquotedString> <modifier: resourceLocation>
 * - replace <targetType: (block|entity)> ...
 *   - block <pos: coordinateTriplet> ...
 *   - entity <target: targetEntity> ...
 *     - <slot: unquotedString> <replaceMode: (with|from)> ...
 *       - with <item: item> [<count: int>]
 *       - from <sourceType: (block|entity)> ...
 *         - block <sourcePos: coordinateTriplet> ...
 *         - entity <sourceTarget: targetEntity> ...
 *           - <sourceSlot: unquotedString> [<modifier: resourceLocation>]
 * ```
 */
interface TokenItemCommand extends TokenCommand {
	name: 'item'
	args: {
		mode: TokenLiteral & { value: 'modify' | 'replace' }
		targetType: TokenLiteral & { value: 'block' | 'entity' }
		pos?: TokenCoordinateTriplet
		target?: TokenTargetEntity
		slot?: TokenUnquotedString
		modifier?: TokenResourceLocation
		replaceMode?: TokenLiteral & { value: 'with' | 'from' }
		item?: TokenItem
		count?: TokenInt
		sourceType?: TokenLiteral & { value: 'block' | 'entity' }
		sourceTarget?: TokenTargetEntity
		sourcePosition?: TokenCoordinateTriplet
		sourceSlot?: TokenUnquotedString
	}
}
export const itemCommand = CR.newCommand<TokenItemCommand>(
	'item',
	{
		mode: ['modify', 'replace'],
		targetType: ['block', 'entity'],
		replaceMode: ['with', 'from'],
		sourceType: ['block', 'entity'],
	},
	(s, t, c) => {
		// <mode: (modify|replace)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode.value === 'modify') {
			// modify
			// <targetType: (block|entity)>
			t.args.targetType = C.requiredArg(s, Token.Literal, [c.meta.targetType])
			if (t.args.targetType.value === 'block') {
				// block
				// <pos: coordinateTriplet>
				t.args.pos = C.requiredArg(s, Token.CoordinateTriplet)
			} else {
				// entity
				// <target: targetEntity>
				t.args.target = C.requiredArg(s, Token.TargetEntity)
			}
			// <slot: unquotedString>
			t.args.slot = C.requiredArg(s, Token.UnquotedString)
			// <modifier: resourceLocation>
			t.args.modifier = C.requiredArg(s, Token.ResourceLocation)
		} else {
			// <targetType: (block|entity)>
			t.args.targetType = C.requiredArg(s, Token.Literal, [c.meta.targetType])
			if (t.args.targetType.value === 'block') {
				// block
				// <pos: coordinateTriplet>
				t.args.pos = C.requiredArg(s, Token.CoordinateTriplet)
			} else {
				// entity
				// <target: targetEntity>
				t.args.target = C.requiredArg(s, Token.TargetEntity)
			}
			// <slot: unquotedString>
			t.args.slot = C.requiredArg(s, Token.UnquotedString)

			// <replaceMode: (with|from)>
			t.args.replaceMode = C.requiredArg(s, Token.Literal, [c.meta.replaceMode])
			if (t.args.replaceMode.value === 'with') {
				// with
				// <item: item>
				t.args.item = C.requiredArg(s, Token.Item)
				// [<count: int>]
				t.args.count = C.optionalArg(s, Token.Int)
			} else {
				// from
				// <sourceType: (block|entity)>
				t.args.sourceType = C.requiredArg(s, Token.Literal, [c.meta.sourceType])
				if (t.args.sourceType.value === 'block') {
					// block
					// <sourcePos: coordinateTriplet>
					t.args.sourcePosition = C.requiredArg(s, Token.CoordinateTriplet)
				} else {
					// entity
					// <source: targetEntity>
					t.args.sourceTarget = C.requiredArg(s, Token.TargetEntity)
				}
				// <sourceSlot: unquotedString>
				t.args.sourceSlot = C.requiredArg(s, Token.UnquotedString)
				// [<modifier: resourceLocation>]
				t.args.modifier = C.optionalArg(s, Token.ResourceLocation)
			}
		}
		return t
	}
)

/**
 * ```html
 * /kill [<targets: targetEntity>]
 * ```
 */
interface TokenKillCommand extends TokenCommand {
	name: 'kill'
	args: {
		targets?: TokenTargetEntity
	}
}
export const killCommand = CR.newCommand<TokenKillCommand>('kill', {}, (s, t, c) => {
	// [<targets: targetEntity>]
	t.args.targets = C.optionalArg(s, Token.TargetEntity)
	return t
})

/**
 * ```html
 * /list [<uuids: (uuids)>]
 * ```
 */
interface TokenListCommand extends TokenCommand {
	name: 'list'
	args: {
		uuids?: TokenLiteral & { value: 'uuids' }
	}
}
export const listCommand = CR.newCommand<TokenListCommand>(
	'list',
	{
		uuids: ['uuids'],
	},
	(s, t, c) => {
		// [<uuids: (uuids)>]
		t.args.uuids = C.optionalArg(s, Token.Literal, [c.meta.uuids])
		return t
	}
)

/**
 * ```html
 * /locate <feature: resourceLocation>
 * ```
 */
interface TokenLocateCommand extends TokenCommand {
	name: 'locate'
	args: {
		feature: TokenResourceLocation
	}
}
export const locateCommand = CR.newCommand<TokenLocateCommand>('locate', {}, (s, t, c) => {
	// <feature: resourceLocation>
	t.args.feature = C.requiredArg(s, Token.ResourceLocation)
	return t
})

/**
 * ```html
 * /locatebiome <biome: resourceLocation>
 * ```
 */
interface TokenLocatebiomeCommand extends TokenCommand {
	name: 'locatebiome'
	args: {
		biome: TokenResourceLocation
	}
}
export const locatebiomeCommand = CR.newCommand<TokenLocatebiomeCommand>(
	'locatebiome',
	{},
	(s, t, c) => {
		// <biome: resourceLocation>
		t.args.biome = C.requiredArg(s, Token.ResourceLocation)
		return t
	}
)

/**
 * ```html
 * /loot <TARGET> <SOURCE>
 * <TARGET>: <targetMode: (give|insert|replace|spawn)> ...
 * - give <targets: targetEntity>
 * - insert <targetPos: coordinateTriplet>
 * - spawn <targetPos: coordinateTriplet>
 * - replace <replaceMode: (block|entity)> ...
 *   - entity <targets: targetEntity> ...
 *   - block <targetPos: coordinateTriplet> ...
 *     - <slot: unquotedString> [<count: int>]
 * <SOURCE>: <sourceMode: (fish|loot|kill|mine)> ...
 * - fish <lootTable: resourceLocation> <sourcePos: coordinateTriplet> [<tool: item|(mainhand|offhand)>]
 * - loot <lootTable: resourceLocation>
 * - kill <sourceTarget: targetEntity>
 * - mine <sourcePos: coordinateTriplet> [<tool: item|(mainhand|offhand)>]
 * ```
 */
interface TokenLootCommand extends TokenCommand {
	name: 'loot'
	args: {
		targetMode: TokenLiteral & { value: 'give' | 'insert' | 'replace' | 'spawn' }
		targets?: TokenTargetEntity
		targetPos?: TokenCoordinateTriplet
		replaceMode?: TokenLiteral & { value: 'block' | 'entity' }
		slot?: TokenUnquotedString
		count?: TokenInt
		sourceMode?: TokenLiteral & { value: 'fish' | 'loot' | 'kill' | 'mine' }
		lootTable?: TokenResourceLocation
		sourcePos?: TokenCoordinateTriplet
		tool?: TokenItem | (TokenLiteral & { value: 'mainhand' | 'offhand' })
		sourceTarget?: TokenTargetEntity
	}
}
export const lootCommand = CR.newCommand<TokenLootCommand>(
	'loot',
	{
		targetMode: ['give', 'insert', 'replace', 'spawn'],
		replaceMode: ['block', 'entity'],
		sourceMode: ['fish', 'loot', 'kill', 'mine'],
		tool: ['mainhand', 'offhand'],
	},
	(s, t, c) => {
		// <TARGET>
		// <targetMode: (give|insert|replace|spawn)> ...
		t.args.targetMode = C.requiredArg(s, Token.Literal, [c.meta.targetMode])
		switch (t.args.targetMode.value) {
			case 'give':
				// give
				// <targets: targetEntity>
				t.args.targets = C.requiredArg(s, Token.TargetEntity)
				break
			case 'insert':
				// insert
				// <targetPos: coordinateTriplet>
				t.args.targetPos = C.requiredArg(s, Token.CoordinateTriplet)
				break
			case 'spawn':
				// spawn
				// <targetPos: coordinateTriplet>
				t.args.targetPos = C.requiredArg(s, Token.CoordinateTriplet)
				break
			case 'replace':
				// replace
				// <replaceMode: (block|entity)>
				t.args.replaceMode = C.requiredArg(s, Token.Literal, [c.meta.replaceMode])
				if (t.args.replaceMode.value === 'entity') {
					// entity
					// <targets: targetEntity> ...
					t.args.targets = C.requiredArg(s, Token.TargetEntity)
				} else {
					// block
					// <targetPos: coordinateTriplet> ...
					t.args.targetPos = C.requiredArg(s, Token.CoordinateTriplet)
				}
				// <slot: unquotedString>
				t.args.slot = C.requiredArg(s, Token.UnquotedString)
				// [<count: int>]
				t.args.count = C.optionalArg(s, Token.Int, undefined, true)
				break
		}
		// <SOURCE>
		// <sourceMode: (fish|loot|kill|mine)>
		t.args.sourceMode = C.requiredArg(s, Token.Literal, [c.meta.sourceMode])
		switch (t.args.sourceMode.value) {
			case 'fish':
				// fish
				// <lootTable: resourceLocation>
				t.args.lootTable = C.requiredArg(s, Token.ResourceLocation)
				// <sourcePos: coordinateTriplet>
				t.args.sourcePos = C.requiredArg(s, Token.CoordinateTriplet)
				// [<tool: item|(mainhand|offhand)>]
				t.args.tool = C.optionalArg(s, Token.Literal, [c.meta.tool], true)
				if (!t.args.tool) t.args.tool = C.optionalArg(s, Token.Item)
				break
			case 'loot':
				// loot
				// <lootTable: resourceLocation>
				t.args.lootTable = C.requiredArg(s, Token.ResourceLocation)
				break
			case 'kill':
				// kill
				// <sourceTarget: targetEntity>
				t.args.sourceTarget = C.requiredArg(s, Token.TargetEntity)
				break
			case 'mine':
				// mine
				// <sourcePos: coordinateTriplet>
				t.args.sourcePos = C.requiredArg(s, Token.CoordinateTriplet)
				// [<tool: item|(mainhand|offhand)>]
				t.args.tool = C.optionalArg(s, Token.Literal, [c.meta.tool], true)
				if (!t.args.tool) t.args.tool = C.optionalArg(s, Token.Item)
				break
		}
		return t
	}
)

/**
 * ```html
 * /particle <particle: resourceLocation> <particleArgs: ...> ...
 * - [<pos: coordinateTriplet>]
 * - <pos: coordinateTriplet> <delta: coordinateTriplet> <speed: double> <count: int> [<viewingMode: (force|normal)>] [<viewers: targetEntity>]
 * ```
 */
interface TokenParticleCommand extends TokenCommand {
	name: 'particle'
	args: {
		particle: TokenResourceLocation
		particleArgs: TokenAny[]
		pos?: TokenCoordinateTriplet
		delta?: TokenCoordinateTriplet
		speed?: TokenDouble
		count?: TokenInt
		viewingMode?: TokenLiteral & { value: 'force' | 'normal' }
		viewers?: TokenTargetEntity
	}
}
export const particleCommand = CR.newCommand<TokenParticleCommand>(
	'particle',
	{
		viewingMode: ['force', 'normal'],
	},
	(s, t, c) => {
		// <particle: resourceLocation>
		t.args.particle = C.requiredArg(s, Token.ResourceLocation)
		t.args.particleArgs = []
		switch (t.args.particle.id) {
			case 'dust':
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // R
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // G
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // B
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // size
				break
			case 'dust_color_transition':
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // startR
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // startG
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // startB
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // size
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // endR
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // endG
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // endB
				break
			case 'block':
			case 'falling_dust':
				t.args.particleArgs.push(C.requiredArg(s, Token.Block, [false])) // block
				break
			case 'item':
				t.args.particleArgs.push(C.requiredArg(s, Token.Item)) // item
				break
			case 'vibration':
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // startX
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // startY
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // startZ
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // endX
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // endY
				t.args.particleArgs.push(C.requiredArg(s, Token.Double)) // endZ
				t.args.particleArgs.push(C.requiredArg(s, Token.Int)) // duration
				break
		}
		// [<pos: coordinateTriplet>]
		t.args.pos = C.optionalArg(s, Token.CoordinateTriplet)
		// <delta: coordinateTriplet>
		t.args.delta = C.optionalArg(s, Token.CoordinateTriplet)
		if (t.args.pos && t.args.delta) {
			// <speed: double>
			t.args.speed = C.requiredArg(s, Token.Double)
			// <count: int>
			t.args.count = C.requiredArg(s, Token.Int)
			// [<viewingMode: (force|normal)>]
			t.args.viewingMode = C.optionalArg(s, Token.Literal, [c.meta.viewingMode])
			// [<viewers: targetEntity>]
			t.args.viewers = C.optionalArg(s, Token.TargetEntity)
		}
		return t
	}
)

/**
 * ```html
 * /
 * ```
 */
// interface Token_Command extends TokenCommand {
// 	name: '_'
// 	args: {}
// }
// export const _Command = CR.newCommand<Token_Command>('_', {}, (s,t,c) => {
// 	return t
// })
