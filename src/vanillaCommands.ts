import type * as P from './parser'

import {
	CommandRegister,
	Command as C,
	TokenCollectors as Token,
	GLOBALS as G,
	Consumers as Consume,
	throwSyntaxError,
	CHARS,
	SETTINGS,
} from './parser'

const CR = new CommandRegister('minecraft:vanilla')
export { CR as register }

/**
 * ```html
 * /advancement <action: (grant|revoke)> ...
 * - grant <target: entity> <operation: (everything|only|from|through|until)> ...
 *   - everything
 *   - only <advancement: resourceLocation> [<criterion: unquotedString>]
 *   - from ...
 *   - through ...
 *   - until ...
 *     - <advancement: resourceLocation>
 * - revoke <target: entity> <operation: (everything|only|from|through|until)> ...
 *   - everything
 *   - only <advancement: resourceLocation> [<criterion: unquotedString>]
 *   - from ...
 *   - through ...
 *   - until ...
 *     - <advancement: resourceLocation>
 * ```
 */
interface TokenAdvancementCommand extends P.TokenCommand {
	keyword: 'advancement'
	args: {
		action: P.TokenLiteral
		target: P.TokenEntity
		operation: P.TokenLiteral
		advancement?: P.TokenResourceLocation
		criterion?: P.TokenUnquotedString
	}
}
export const advancementCommand = CR.newCommand<TokenAdvancementCommand>(
	'minecraft:advancement',
	'advancement',
	{
		action: ['grant', 'revoke'],
		operation: ['everything', 'only', 'from', 'through', 'until'],
	},
	(s, t, c) => {
		// <action: (grant|revoke)>
		t.args.action = C.requiredArg(s, Token.Literal, [c.meta.action])
		// <target: entity>
		t.args.target = C.requiredArg(s, Token.Entity)
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
 * /attribute <target: entity> <attribute: resourceLocation> <action: (get|base|modifier)> ...
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
interface TokenAttributeCommand extends P.TokenCommand {
	id: 'minecraft:attribute'
	keyword: 'attribute'
	args: {
		target: P.TokenEntity
		attribute: P.TokenResourceLocation
		action: P.TokenLiteral & { value: 'get' | 'base' | 'modifier' }
		scale?: P.TokenDouble
		operation?: P.TokenLiteral & { value: 'get' | 'set' }
		value?: P.TokenDouble
		uuid?: P.TokenUuid
		name?: P.TokenString | P.TokenUnquotedString
		modifierMode?: P.TokenLiteral & { value: 'add' | 'remove' | 'value get' }
		modifierOperation?: P.TokenLiteral & { value: 'add' | 'multiply_base' | 'multiply' }
	}
}
export const attributeCommand = CR.newCommand<TokenAttributeCommand>(
	'minecraft:attribute',
	'attribute',
	{
		action: ['get', 'base', 'modifier'],
		operation: ['get', 'set'],
		modifierMode: ['add', 'remove', 'value get'],
		modifierOperation: ['add', 'multiply_base', 'multiply'],
	},
	(s, t, c) => {
		// <target: entity>
		t.args.target = C.requiredArg(s, Token.Entity)
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
 *   - players [<targets: entity>]
 *   - style <style: (notched_6|notched_10|notched_12|notched_20|progress)>
 *   - value <value: int>
 *   - visible <visible: boolean>
 * ```
 */
interface TokenBossbarCommand extends P.TokenCommand {
	id: 'minecraft:bossbar'
	keyword: 'bossbar'
	args: {
		mode: P.TokenLiteral & { value: 'add' | 'get' | 'list' | 'remove' | 'set' }
		id?: P.TokenResourceLocation
		name?: P.TokenJson
		query?: P.TokenLiteral & { value: 'max' | 'players' | 'value' | 'visible' }
		property?: P.TokenLiteral & {
			value: 'color' | 'max' | 'name' | 'players' | 'style' | 'value' | 'visible'
		}
		color?: P.TokenLiteral & {
			value: 'blue' | 'green' | 'pink' | 'purple' | 'red' | 'white' | 'yellow'
		}
		max?: P.TokenInt
		targets?: P.TokenEntity
		style?: P.TokenLiteral & {
			value: 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20' | 'progress'
		}
		value?: P.TokenInt
		visible?: P.TokenBoolean
	}
}
export const bossbarCommand = CR.newCommand<TokenBossbarCommand>(
	'minecraft:bossbar',
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
						// [<targets: entity>]
						t.args.targets = C.optionalArg(s, Token.Entity)
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
 * /clear [<targets: entity>] [<item: item>] [<maxCount: int>]
 * ```
 */
interface TokenClearCommand extends P.TokenCommand {
	id: 'minecraft:clear'
	keyword: 'clear'
	args: {
		targets?: P.TokenEntity
		item?: P.TokenItem
		maxCount?: P.TokenInt
	}
}
export const clearCommand = CR.newCommand<TokenClearCommand>(
	'minecraft:clear',
	'clear',
	{},
	(s, t, c) => {
		// [<targets: entity>]
		t.args.targets = C.optionalArg(s, Token.Entity)
		// [<item: item>]
		t.args.item = C.optionalArg(s, Token.Item)
		// [<maxCount: int>]
		t.args.maxCount = C.optionalArg(s, Token.Int)

		return t
	}
)

/**
 * ```html
 * /clone <from: posVec3> <to: posVec3> <destination: posVec3> [<maskMode: (replace|masked|filtered)>] ...
 * - replace ...
 * - masked ...
 * - filtered <filter: block> ...
 *   - [<cloneMode: (force|move|normal)>]
 * ```
 */
interface TokenCloneCommand extends P.TokenCommand {
	id: 'minecraft:clone'
	keyword: 'clone'
	args: {
		from: P.TokenPosVec3
		to: P.TokenPosVec3
		destination: P.TokenPosVec3
		maskMode?: P.TokenLiteral & { value: 'replace' | 'masked' | 'filtered' }
		filter?: P.TokenBlock
		cloneMode?: P.TokenLiteral & { value: 'force' | 'move' | 'normal' }
	}
}
export const cloneCommand = CR.newCommand<TokenCloneCommand>(
	'minecraft:clone',
	'clone',
	{
		maskMode: ['replace', 'masked', 'filtered'],
		cloneMode: ['force', 'move', 'normal'],
	},
	(s, t, c) => {
		// <from: posVec3>
		t.args.from = C.requiredArg(s, Token.PosVec3)
		// <to: posVec3>
		t.args.to = C.requiredArg(s, Token.PosVec3)
		// <destination: posVec3>
		t.args.destination = C.requiredArg(s, Token.PosVec3)
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
 *   - block <targetPos: posVec3> ...
 *   - entity <entity: entity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - [<targetPath: nbtPath>] [<scale: double>]
 * - merge <dataType: (block|entity|storage)> ...
 *   - block <targetPos: posVec3> ...
 *   - entity <entity: entity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - <nbt: nbtObject>
 * - modify <dataType: (block|entity|storage)> ...
 *   - block <targetPos: posVec3> ...
 *   - entity <entity: entity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - <targetPath: nbtPath> <modifyMode: (append|insert|merge|prepend|set)> ...
 *       - append <setMode: (from|value)> ...
 *       - insert <index: int> <setMode: (from|value)> ...
 *       - merge <setMode: (from|value)> ...
 *       - prepend <setMode: (from|value)> ...
 *       - set <setMode: (from|value)> ...
 *         - from <fromDataType: (block|entity|storage)>
 *           - block <sourcePos: posVec3> ...
 *           - entity <sourceEntity: entity> ...
 *           - storage <sourceStorage: resourceLocation> ...
 *             - [<sourcePath: nbtPath>]
 *         - value <value: nbtAny>
 * - remove <dataType: (block|entity|storage)> ...
 *   - block <targetPos: posVec3> ...
 *   - entity <entity: entity> ...
 *   - storage <targetStorage: resourceLocation> ...
 *     - <targetPath: nbtPath>
 * ```
 */
interface TokenDataCommand extends P.TokenCommand {
	id: 'minecraft:data'
	keyword: 'data'
	args: {
		mode: P.TokenLiteral & { value: 'get' | 'merge' | 'modify' | 'remove' }
		dataType: P.TokenLiteral & { value: 'block' | 'entity' | 'storage' }
		targetPos?: P.TokenPosVec3
		entity?: P.TokenEntity
		targetStorage?: P.TokenResourceLocation
		targetPath?: P.TokenNbtPath
		sourcePos?: P.TokenPosVec3
		sourceEntity?: P.TokenEntity
		sourceStorage?: P.TokenResourceLocation
		sourcePath?: P.TokenNbtPath
		scale?: P.TokenDouble
		nbt?: P.TokenNbtObject
		modifyMode?: P.TokenLiteral & {
			value: 'append' | 'insert' | 'merge' | 'prepend' | 'set'
		}
		setMode?: P.TokenLiteral & { value: 'value' | 'from' }
		index?: P.TokenInt
		fromDataType?: P.TokenLiteral & { value: 'block' | 'entity' | 'storage' }
		fromPath?: P.TokenNbtPath
		value?: P.TokenAnyNbt
	}
}
export const dataCommand = CR.newCommand<TokenDataCommand>(
	'minecraft:data',
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
						// block <targetPos: posVec3>
						t.args.targetPos = C.requiredArg(s, Token.PosVec3)
						break
					case 'entity':
						// entity <entity: entity>
						t.args.entity = C.requiredArg(s, Token.Entity)
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
						// block <targetPos: posVec3>
						t.args.targetPos = C.requiredArg(s, Token.PosVec3)
						break
					case 'entity':
						// entity <entity: entity>
						t.args.entity = C.requiredArg(s, Token.Entity)
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
						// block <targetPos: posVec3>
						t.args.targetPos = C.requiredArg(s, Token.PosVec3)
						break
					case 'entity':
						// entity <entity: entity>
						t.args.entity = C.requiredArg(s, Token.Entity)
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
							// block <sourcePos: posVec3> ...
							t.args.sourcePos = C.requiredArg(s, Token.PosVec3)
							break
						case 'entity':
							// entity <sourceEntity: entity> ...
							t.args.sourceEntity = C.requiredArg(s, Token.Entity)
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
						// block <targetPos: posVec3> ...
						t.args.targetPos = C.requiredArg(s, Token.PosVec3)
						break
					case 'entity':
						// entity <entity: entity> ...
						t.args.entity = C.requiredArg(s, Token.Entity)
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
interface TokenDatapackCommand extends P.TokenCommand {
	id: 'minecraft:datapack'
	keyword: 'datapack'
	args: {
		mode: P.TokenLiteral & { value: 'enable' | 'disable' | 'list' }
		name?: P.TokenString | P.TokenUnquotedString
		order?: P.TokenLiteral & { value: 'first' | 'last' | 'before' | 'after' }
		existing?: P.TokenString | P.TokenUnquotedString
		listMode?: P.TokenLiteral & { value: 'available' | 'enabled' }
	}
}
export const datapackCommand = CR.newCommand<TokenDatapackCommand>(
	'minecraft:datapack',
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
interface TokenDifficultyCommand extends P.TokenCommand {
	id: 'minecraft:difficulty'
	keyword: 'difficulty'
	args: {
		mode?: P.TokenLiteral & { value: 'easy' | 'hard' | 'normal' | 'peaceful' }
	}
}
export const difficultyCommand = CR.newCommand<TokenDifficultyCommand>(
	'minecraft:difficulty',
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
 * - clear [<targets: entity>] [<effect: resourceLocation>]
 * - give <targets: entity> <effect: resourceLocation> [<seconds: int>] [<amplifier: int>] [<hideParticles: boolean>]
 * ```
 */
interface TokenEffectCommand extends P.TokenCommand {
	id: 'minecraft:effect'
	keyword: 'effect'
	args: {
		mode: P.TokenLiteral & { value: 'clear' | 'give' }
		targets?: P.TokenEntity
		effect?: P.TokenResourceLocation
		seconds?: P.TokenInt
		amplifier?: P.TokenInt
		hideParticles?: P.TokenBoolean
	}
}
export const effectCommand = CR.newCommand<TokenEffectCommand>(
	'minecraft:effect',
	'effect',
	{
		mode: ['clear', 'give'],
	},
	(s, t, c) => {
		// <mode: (clear|give)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode.value === 'clear') {
			// clear
			// [<targets: entity>]
			t.args.targets = C.optionalArg(s, Token.Entity)
			// [<effect: resourceLocation>]
			t.args.effect = C.optionalArg(s, Token.ResourceLocation)
		} else {
			// give
			// <targets: entity>
			t.args.targets = C.requiredArg(s, Token.Entity)
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
 * /enchant <targets: entity> <enchantment: resourceLocation> [<level: int>]
 * ```
 */
interface TokenEnchantCommand extends P.TokenCommand {
	id: 'minecraft:enchant'
	keyword: 'enchant'
	args: {
		targets: P.TokenEntity
		enchantment: P.TokenResourceLocation
		level?: P.TokenInt
	}
}
export const enchantCommand = CR.newCommand<TokenEnchantCommand>(
	'minecraft:enchant',
	'enchant',
	{},
	(s, t, c) => {
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		// <enchantment: resourceLocation>
		t.args.enchantment = C.requiredArg(s, Token.ResourceLocation)
		// [<level: int>]
		t.args.level = C.optionalArg(s, Token.Int)
		return t
	}
)

interface ExecuteAlignSubCommand extends P.TokenCommand {
	keyword: 'align'
	args: {
		swizzle: P.TokenSwizzle
	}
}
interface ExecuteAnchoredSubCommand extends P.TokenCommand {
	keyword: 'anchored'
	args: {
		part: P.TokenLiteral & { value: 'eyes' | 'feet' }
	}
}
interface ExecuteAsSubCommand extends P.TokenCommand {
	keyword: 'as'
	args: {
		targets: P.TokenEntity
	}
}
interface ExecuteAtSubCommand extends P.TokenCommand {
	keyword: 'at'
	args: {
		targets: P.TokenEntity
	}
}
interface ExecuteFacingSubCommand extends P.TokenCommand {
	keyword: 'facing'
	args: {
		entity?: P.TokenLiteral & { value: 'entity' }
		targets?: P.TokenEntity
		anchor?: P.TokenLiteral & { value: 'eyes' | 'feet' }
		pos?: P.TokenPosVec3
	}
}
interface ExecuteInSubCommand extends P.TokenCommand {
	keyword: 'in'
	args: {
		dimension: P.TokenResourceLocation
	}
}
interface ExecutePositionedSubCommand extends P.TokenCommand {
	keyword: 'positioned'
	args: {
		as?: P.TokenLiteral & { value: 'as' }
		targets?: P.TokenEntity
		pos?: P.TokenPosVec3
	}
}
interface ExecuteRotatedSubCommand extends P.TokenCommand {
	keyword: 'rotated'
	args: {
		as?: P.TokenLiteral & { value: 'as' }
		targets?: P.TokenEntity
		rot?: P.TokenRotVec2
	}
}
interface ExecuteStoreSubCommand extends P.TokenCommand {
	keyword: 'store'
	args: {
		mode: P.TokenLiteral & { value: 'result' | 'success' }
		location: P.TokenLiteral & { value: 'block' | 'bossbar' | 'entity' | 'score' | 'storage' }
		pos?: P.TokenPosVec3
		path?: P.TokenNbtPath | (P.TokenLiteral & { value: 'max' | 'value' })
		type?: P.TokenLiteral & { value: 'byte' | 'short' | 'int' | 'long' | 'float' | 'double' }
		scale?: P.TokenDouble
		id?: P.TokenResourceLocation
		target?: P.TokenEntity
		targets?: P.TokenEntity
		objective?: P.TokenUnquotedString
		storage?: P.TokenResourceLocation
	}
}
interface ExecuteConditionalSubCommand extends P.TokenCommand {
	keyword: 'if' | 'unless'
	args: {
		check: P.TokenLiteral & {
			value: 'blocks' | 'block' | 'data' | 'entity' | 'predicate' | 'score'
		}
		pos?: P.TokenPosVec3
		block?: P.TokenBlock
		from?: P.TokenPosVec3
		to?: P.TokenPosVec3
		destination?: P.TokenPosVec3
		maskMode?: P.TokenLiteral & { value: 'all' | 'masked' }
		type?: P.TokenLiteral & { value: 'block' | 'entity' | 'storage' }
		path?: P.TokenNbtPath
		targets?: P.TokenEntity
		storage?: P.TokenResourceLocation
		predicate?: P.TokenResourceLocation
		target?: P.TokenEntity
		targetObjective?: P.TokenUnquotedString
		matches?: P.TokenLiteral & { value: 'matches' }
		operator?: P.TokenLiteral & { value: '<=' | '<' | '=' | '>=' | '>' }
		range?: P.TokenIntRange | P.TokenInt
		source?: P.TokenEntity
		sourceObjective?: P.TokenUnquotedString
	}
}
interface ExecuteRunSubCommand extends P.TokenCommand {
	keyword: 'run'
	args: {
		command: P.TokenCommand | P.TokenUnknownCommand
	}
}
function newSubCommand<T extends keyof ExecuteSubCommands>(
	target: T,
	args: ExecuteSubCommands[T]['args']
): ExecuteSubCommands[T] {
	// @ts-ignore
	return {
		type: 'command',
		keyword: target,
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
 * - as <targets: entity> <SUBCOMMAND>
 * - at <targets: entity> <SUBCOMMAND>
 * - facing ...
 *   - [<entity: (entity)>] <targets: entity> <anchor: (eyes|feet)> <SUBCOMMAND>
 *   - <pos: posVec3> <SUBCOMMAND>
 * - in <dimension: resourceLocation> <SUBCOMMAND>
 * - positioned ...
 *   - [<as: (as)>] <targets: entity> <SUBCOMMAND>
 *   - <pos: posVec3> <SUBCOMMAND>
 * - rotated ...
 *   - [<as: (as)>] <targets: entity> <SUBCOMMAND>
 *   - <rot: rotVec2> <SUBCOMMAND>
 * - store <mode: (resultSuccess)> <location: (block|bossbar|entity|score|storage)> ...
 *   - block <pos: posVec3> <path: nbtPath> <type: (byte|short|int|long|float|double)> <scale: double> <SUBCOMMAND>
 *   - bossbar <id: resourceLocation> <path: (max|value)> <SUBCOMMAND>
 *   - entity <target: entity> <path: nbtPath> <type: (byte|short|int|long|float|double)> <scale: double> <SUBCOMMAND>
 *   - score <targets: entity> <objective: unquotedString> <SUBCOMMAND>
 *   - storage <storage: resourceLocation> <path: nbtPath> <type: (byte|short|int|long|float|double)> <scale: double> <SUBCOMMAND>
 * - if ...
 * - unless ...
 *   - <check: (blocks|block|data|entity|predicate|score)> ...
 *     - block <pos: posVec3> <block: block> <SUBCOMMAND>
 *     - blocks <from: posVec3> <to: posVec3> <destination: posVec3> <maskMode: (all|masked)> <SUBCOMMAND>
 *     - data <type: (block|entity|storage)> ...
 *       - block <pos: posVec3> <path: nbtPath> <SUBCOMMAND>
 *       - entity <targets: entity> <path: nbtPath> <SUBCOMMAND>
 *       - storage <storage: resourceLocation> <path: nbtPath> <SUBCOMMAND>
 *     - entity <targets: entity> <SUBCOMMAND>
 *     - predicate <predicate: resourceLocation> <SUBCOMMAND>
 *     - score <target: entity> <targetObjective: unquotedString> ...
 *       - [<matches: (matches)>] <range: rangeableInt> <SUBCOMMAND>
 *       - <operator: (<=|<|=|>=|>)> <source: entity> <sourceObjective: unquotedString> <SUBCOMMAND>
 * - run <command: command>
 * ```
 */
interface TokenExecuteCommand extends P.TokenCommand {
	id: 'minecraft:execute'
	keyword: 'execute'
	args: {
		subCommands: AnyExecuteSubCommand[]
	}
}
export const executeCommand = CR.newCommand<TokenExecuteCommand>(
	'minecraft:execute',
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
	(s, t, c, context) => {
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
				rot,
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
					// <targets: entity>
					targets = C.requiredArg(s, Token.Entity)
					// return
					t.args.subCommands.push(newSubCommand('as', { targets }))
					break
				case 'at':
					// at
					// <targets: entity>
					targets = C.requiredArg(s, Token.Entity)
					// return
					t.args.subCommands.push(newSubCommand('as', { targets }))
					break
				case 'facing':
					// facing
					// [<entity: (entity)>]
					entity = C.optionalArg(s, Token.Literal, [c.meta.entity], true)
					if (entity) {
						// <targets: entity>
						targets = C.requiredArg(s, Token.Entity)
						// <anchor: (eyes|feet)>
						anchor = C.requiredArg(s, Token.Literal, [c.meta.anchorPart])
					} else {
						// <pos: posVec3>
						pos = C.requiredArg(s, Token.PosVec3)
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
						// <targets: entity>
						targets = C.requiredArg(s, Token.Entity)
					} else {
						// <pos: posVec3>
						pos = C.requiredArg(s, Token.PosVec3)
					}
					// return
					t.args.subCommands.push(newSubCommand('positioned', { as: _as, targets, pos }))
					break
				case 'rotated':
					// rotated
					// [<as: (as)>]
					_as = C.optionalArg(s, Token.Literal, [c.meta.as], true)
					if (_as) {
						// <targets: entity>
						targets = C.requiredArg(s, Token.Entity)
					} else {
						// <rot: rotVec2>
						rot = C.requiredArg(s, Token.RotVec2)
					}
					// return
					t.args.subCommands.push(newSubCommand('rotated', { as: _as, targets, rot }))
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
							// <pos: posVec3>
							pos = C.requiredArg(s, Token.PosVec3)
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
							// <target: entity>
							target = C.requiredArg(s, Token.Entity)
							// <path: nbtPath>
							path = C.requiredArg(s, Token.NBTPath)
							// <type: (byte|short|int|long|float|double)>
							_type = C.requiredArg(s, Token.Literal, [c.meta.dataType])
							// <scale: double>
							scale = C.requiredArg(s, Token.Double)
							break
						case 'score':
							// score
							// <targets: entity>
							targets = C.requiredArg(s, Token.Entity, [true])
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
							// <pos: posVec3>
							pos = C.requiredArg(s, Token.PosVec3)
							// <block: block>
							block = C.requiredArg(s, Token.Block)
							break
						case 'blocks':
							// blocks
							// <from: posVec3>
							from = C.requiredArg(s, Token.PosVec3)
							// <to: posVec3>
							to = C.requiredArg(s, Token.PosVec3)
							// <destination: posVec3>
							destination = C.requiredArg(s, Token.PosVec3)
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
									// <pos: posVec3>
									pos = C.requiredArg(s, Token.PosVec3)
									// <path: nbtPath>
									path = C.requiredArg(s, Token.NBTPath)
									break
								case 'entity':
									// entity
									// <targets: entity>
									targets = C.requiredArg(s, Token.Entity)
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
							// <targets: entity>
							targets = C.requiredArg(s, Token.Entity)
							break
						case 'predicate':
							// predicate
							// <predicate: resourceLocation>
							predicate = C.requiredArg(s, Token.ResourceLocation)
							break
						case 'score':
							// score
							// <target: entity>
							target = C.requiredArg(s, Token.Entity, [true])
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
								// <source: entity>
								source = C.requiredArg(s, Token.Entity, [true])
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
							path: path as P.TokenNbtPath,
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
						command = Token.Command(s, context)
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
						command = Token.Command(s, context)
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
 *   - <targets: entity> <amount: int> [<valueNode: (levels|points)>]
 * - query <targets: entity> [<valueNode: (levels|points)>]
 * ```
 */
interface TokenExperienceCommand extends P.TokenCommand {
	id: 'minecraft:experience' | 'minecraft:xp'
	keyword: 'experience' | 'xp'
	args: {
		mode: P.TokenLiteral & { value: 'add' | 'set' | 'query' }
		targets: P.TokenEntity
		amount: P.TokenInt
		valueMode?: P.TokenLiteral & { value: 'levels' | 'points' }
	}
}
export const experienceCommand = CR.newCommand<TokenExperienceCommand>(
	'minecraft:experience',
	'experience',
	{
		mode: ['add', 'set', 'query'],
		valueMode: ['levels', 'points'],
	},
	(s, t, c) => {
		// <mode: (add|set|query)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		if (t.args.mode.value !== 'query')
			// <amount: int>
			t.args.amount = C.requiredArg(s, Token.Int)
		// [<valueNode: (levels|points)>]
		t.args.valueMode = C.optionalArg(s, Token.Literal, [c.meta.valueMode])
		return t
	}
)
export const xp = CR.newCommand<TokenExperienceCommand>(
	'minecraft:xp',
	'xp',
	experienceCommand.meta,
	experienceCommand.tokenizer
)

/**
 * ```html
 * /fill <from: posVec3> <to: posVec3> <block: block> [<mode: (destroy|hollow|keep|outline|replace)>] ...
 * - destroy
 * - hollow
 * - keep
 * - outline
 * - replace [<filter: block>]
 * ```
 */
interface TokenFillCommand extends P.TokenCommand {
	id: 'minecraft:fill'
	keyword: 'fill'
	args: {
		from: P.TokenPosVec3
		to: P.TokenPosVec3
		block: P.TokenBlock
		mode?: P.TokenLiteral & { value: 'destroy' | 'hollow' | 'keep' | 'outline' | 'replace' }
		filter?: P.TokenBlock
	}
}
export const fillCommand = CR.newCommand<TokenFillCommand>(
	'minecraft:fill',
	'fill',
	{
		mode: ['destroy', 'hollow', 'keep', 'outline', 'replace'],
	},
	(s, t, c) => {
		// <from: posVec3>
		t.args.from = C.requiredArg(s, Token.PosVec3)
		// <to: posVec3>
		t.args.to = C.requiredArg(s, Token.PosVec3)
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
 * - add <from: PosVec2> [<to: PosVec2>]
 * - query [<pos: PosVec2>]
 * - remove ...
 *   - [<all: (all)>]
 *   - <from: PosVec2> [<to: PosVec2>]
 * ```
 */
interface TokenForceloadCommand extends P.TokenCommand {
	id: 'minecraft:forceload'
	keyword: 'forceload'
	args: {
		mode: P.TokenLiteral & { value: 'add' | 'remove' | 'query' }
		from: P.TokenPosVec2
		to?: P.TokenPosVec2
		all?: P.TokenLiteral & { value: 'all' }
		pos?: P.TokenPosVec2
	}
}
export const forceloadCommand = CR.newCommand<TokenForceloadCommand>(
	'minecraft:forceload',
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
				// <from: PosVec2>
				t.args.from = C.requiredArg(s, Token.PosVec2)
				// [<to: PosVec2>]
				t.args.to = C.optionalArg(s, Token.PosVec2)
				break
			case 'query':
				// query
				// [<pos: PosVec2>]
				t.args.pos = C.optionalArg(s, Token.PosVec2)
				break
			case 'remove':
				// remove
				// [<all: (all)>]
				t.args.all = C.optionalArg(s, Token.Literal, [c.meta.all], true)
				if (!t.args.all) {
					// <from: PosVec2>
					t.args.from = C.requiredArg(s, Token.PosVec2)
					// [<to: PosVec2>]
					t.args.to = C.optionalArg(s, Token.PosVec2)
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
interface TokenFunctionCommand extends P.TokenCommand {
	id: 'minecraft:function'
	keyword: 'function'
	args: {
		name: P.TokenResourceLocation
	}
}
export const functionCommand = CR.newCommand<TokenFunctionCommand>(
	'minecraft:function',
	'function',
	{},
	(s, t, c) => {
		// <name: resourceLocation>
		t.args.name = C.requiredArg(s, Token.ResourceLocation)
		return t
	}
)

/**
 * ```html
 * /gamemode <gamemode: (adventure|creative|spectator|survival)> [<targets: entity>]
 * ```
 */
interface TokenGamemodeCommand extends P.TokenCommand {
	id: 'minecraft:gamemode'
	keyword: 'gamemode'
	args: {
		gamemode: P.TokenLiteral & { value: 'adventure' | 'creative' | 'spectator' | 'survival' }
		targets?: P.TokenEntity
	}
}
export const gamemodeCommand = CR.newCommand<TokenGamemodeCommand>(
	'minecraft:gamemode',
	'gamemode',
	{
		gamemode: ['adventure', 'creative', 'spectator', 'survival'],
	},
	(s, t, c) => {
		// <gamemode: (adventure|creative|spectator|survival)>
		t.args.gamemode = C.requiredArg(s, Token.Literal, [c.meta.gamemode])
		// [<targets: entity>]
		t.args.targets = C.optionalArg(s, Token.Entity)
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
interface TokenGameruleCommand extends P.TokenCommand {
	id: 'minecraft:gamerule'
	keyword: 'gamerule'
	args: {
		gamerule: P.TokenUnquotedString
		value?: P.TokenInt | P.TokenBoolean
	}
}
export const gameruleCommand = CR.newCommand<TokenGameruleCommand>(
	'minecraft:gamerule',
	'gamerule',
	{},
	(s, t, c) => {
		// <gamerule: unquotedString>
		t.args.gamerule = C.requiredArg(s, Token.UnquotedString)
		// - [<value: boolean>]
		t.args.value = C.optionalArg(s, Token.Boolean, undefined, true)
		// - [<value: int>]
		t.args.value = C.optionalArg(s, Token.Int)
		return t
	}
)

/**
 * ```html
 * /give <targets: entity> <item: item> [<count: int>]
 * ```
 */
interface TokenGiveCommand extends P.TokenCommand {
	id: 'minecraft:give'
	keyword: 'give'
	args: {
		targets: P.TokenEntity
		item: P.TokenItem
		count?: P.TokenInt
	}
}
export const giveCommand = CR.newCommand<TokenGiveCommand>(
	'minecraft:give',
	'give',
	{},
	(s, t, c) => {
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		// <item: item>
		t.args.item = C.requiredArg(s, Token.Item)
		// [<count: int>]
		t.args.count = C.optionalArg(s, Token.Int)
		return t
	}
)

/**
 * ```html
 * /item <mode: (modify|replace)>
 * - modify <targetType: (block|entity)> ...
 *   - block <pos: posVec3> ...
 *   - entity <target: entity> ...
 *     - <slot: unquotedString> <modifier: resourceLocation>
 * - replace <targetType: (block|entity)> ...
 *   - block <pos: posVec3> ...
 *   - entity <target: entity> ...
 *     - <slot: unquotedString> <replaceMode: (with|from)> ...
 *       - with <item: item> [<count: int>]
 *       - from <sourceType: (block|entity)> ...
 *         - block <sourcePos: posVec3> ...
 *         - entity <sourceTarget: entity> ...
 *           - <sourceSlot: unquotedString> [<modifier: resourceLocation>]
 * ```
 */
interface TokenItemCommand extends P.TokenCommand {
	id: 'minecraft:item'
	keyword: 'item'
	args: {
		mode: P.TokenLiteral & { value: 'modify' | 'replace' }
		targetType: P.TokenLiteral & { value: 'block' | 'entity' }
		pos?: P.TokenPosVec3
		target?: P.TokenEntity
		slot?: P.TokenUnquotedString
		modifier?: P.TokenResourceLocation
		replaceMode?: P.TokenLiteral & { value: 'with' | 'from' }
		item?: P.TokenItem
		count?: P.TokenInt
		sourceType?: P.TokenLiteral & { value: 'block' | 'entity' }
		sourceTarget?: P.TokenEntity
		sourcePosition?: P.TokenPosVec3
		sourceSlot?: P.TokenUnquotedString
	}
}
export const itemCommand = CR.newCommand<TokenItemCommand>(
	'minecraft:item',
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
				// <pos: posVec3>
				t.args.pos = C.requiredArg(s, Token.PosVec3)
			} else {
				// entity
				// <target: entity>
				t.args.target = C.requiredArg(s, Token.Entity)
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
				// <pos: posVec3>
				t.args.pos = C.requiredArg(s, Token.PosVec3)
			} else {
				// entity
				// <target: entity>
				t.args.target = C.requiredArg(s, Token.Entity)
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
					// <sourcePos: posVec3>
					t.args.sourcePosition = C.requiredArg(s, Token.PosVec3)
				} else {
					// entity
					// <source: entity>
					t.args.sourceTarget = C.requiredArg(s, Token.Entity)
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
 * /kill [<targets: entity>]
 * ```
 */
interface TokenKillCommand extends P.TokenCommand {
	id: 'minecraft:kill'
	keyword: 'kill'
	args: {
		targets?: P.TokenEntity
	}
}
export const killCommand = CR.newCommand<TokenKillCommand>(
	'minecraft:kill',
	'kill',
	{},
	(s, t, c) => {
		// [<targets: entity>]
		t.args.targets = C.optionalArg(s, Token.Entity)
		return t
	}
)

/**
 * ```html
 * /list [<uuids: (uuids)>]
 * ```
 */
interface TokenListCommand extends P.TokenCommand {
	id: 'minecraft:list'
	keyword: 'list'
	args: {
		uuids?: P.TokenLiteral & { value: 'uuids' }
	}
}
export const listCommand = CR.newCommand<TokenListCommand>(
	'minecraft:list',
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
interface TokenLocateCommand extends P.TokenCommand {
	id: 'minecraft:locate'
	keyword: 'locate'
	args: {
		feature: P.TokenResourceLocation
	}
}
export const locateCommand = CR.newCommand<TokenLocateCommand>(
	'minecraft:locate',
	'locate',
	{},
	(s, t, c) => {
		// <feature: resourceLocation>
		t.args.feature = C.requiredArg(s, Token.ResourceLocation)
		return t
	}
)

/**
 * ```html
 * /locatebiome <biome: resourceLocation>
 * ```
 */
interface TokenLocatebiomeCommand extends P.TokenCommand {
	id: 'minecraft:locatebiome'
	keyword: 'locatebiome'
	args: {
		biome: P.TokenResourceLocation
	}
}
export const locatebiomeCommand = CR.newCommand<TokenLocatebiomeCommand>(
	'minecraft:locatebiome',
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
 * - give <targets: entity>
 * - insert <targetPos: posVec3>
 * - spawn <targetPos: posVec3>
 * - replace <replaceMode: (block|entity)> ...
 *   - entity <targets: entity> ...
 *   - block <targetPos: posVec3> ...
 *     - <slot: unquotedString> [<count: int>]
 * <SOURCE>: <sourceMode: (fish|loot|kill|mine)> ...
 * - fish <lootTable: resourceLocation> <sourcePos: posVec3> [<tool: item|(mainhand|offhand)>]
 * - loot <lootTable: resourceLocation>
 * - kill <sourceTarget: entity>
 * - mine <sourcePos: posVec3> [<tool: item|(mainhand|offhand)>]
 * ```
 */
interface TokenLootCommand extends P.TokenCommand {
	id: 'minecraft:loot'
	keyword: 'loot'
	args: {
		targetMode: P.TokenLiteral & { value: 'give' | 'insert' | 'replace' | 'spawn' }
		targets?: P.TokenEntity
		targetPos?: P.TokenPosVec3
		replaceMode?: P.TokenLiteral & { value: 'block' | 'entity' }
		slot?: P.TokenUnquotedString
		count?: P.TokenInt
		sourceMode?: P.TokenLiteral & { value: 'fish' | 'loot' | 'kill' | 'mine' }
		lootTable?: P.TokenResourceLocation
		sourcePos?: P.TokenPosVec3
		tool?: P.TokenItem | (P.TokenLiteral & { value: 'mainhand' | 'offhand' })
		sourceTarget?: P.TokenEntity
	}
}
export const lootCommand = CR.newCommand<TokenLootCommand>(
	'minecraft:loot',
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
				// <targets: entity>
				t.args.targets = C.requiredArg(s, Token.Entity)
				break
			case 'insert':
				// insert
				// <targetPos: posVec3>
				t.args.targetPos = C.requiredArg(s, Token.PosVec3)
				break
			case 'spawn':
				// spawn
				// <targetPos: posVec3>
				t.args.targetPos = C.requiredArg(s, Token.PosVec3)
				break
			case 'replace':
				// replace
				// <replaceMode: (block|entity)>
				t.args.replaceMode = C.requiredArg(s, Token.Literal, [c.meta.replaceMode])
				if (t.args.replaceMode.value === 'entity') {
					// entity
					// <targets: entity> ...
					t.args.targets = C.requiredArg(s, Token.Entity)
				} else {
					// block
					// <targetPos: posVec3> ...
					t.args.targetPos = C.requiredArg(s, Token.PosVec3)
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
				// <sourcePos: posVec3>
				t.args.sourcePos = C.requiredArg(s, Token.PosVec3)
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
				// <sourceTarget: entity>
				t.args.sourceTarget = C.requiredArg(s, Token.Entity)
				break
			case 'mine':
				// mine
				// <sourcePos: posVec3>
				t.args.sourcePos = C.requiredArg(s, Token.PosVec3)
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
 * - [<pos: posVec3>]
 * - <pos: posVec3> <delta: posVec3> <speed: double> <count: int> [<viewingMode: (force|normal)>] [<viewers: entity>]
 * ```
 */
interface TokenParticleCommand extends P.TokenCommand {
	id: 'minecraft:particle'
	keyword: 'particle'
	args: {
		particle: P.TokenResourceLocation
		particleArgs: P.Token[]
		pos?: P.TokenPosVec3
		delta?: P.TokenPosVec3
		speed?: P.TokenDouble
		count?: P.TokenInt
		viewingMode?: P.TokenLiteral & { value: 'force' | 'normal' }
		viewers?: P.TokenEntity
	}
}
export const particleCommand = CR.newCommand<TokenParticleCommand>(
	'minecraft:particle',
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
		// [<pos: posVec3>]
		t.args.pos = C.optionalArg(s, Token.PosVec3)
		// <delta: posVec3>
		t.args.delta = C.optionalArg(s, Token.PosVec3)
		if (t.args.pos && t.args.delta) {
			// <speed: double>
			t.args.speed = C.requiredArg(s, Token.Double)
			// <count: int>
			t.args.count = C.requiredArg(s, Token.Int)
			// [<viewingMode: (force|normal)>]
			t.args.viewingMode = C.optionalArg(s, Token.Literal, [c.meta.viewingMode])
			// [<viewers: entity>]
			t.args.viewers = C.optionalArg(s, Token.Entity)
		}
		return t
	}
)

/**
 * ```html
 * /placefeature <feature: resourceLocation> [<pos: posVec3>]
 * ```
 */
interface TokenPlacefeatureCommand extends P.TokenCommand {
	id: 'minecraft:placefeature'
	keyword: 'placefeature'
	args: {
		feature: P.TokenResourceLocation
		pos?: P.TokenPosVec3
	}
}
export const placefeatureCommand = CR.newCommand<TokenPlacefeatureCommand>(
	'minecraft:placefeature',
	'placefeature',
	{},
	(s, t, c) => {
		// <feature: resourceLocation>
		t.args.feature = C.requiredArg(s, Token.ResourceLocation)
		// [<pos: posVec3>]
		t.args.pos = C.optionalArg(s, Token.PosVec3)
		return t
	}
)

/**
 * ```html
 * /playsound <sound: resourceLocation> <SOURCE> <targets: entity> [<pos: posVec3>] [<volume: double>] [<pitch: double>] [<minVolume: double>]
 * <SOURCE>: <source: (master|music|record|weather|block|hostile|neutral|player|ambient|voice)>
 * ```
 */
interface TokenPlaysoundCommand extends P.TokenCommand {
	id: 'minecraft:playsound'
	keyword: 'playsound'
	args: {
		sound: P.TokenResourceLocation
		source: P.TokenLiteral & {
			value:
				| 'master'
				| 'music'
				| 'record'
				| 'weather'
				| 'block'
				| 'hostile'
				| 'neutral'
				| 'player'
				| 'ambient'
				| 'voice'
		}
		targets: P.TokenEntity
		pos?: P.TokenPosVec3
		volume?: P.TokenDouble
		pitch?: P.TokenDouble
		minVolume?: P.TokenDouble
	}
}
export const playsoundCommand = CR.newCommand<TokenPlaysoundCommand>(
	'minecraft:playsound',
	'playsound',
	{
		source: [
			'master',
			'music',
			'record',
			'weather',
			'block',
			'hostile',
			'neutral',
			'player',
			'ambient',
			'voice',
		],
	},
	(s, t, c) => {
		// <sound: resourceLocation>
		t.args.sound = C.requiredArg(s, Token.ResourceLocation)
		// <source: (master|music|record|weather|block|hostile|neutral|player|ambient|voice)>
		t.args.source = C.requiredArg(s, Token.Literal, [c.meta.source])
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		// [<pos: posVec3>]
		t.args.pos = C.optionalArg(s, Token.PosVec3)
		// [<volume: double>]
		t.args.volume = C.optionalArg(s, Token.Double)
		// [<pitch: double>]
		t.args.pitch = C.optionalArg(s, Token.Double)
		// [<minVolume: double>]
		t.args.minVolume = C.optionalArg(s, Token.Double)
		return t
	}
)

/**
 * ```html
 * /recipe <mode: (give|take)> <targets: entity> <recipe: (*)|resourceLocation>
 * ```
 */
interface TokenRecipeCommand extends P.TokenCommand {
	id: 'minecraft:recipe'
	keyword: 'recipe'
	args: {
		mode: P.TokenLiteral & { value: 'give' | 'take' }
		targets: P.TokenEntity
		recipe?: P.TokenResourceLocation | (P.TokenLiteral & { value: '*' })
	}
}
export const recipeCommand = CR.newCommand<TokenRecipeCommand>(
	'minecraft:recipe',
	'recipe',
	{
		mode: ['give', 'take'],
		recipe: ['*'],
	},
	(s, t, c) => {
		// <mode: (give|take)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		// <recipe: (*)|resourceLocation>
		t.args.recipe = C.optionalArg(s, Token.Literal, [c.meta.recipe], true)
		if (!t.args.recipe) t.args.recipe = C.requiredArg(s, Token.ResourceLocation)
		return t
	}
)

/**
 * ```html
 * /say <message: unquotedString>
 * ```
 */
interface TokenSayCommand extends P.TokenCommand {
	id: 'minecraft:say'
	keyword: 'say'
	args: {
		message?: P.TokenUnquotedString
	}
}
export const sayCommand = CR.newCommand<TokenSayCommand>('minecraft:say', 'say', {}, (s, t, c) => {
	// <message: unquotedString>
	t.args.message = C.optionalArg(s, Token.UnquotedString, [CHARS.NEWLINES, true])
	return t
})

/**
 * ```html
 * /schedule <mode: (function|clear)> ...
 * - function <function: resourceLocation> <time: int[t|s|d]> [<pushMode: (append|replace)>]
 * - clear <function: resourceLocation>
 * ```
 */
interface TokenScheduleCommand extends P.TokenCommand {
	id: 'minecraft:shedule'
	keyword: 'schedule'
	args: {
		mode: P.TokenLiteral & { value: 'function' | 'clear' }
		function: P.TokenResourceLocation
		time?: P.TokenInt & { indicator?: 't' | 's' | 'd' }
		pushMode?: P.TokenLiteral & { value: 'append' | 'replace' }
	}
}
export const scheduleCommand = CR.newCommand<TokenScheduleCommand>(
	'minecraft:shedule',
	'schedule',
	{
		mode: ['function', 'clear'],
		pushMode: ['append', 'replace'],
		timeIndicators: ['t', 's', 'd'],
	},
	(s, t, c) => {
		// <mode: (function|clear)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode.value === 'function') {
			// function
			// <function: resourceLocation>
			t.args.function = C.requiredArg(s, Token.ResourceLocation)
			// <time: int[t|s|d]>
			t.args.time = C.requiredArg(s, Token.Int, [c.meta.timeIndicators])
			// [<pushMode: (append|replace)>]
			t.args.pushMode = C.optionalArg(s, Token.Literal, [c.meta.pushMode])
		} else {
			// clear
			// <function: resourceLocation>
			t.args.function = C.requiredArg(s, Token.ResourceLocation)
		}
		return t
	}
)

/**
 * ```html
 * /scoreboard <mode: (objectives|players)> ...
 * - objectives <objectivesMode: (add|list|modify|remove|setdisplay)> ...
 *   - add <objective: unquotedString> <objectiveCriteria: resourceLocation> [<displayName: json>]
 *   - list
 *   - modify <objective: unquotedString> <property: (displayname|rendertype)> ...
 *     - displayname <displayName: json>
 *     - rendertype <renderType: (hearts|integer)>
 *   - remove <objective: unquotedString>
 *   - setdisplay <slot: resourceLocation> [<objective: unquotedString>]
 * - players <playersMode: (add|enable|get|list|operation|remove|reset|set)> ...
 *   - add <targets: entity> <objective: unquotedString> <score: int>
 *   - enable <targets: entity> <objective: unquotedString>
 *   - get <targets: entity> <objective: unquotedString>
 *   - list [<targets: entity>]
 *   - operation <targets: entity> <targetObjective: unquotedString> <operator: (=|-=|+=|*=|/=|%=|<|>|><)> <source: entity> <sourceObjective: unquotedString>
 *   - remove <targets: entity> <objective: unquotedString> <score: int>
 *   - reset <resetTargets: (*)|entity> [<objective: unquotedString>]
 *   - set <targets: entity> <objective: unquotedString> <score: int>
 * ```
 */
interface TokenScoreboardCommand extends P.TokenCommand {
	id: 'minecraft:scoreboard'
	keyword: 'scoreboard'
	args: {
		mode: P.TokenLiteral & { value: 'objectives' | 'players' }
		objectivesMode?: P.TokenLiteral & {
			value: 'add' | 'list' | 'modify' | 'remove' | 'setdisplay'
		}
		objective?: P.TokenUnquotedString
		objectiveCriteria?: P.TokenResourceLocation
		displayName?: P.TokenJson
		property?: P.TokenLiteral & { value: 'displayname' | 'rendertype' }
		renderType?: P.TokenLiteral & { value: 'hearts' | 'integer' }
		slot?: P.TokenResourceLocation
		playersMode?: P.TokenLiteral & {
			value: 'add' | 'enable' | 'get' | 'list' | 'operation' | 'remove' | 'reset' | 'set'
		}
		targets?: P.TokenEntity
		score?: P.TokenInt
		targetObjective?: P.TokenUnquotedString
		operator?: P.TokenLiteral & {
			value: '=' | '-=' | '+=' | '*=' | '/=' | '%=' | '><' | '<' | '>'
		}
		source?: P.TokenEntity
		sourceObjective?: P.TokenUnquotedString
		resetTargets?: P.TokenEntity | (P.TokenLiteral & { value: '*' })
	}
}
export const scoreboardCommand = CR.newCommand<TokenScoreboardCommand>(
	'minecraft:scoreboard',
	'scoreboard',
	{
		mode: ['objectives', 'players'],
		objectivesMode: ['add', 'list', 'modify', 'remove', 'setdisplay'],
		property: ['displayname', 'rendertype'],
		renderType: ['hearts', 'integer'],
		playersMode: ['add', 'set', 'enable', 'get', 'list', 'operation', 'remove', 'reset'],
		operator: ['=', '-=', '+=', '*=', '/=', '%=', '><', '<', '>'],
		resetTargets: ['*'],
	},
	(s, t, c) => {
		// <mode: (objectives|players)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode.value === 'objectives') {
			// objectives
			// <objectivesMode: (add|list|modify|remove|setdisplay)> ...
			t.args.objectivesMode = C.requiredArg(s, Token.Literal, [c.meta.objectivesMode])
			switch (t.args.objectivesMode.value) {
				case 'add':
					// add
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					// <objectiveCriteria: resourceLocation>
					t.args.objectiveCriteria = C.requiredArg(s, Token.ResourceLocation)
					// [<displayName: json>]
					t.args.displayName = C.optionalArg(s, Token.Json)
					break
				case 'list':
					// list
					break
				case 'modify':
					// modify
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					// <property: (displayname|rendertype)> ...
					t.args.property = C.requiredArg(s, Token.Literal, [c.meta.property])
					if (t.args.property.value === 'displayname') {
						// displayname
						// <displayName: json>
						t.args.displayName = C.requiredArg(s, Token.Json)
					} else {
						// rendertype
						// <renderType: (hearts|integer)>
						t.args.renderType = C.requiredArg(s, Token.Literal, [c.meta.renderType])
					}
					break
				case 'remove':
					// remove
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					break
				case 'setdisplay':
					// setdisplay
					// <slot: resourceLocation>
					t.args.slot = C.requiredArg(s, Token.ResourceLocation)
					// [<objective: unquotedString>]
					t.args.objective = C.optionalArg(s, Token.UnquotedString)
					break
			}
		} else {
			// <playersMode: (add|enable|get|list|operation|remove|reset|set)> ...
			t.args.playersMode = C.requiredArg(s, Token.Literal, [c.meta.playersMode])
			switch (t.args.playersMode.value) {
				case 'add':
					// add
					// <targets: entity>
					t.args.targets = C.requiredArg(s, Token.Entity, [true])
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					// <score: int>
					t.args.score = C.requiredArg(s, Token.Int)
					break
				case 'enable':
					// enable
					// <targets: entity>
					t.args.targets = C.requiredArg(s, Token.Entity, [true])
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					break
				case 'get':
					// get
					// <targets: entity>
					t.args.targets = C.requiredArg(s, Token.Entity, [true])
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					break
				case 'list':
					// list
					// [<targets: entity>]
					t.args.targets = C.optionalArg(s, Token.Entity, [true])
					break
				case 'operation':
					// operation
					// <targets: entity>
					t.args.targets = C.requiredArg(s, Token.Entity, [true])
					// <targetObjective: unquotedString>
					t.args.targetObjective = C.requiredArg(s, Token.UnquotedString)
					// <operator: (=|-=|+=|*=|/=|%=|<|>|><)>
					t.args.operator = C.requiredArg(s, Token.Literal, [c.meta.operator])
					// <source: entity>
					t.args.source = C.requiredArg(s, Token.Entity, [true])
					// <sourceObjective: unquotedString>
					t.args.sourceObjective = C.requiredArg(s, Token.UnquotedString)
					break
				case 'remove':
					// remove
					// <targets: entity>
					t.args.targets = C.requiredArg(s, Token.Entity, [true])
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					// <score: int>
					t.args.score = C.requiredArg(s, Token.Int)
					break
				case 'reset':
					// reset
					// <resetTargets: (*)|entity>
					t.args.resetTargets = C.optionalArg(
						s,
						Token.Literal,
						[c.meta.resetTargets],
						true
					)
					if (!t.args.resetTargets) t.args.resetTargets = C.requiredArg(s, Token.Entity)
					// [<objective: unquotedString>]
					t.args.objective = C.optionalArg(s, Token.UnquotedString)
					break
				case 'set':
					// set
					// <targets: entity>
					t.args.targets = C.requiredArg(s, Token.Entity)
					// <objective: unquotedString>
					t.args.objective = C.requiredArg(s, Token.UnquotedString)
					// <score: int>
					t.args.score = C.requiredArg(s, Token.Int)
					break
			}
		}
		return t
	}
)

/**
 * ```html
 * /setblock <pos: posVec3> <block: block> [<mode: (destroy|keep|replace)>]
 * ```
 */
interface TokenSetblockCommand extends P.TokenCommand {
	id: 'minecraft:setblock'
	keyword: 'setblock'
	args: {
		pos: P.TokenPosVec3
		block: P.TokenBlock
		mode?: P.TokenLiteral & { value: 'destroy' | 'keep' | 'replace' }
	}
}
export const setblockCommand = CR.newCommand<TokenSetblockCommand>(
	'minecraft:setblock',
	'setblock',
	{
		mode: ['destroy', 'keep', 'replace'],
	},
	(s, t, c) => {
		// <pos: posVec3>
		t.args.pos = C.requiredArg(s, Token.PosVec3)
		// <block: block>
		t.args.block = C.requiredArg(s, Token.Block)
		// [<mode: (destroy|keep|replace)>]
		t.args.mode = C.optionalArg(s, Token.Literal, [c.meta.mode])
		return t
	}
)

/**
 * ```html
 * /setworldspawn [<pos: posVec3>] [<angle: rotVec2>]
 * ```
 */
interface TokenSetworldspawnCommand extends P.TokenCommand {
	id: 'minecraft:setworldspawn'
	keyword: 'setworldspawn'
	args: {
		pos?: P.TokenPosVec3
		angle?: P.TokenRotVec2
	}
}
export const setworldspawnCommand = CR.newCommand<TokenSetworldspawnCommand>(
	'minecraft:setworldspawn',
	'setworldspawn',
	{},
	(s, t, c) => {
		// [<pos: posVec3>]
		t.args.pos = C.optionalArg(s, Token.PosVec3)
		// [<angle: rotVec2>]
		t.args.angle = C.optionalArg(s, Token.RotVec2)
		return t
	}
)

/**
 * ```html
 * /spawnpoint [<targets: entity>] [<pos: posVec3>] [<angle: rotVec2>]
 * ```
 */
interface TokenSpawnpointCommand extends P.TokenCommand {
	id: 'minecraft:spawnpoint'
	keyword: 'spawnpoint'
	args: {
		targets?: P.TokenEntity
		pos?: P.TokenPosVec3
		angle?: P.TokenRotVec2
	}
}
export const spawnpointCommand = CR.newCommand<TokenSpawnpointCommand>(
	'minecraft:spawnpoint',
	'spawnpoint',
	{},
	(s, t, c) => {
		// [<targets: entity>]
		t.args.targets = C.optionalArg(s, Token.Entity)
		// [<pos: posVec3>]
		t.args.pos = C.optionalArg(s, Token.PosVec3)
		// [<angle: rotVec2>]
		t.args.angle = C.optionalArg(s, Token.RotVec2)
		return t
	}
)

/**
 * ```html
 * /spectate [<target: entity>] [<player: entity>]
 * ```
 */
interface TokenSpectateCommand extends P.TokenCommand {
	id: 'minecraft:spectate'
	keyword: 'spectate'
	args: {
		target?: P.TokenEntity
		player?: P.TokenEntity
	}
}
export const spectateCommand = CR.newCommand<TokenSpectateCommand>(
	'minecraft:spectate',
	'spectate',
	{},
	(s, t, c) => {
		// [<target: entity>]
		t.args.target = C.optionalArg(s, Token.Entity)
		// [<player: entity>]
		t.args.player = C.optionalArg(s, Token.Entity)
		return t
	}
)

/**
 * ```html
 * /spreadplayers <center: posVec2> <spreadDistance: double> <maxRange: double> ...
 * - <under: (under)> <maxHeight: int> ...
 * - <respectTeams: boolean> <targets: entity>
 * ```
 */
interface TokenSpreadplayersCommand extends P.TokenCommand {
	id: 'minecraft:spreadplayers'
	keyword: 'spreadplayers'
	args: {
		center: P.TokenPosVec2
		spreadDistance: P.TokenDouble
		maxRange: P.TokenDouble
		under?: P.TokenLiteral & { value: 'under' }
		maxHeight?: P.TokenInt
		respectTeams: P.TokenBoolean
		targets: P.TokenEntity
	}
}
export const spreadplayersCommand = CR.newCommand<TokenSpreadplayersCommand>(
	'minecraft:spreadplayers',
	'spreadplayers',
	{
		under: ['under'],
	},
	(s, t, c) => {
		// <center: posVec2>
		t.args.center = C.requiredArg(s, Token.PosVec2)
		// <spreadDistance: double>
		t.args.spreadDistance = C.requiredArg(s, Token.Double)
		// <maxRange: double>
		t.args.maxRange = C.requiredArg(s, Token.Double)
		// <under: (under)>
		t.args.under = C.optionalArg(s, Token.Literal, [c.meta.under], true)
		if (t.args.under) {
			// <maxHeight: int>
			t.args.maxHeight = C.requiredArg(s, Token.Int)
		}
		// <respectTeams: boolean>
		t.args.respectTeams = C.requiredArg(s, Token.Boolean)
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		return t
	}
)

/**
 * ```html
 * /stopsound <targets: entity> [<SOURCE>] [<sound: resourceLocation>]
 * <SOURCE>: <source: (master|music|record|weather|block|hostile|neutral|player|ambient|voice)>
 * ```
 */
interface TokenStopsoundCommand extends P.TokenCommand {
	id: 'minecraft:stopsound'
	keyword: 'stopsound'
	args: {
		targets: P.TokenEntity
		source?: P.TokenLiteral & {
			value:
				| 'master'
				| 'music'
				| 'record'
				| 'weather'
				| 'block'
				| 'hostile'
				| 'neutral'
				| 'player'
				| 'ambient'
				| 'voice'
				| '*'
		}
		sound?: P.TokenResourceLocation
	}
}
export const stopsoundCommand = CR.newCommand<TokenStopsoundCommand>(
	'minecraft:stopsound',
	'stopsound',
	{
		source: [
			'master',
			'music',
			'record',
			'weather',
			'block',
			'hostile',
			'neutral',
			'player',
			'ambient',
			'voice',
			'*',
		],
	},
	(s, t, c) => {
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		// [<source: (master|music|record|weather|block|hostile|neutral|player|ambient|voice)>]
		t.args.source = C.optionalArg(s, Token.Literal, [c.meta.source])
		// [<sound: resourceLocation>]
		t.args.sound = C.optionalArg(s, Token.ResourceLocation)
		return t
	}
)

/**
 * ```html
 * /summon <entity: resourceLocation> [<pos: posVec3>] [<nbt: nbtObject>]
 * ```
 */
interface TokenSummonCommand extends P.TokenCommand {
	id: 'minecraft:summon'
	keyword: 'summon'
	args: {
		entity: P.TokenResourceLocation
		pos?: P.TokenPosVec3
		nbt?: P.TokenNbtObject
	}
}
export const summonCommand = CR.newCommand<TokenSummonCommand>(
	'minecraft:summon',
	'summon',
	{},
	(s, t, c) => {
		// <entity: resourceLocation>
		t.args.entity = C.requiredArg(s, Token.ResourceLocation)
		// [<pos: posVec3>]
		t.args.pos = C.optionalArg(s, Token.PosVec3)
		// [<nbt: nbtObject>]
		t.args.nbt = C.optionalArg(s, Token.NBTObject)
		return t
	}
)

/**
 * ```html
 * /tag <targets: entity> <mode: (add|list|remove)> ...
 * - add <name: unquotedString>
 * - remove <name: unquotedString>
 * - list
 * ```
 */
interface TokenTagCommand extends P.TokenCommand {
	id: 'minecraft:tag'
	keyword: 'tag'
	args: {
		targets: P.TokenEntity
		mode: P.TokenLiteral & { value: 'add' | 'list' | 'remove' }
		name?: P.TokenUnquotedString
	}
}
export const tagCommand = CR.newCommand<TokenTagCommand>(
	'minecraft:tag',
	'tag',
	{
		mode: ['add', 'list', 'remove'],
	},
	(s, t, c) => {
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		// <mode: (add|list|remove)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode.value !== 'list') {
			// add
			// remove
			// <name: unquotedString>
			t.args.name = C.requiredArg(s, Token.UnquotedString, [CHARS.ENTITY_TAG])
		}
		// list
		return t
	}
)

/**
 * ```html
 * /team <mode: (add|empty|join|leave|list|modify|remove)> ...
 * - add <team: unquotedString> [<displayName: json>]
 * - empty <team: unquotedString>
 * - join <team: unquotedString> [<members: entity>]
 * - leave <members: entity>
 * - list [<team: unquotedString>]
 * - modify <team: unquotedString> <property: (collisionRule|color|deathMessageVisibility|displayName|friendlyFire|nametagVisibility|prefix|seeFriendlyInvisibles|suffix)> ...
 *   - collisionRule <collisionRule: (always|never|pushOtherTeams|pushOwnTeam)>
 *   - color <color: (aqua|black|blue|dark_aqua|dark_blue|dark_gray|dark_green|dark_purple|dark_red|gold|gray|green|light_purple|red|white|yellow)>
 *   - deathMessageVisibility <deathMessageVisibility: (always|never|hideForOtherTeams|hideForOwnTeam)>
 *   - displayName <displayName: json>
 *   - friendlyFire <allowed: boolean>
 *   - nametagVisibility <nametagVisibility: (always|never|hideForOtherTeams|hideForOwnTeam)>
 *   - prefix <prefix: json>
 *   - seeFriendlyInvisibles <allowed: boolean>
 *   - suffix <suffix: boolean>
 * - remove <team: unquotedString>
 * ```
 */
interface TokenTeamCommand extends P.TokenCommand {
	id: 'minecraft:team'
	keyword: 'team'
	args: {
		mode: P.TokenLiteral & {
			value: 'add' | 'empty' | 'join' | 'leave' | 'list' | 'modify' | 'remove'
		}
		team?: P.TokenUnquotedString
		displayName?: P.TokenJson
		members?: P.TokenEntity
		property?: P.TokenLiteral & {
			value:
				| 'collisionRule'
				| 'color'
				| 'deathMessageVisibility'
				| 'displayName'
				| 'friendlyFire'
				| 'nametagVisibility'
				| 'prefix'
				| 'seeFriendlyInvisibles'
				| 'suffix'
		}
		collisionRule?: P.TokenLiteral & {
			value: 'always' | 'never' | 'pushOtherTeams' | 'pushOwnTeam'
		}
		color: P.TokenLiteral & {
			value:
				| 'aqua'
				| 'black'
				| 'blue'
				| 'dark_aqua'
				| 'dark_blue'
				| 'dark_gray'
				| 'dark_green'
				| 'dark_purple'
				| 'dark_red'
				| 'gold'
				| 'gray'
				| 'green'
				| 'light_purple'
				| 'red'
				| 'white'
				| 'yellow'
		}
		deathMessageVisibility?: P.TokenLiteral & {
			value: 'always' | 'never' | 'hideForOtherTeams' | 'hideForOwnTeam'
		}
		allowed?: P.TokenBoolean
		nametagVisibility?: P.TokenLiteral & {
			value: 'always' | 'never' | 'hideForOtherTeams' | 'hideForOwnTeam'
		}
		prefix?: P.TokenJson
		suffix?: P.TokenJson
	}
}
export const teamCommand = CR.newCommand<TokenTeamCommand>(
	'minecraft:team',
	'team',
	{
		mode: ['add', 'empty', 'join', 'leave', 'list', 'modify', 'remove'],
		property: [
			'collisionRule',
			'color',
			'deathMessageVisibility',
			'displayName',
			'friendlyFire',
			'nametagVisibility',
			'prefix',
			'seeFriendlyInvisibles',
			'suffix',
		],
		collisionRule: ['always', 'never', 'pushOtherTeams', 'pushOwnTeam'],
		color: [
			'aqua',
			'black',
			'blue',
			'dark_aqua',
			'dark_blue',
			'dark_gray',
			'dark_green',
			'dark_purple',
			'dark_red',
			'gold',
			'gray',
			'green',
			'light_purple',
			'red',
			'white',
			'yellow',
		],
		deathMessageVisibility: ['always', 'never', 'hideForOtherTeams', 'hideForOwnTeam'],
		nametagVisibility: ['always', 'never', 'hideForOtherTeams', 'hideForOwnTeam'],
	},
	(s, t, c) => {
		// <mode: (add|empty|join|leave|list|modify|remove)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		switch (t.args.mode.value) {
			case 'add':
				// add
				// <team: unquotedString>
				t.args.team = C.requiredArg(s, Token.UnquotedString)
				// [<displayName: json>]
				t.args.displayName = C.optionalArg(s, Token.Json)
				break
			case 'empty':
				// empty
				// <team: unquotedString>
				t.args.team = C.requiredArg(s, Token.UnquotedString)
				break
			case 'join':
				// join
				// <team: unquotedString>
				t.args.team = C.requiredArg(s, Token.UnquotedString)
				// [<members: entity>]
				t.args.members = C.optionalArg(s, Token.Entity)
				break
			case 'leave':
				// leave
				// <members: entity>
				t.args.members = C.requiredArg(s, Token.Entity)
				break
			case 'list':
				// list
				// [<team: unquotedString>]
				t.args.team = C.optionalArg(s, Token.UnquotedString)
				break
			case 'modify':
				// modify
				// <team: unquotedString>
				t.args.team = C.requiredArg(s, Token.UnquotedString)
				// <property: (collisionRule|color|deathMessageVisibility|displayName|friendlyFire|nametagVisibility|prefix|seeFriendlyInvisibles|suffix)>
				t.args.property = C.requiredArg(s, Token.Literal, [c.meta.property])
				switch (t.args.property.value) {
					case 'collisionRule':
						// collisionRule
						// <collisionRule: (always|never|pushOtherTeams|pushOwnTeam)>
						t.args.collisionRule = C.requiredArg(s, Token.Literal, [
							c.meta.collisionRule,
						])
						break
					case 'color':
						// color
						// <color: (aqua|black|blue|dark_aqua|dark_blue|dark_gray|dark_green|dark_purple|dark_red|gold|gray|green|light_purple|red|white|yellow)>
						t.args.color = C.requiredArg(s, Token.Literal, [c.meta.color])
						break
					case 'deathMessageVisibility':
						// deathMessageVisibility
						// <deathMessageVisibility: (always|never|hideForOtherTeams|hideForOwnTeam)>
						t.args.deathMessageVisibility = C.requiredArg(s, Token.Literal, [
							c.meta.deathMessageVisibility,
						])
						break
					case 'displayName':
						// displayName
						// <displayName: json>
						t.args.displayName = C.requiredArg(s, Token.Json)
						break
					case 'friendlyFire':
						// friendlyFire
						// <allowed: boolean>
						t.args.allowed = C.requiredArg(s, Token.Boolean)
						break
					case 'nametagVisibility':
						// nametagVisibility
						// <nametagVisibility: (always|never|hideForOtherTeams|hideForOwnTeam)>
						t.args.nametagVisibility = C.requiredArg(s, Token.Literal, [
							c.meta.nametagVisibility,
						])
						break
					case 'prefix':
						// prefix
						// <prefix: json>
						t.args.prefix = C.requiredArg(s, Token.Json)
						break
					case 'seeFriendlyInvisibles':
						// seeFriendlyInvisibles
						// <allowed: boolean>
						t.args.allowed = C.requiredArg(s, Token.Boolean)
						break
					case 'suffix':
						// suffix
						// <suffix: boolean>
						t.args.suffix = C.requiredArg(s, Token.Json)
						break
				}
				break
			case 'remove':
				// remove
				// <team: unquotedString>
				t.args.team = C.requiredArg(s, Token.UnquotedString)
				break
		}
		return t
	}
)

/**
 * ```html
 * /(teleport|tp) ...
 * - <destination: entity>
 * - <location: posVec3>
 * - <targets: entity> ...
 *   - <destination: entity>
 *   - <location: posVec3> ...
 *     - [<facing: (facing)>] ...
 *       - [<entity: (entity)>] <facingEntity: entity> [<facingAnchor: (eyes|feet)>]
 *       - <facingLocation: posVec3>
 *     - <rotation: rotVec2>
 * ```
 */
interface TokenTeleportCommand extends P.TokenCommand {
	id: 'minecraft:teleport' | 'minecraft:tp'
	keyword: 'teleport' | 'tp'
	args: {
		destination?: P.TokenEntity
		location?: P.TokenPosVec3
		targets?: P.TokenEntity
		facing?: P.TokenLiteral & { value: 'facing' }
		entity?: P.TokenLiteral & { value: 'entity' }
		facingEntity?: P.TokenEntity
		facingAnchor?: P.TokenLiteral & { value: 'eyes' | 'feet' }
		facingLocation?: P.TokenPosVec3
		rotation?: P.TokenRotVec2
	}
}
export const teleportCommand = CR.newCommand<TokenTeleportCommand>(
	'minecraft:teleport',
	'teleport',
	{
		facing: ['facing'],
		entity: ['entity'],
		facingAnchor: ['eyes', 'feet'],
	},
	(s, t, c) => {
		const [arg1, error1] = C.choiceArg(s, [[Token.PosVec3], [Token.Entity]])
		if (arg1?.type === 'posVec3') {
			// <location: posVec3>
			t.args.location = arg1 as P.TokenPosVec3
		} else if (arg1?.type === 'entity') {
			// <destination: entity> || <targets: entity>
			// Check what arg2 is
			const [arg2, error2] = C.choiceArg(s, [[Token.PosVec3], [Token.Entity]])
			if (arg2?.type === 'posVec3') {
				// <targets: entity>
				t.args.targets = arg1 as P.TokenEntity
				// <location: posVec3>
				t.args.location = arg2 as P.TokenPosVec3
				// [<facing: (facing)>]
				t.args.facing = C.optionalArg(s, Token.Literal, [c.meta.facing], true)
				if (t.args.facing) {
					// [<entity: (entity)>]
					t.args.entity = C.optionalArg(s, Token.Literal, [c.meta.entity], true)
					if (t.args.entity) {
						// <facingEntity: entity>
						t.args.facingEntity = C.requiredArg(s, Token.Entity)
						// [<facingAnchor: (eyes|feet)>]
						t.args.facingAnchor = C.optionalArg(s, Token.Literal, [c.meta.facingAnchor])
					} else {
						// <facingLocation: posVec3>
						t.args.facingLocation = C.requiredArg(s, Token.PosVec3)
					}
				} else {
					// [<rotation: rotVec2>]
					t.args.rotation = C.optionalArg(s, Token.RotVec2)
				}
			} else if (arg2?.type === 'entity') {
				// <targets: entity>
				t.args.targets = arg1 as P.TokenEntity
				// <destination: entity>
				t.args.destination = arg2 as P.TokenEntity
			} else {
				// <destination: entity>
				t.args.destination = arg1 as P.TokenEntity
			}
		}
		return t
	}
)
export const tp = CR.newCommand<TokenTeleportCommand>(
	'minecraft:tp',
	'tp',
	teleportCommand.meta,
	teleportCommand.tokenizer
)

/**
 * ```html
 * /tellraw <targets: entity> <message: json>
 * ```
 */
interface TokenTellrawCommand extends P.TokenCommand {
	id: 'minecraft:tellraw'
	keyword: 'tellraw'
	args: {
		targets: P.TokenEntity
		message: P.TokenJson
	}
}
export const tellrawCommand = CR.newCommand<TokenTellrawCommand>(
	'minecraft:tellraw',
	'tellraw', {}, (s, t, c) => {
	// <targets: entity>
	t.args.targets = C.requiredArg(s, Token.Entity)
	// <message: json>
	t.args.message = C.requiredArg(s, Token.Json)
	return t
})

/**
 * ```html
 * /time <mode: (add|query|set)> ...
 * - add <addTime: int[t|s|d]>
 * - query <query: (daytime|gametime|day)>
 * - set <setTime: int|(day|night|noon|midnight)>
 * ```
 */
interface TokenTimeCommand extends P.TokenCommand {
	id: 'minecraft:time'
	keyword: 'time'
	args: {
		mode: P.TokenLiteral & { value: 'add' | 'query' | 'set' }
		addTime?: P.TokenInt & { indicator?: 't' | 's' | 'd' }
		query?: P.TokenLiteral & { value: 'daytime' | 'gametime' | 'day' }
		setTime?: P.TokenInt | (P.TokenLiteral & { value: 'day' | 'night' | 'noon' | 'midnight' })
	}
}
export const timeCommand = CR.newCommand<TokenTimeCommand>(
	'minecraft:time',
	'time',
	{
		mode: ['add', 'query', 'set'],
		addTimeIndicator: ['t', 's', 'd'],
		query: ['daytime', 'gametime', 'day'],
		setTime: ['day', 'night', 'noon', 'midnight'],
	},
	(s, t, c) => {
		//<mode: (add|query|set)> ...
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		switch (t.args.mode.value) {
			case 'add':
				// add
				// <addTime: int[t|s|d]>
				t.args.addTime = C.requiredArg(s, Token.Int, [c.meta.addTimeIndicator])
				break
			case 'query':
				// query
				// <query: (daytime|gametime|day)>
				t.args.query = C.requiredArg(s, Token.Literal, [c.meta.query])
				break
			case 'set':
				// set
				// <setTime: int|(day|night|noon|midnight)>
				t.args.setTime = C.optionalArg(s, Token.Literal, [c.meta.setTime], true)
				if (!t.args.setTime) t.args.setTime = C.requiredArg(s, Token.Int)
				break
		}
		return t
	}
)

/**
 * ```html
 * /title <targets: entity> <mode: (actionbar|clear|reset|subtitle|times|title)> ...
 * - title ...
 * - subtitle ..
 * - actionbar ...
 *   - <title: json>
 * - clear
 * - reset
 * - times <fadeIn: int> <stay: int> <fadeOut: int>
 * ```
 */
interface TokenTitleCommand extends P.TokenCommand {
	id: 'minecraft:title'
	keyword: 'title'
	args: {
		targets: P.TokenEntity
		mode: P.TokenLiteral & {
			value: 'actionbar' | 'clear' | 'reset' | 'subtitle' | 'times' | 'title'
		}
		title?: P.TokenJson
		fadeIn?: P.TokenInt
		stay?: P.TokenInt
		fadeOut?: P.TokenInt
	}
}
export const titleCommand = CR.newCommand<TokenTitleCommand>(
	'minecraft:title',
	'title',
	{
		mode: ['actionbar', 'clear', 'reset', 'subtitle', 'times', 'title'],
	},
	(s, t, c) => {
		// <targets: entity>
		t.args.targets = C.requiredArg(s, Token.Entity)
		// <mode: (actionbar|clear|reset|subtitle|times|title)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		switch (t.args.mode.value) {
			case 'title':
			case 'subtitle':
			case 'actionbar':
				// title ...
				// subtitle ..
				// actionbar ...
				// <title: json>
				t.args.title = C.requiredArg(s, Token.Json)
				break
			case 'times':
				// times
				// <fadeIn: int>
				t.args.fadeIn = C.requiredArg(s, Token.Int)
				// <stay: int>
				t.args.stay = C.requiredArg(s, Token.Int)
				// <fadeOut: int>
				t.args.fadeOut = C.requiredArg(s, Token.Int)
				break
		}
		return t
	}
)

/**
 * ```html
 * /trigger <objective: unquotedString> [<mode: (add|set)>] <value: int>
 * ```
 */
interface TokenTriggerCommand extends P.TokenCommand {
	id: 'minecraft:trigger'
	keyword: 'trigger'
	args: {
		objective: P.TokenUnquotedString
		mode?: P.TokenLiteral & { value: 'add' | 'set' }
		value?: P.TokenInt
	}
}
export const triggerCommand = CR.newCommand<TokenTriggerCommand>(
	'minecraft:trigger',
	'trigger',
	{
		mode: ['add', 'set'],
	},
	(s, t, c) => {
		// <objective: unquotedString>
		t.args.objective = C.requiredArg(s, Token.UnquotedString)
		// [<mode: (add|set)>]
		t.args.mode = C.optionalArg(s, Token.Literal, [c.meta.mode])
		if (t.args.mode) {
			// <value: int>
			t.args.value = C.requiredArg(s, Token.Int)
		}
		return t
	}
)

/**
 * ```html
 * /weather <mode: (clear|rain|thunder)> [<duration: int>]
 * ```
 */
interface TokenWeatherCommand extends P.TokenCommand {
	id: 'minecraft:weather'
	keyword: 'weather'
	args: {
		mode: P.TokenLiteral & { value: 'clear' | 'rain' | 'thunder' }
		duration?: P.TokenInt
	}
}
export const weatherCommand = CR.newCommand<TokenWeatherCommand>(
	'minecraft:weather',
	'weather',
	{
		mode: ['clear', 'rain', 'thunder'],
	},
	(s, t, c) => {
		// <mode: (clear|rain|thunder)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		// [<duration: int>]
		t.args.duration = C.optionalArg(s, Token.Int)
		return t
	}
)

/**
 * ```html
 * /worldborder <mode: (add|center|damage|get|set|warning)> ...
 * - add <distance: double> [<time: int>]
 * - center <pos: posVec3>
 * - damage <damageType: (amount|buffer)> ...
 *   - amount <damagePerBlock: double>
 *   - buffer <distance: double>
 * - get
 * - set <distance: double> [<time: int>]
 * - warning <warningMode: (distance|time)> ...
 *   - distance <distance: int>
 *   - time <time: int>
 * ```
 */
interface TokenWorldborderCommand extends P.TokenCommand {
	id: 'minecraft:worldborder'
	keyword: 'worldborder'
	args: {
		mode: P.TokenLiteral & { value: 'add' | 'center' | 'damage' | 'get' | 'set' | 'warning' }
		distance?: P.TokenDouble | P.TokenInt
		damageType?: P.TokenLiteral & { value: 'amount' | 'buffer' }
		damagePerBlock?: P.TokenDouble
		time?: P.TokenInt
		pos?: P.TokenPosVec3
		warningMode?: P.TokenLiteral & { value: 'distance' | 'time' }
	}
}
export const worldborderCommand = CR.newCommand<TokenWorldborderCommand>(
	'minecraft:worldborder',
	'worldborder',
	{
		mode: ['add', 'center', 'damage', 'get', 'set', 'warning'],
		damageType: ['amount', 'buffer'],
		warningMode: ['distance', 'time'],
	},
	(s, t, c) => {
		// <mode: (add|center|damage|get|set|warning)>
		t.args.mode = C.requiredArg(s, Token.Literal, [c.meta.mode])
		switch (t.args.mode.value) {
			case 'add':
				// add
				// <distance: double>
				t.args.distance = C.requiredArg(s, Token.Double)
				// [<time: int>]
				t.args.time = C.optionalArg(s, Token.Int)
				break
			case 'center':
				// center
				// <pos: posVec3>
				t.args.pos = C.requiredArg(s, Token.PosVec3)
				break
			case 'damage':
				// damage
				// <damageType: (amount|buffer)>
				t.args.damageType = C.requiredArg(s, Token.Literal, [c.meta.damageType])
				if (t.args.damageType.value === 'amount') {
					// amount
					// <damagePerBlock: double>
					t.args.damagePerBlock = C.requiredArg(s, Token.Double)
				} else {
					// buffer
					// <distance: double>
					t.args.distance = C.requiredArg(s, Token.Double)
				}
				break
			case 'get':
				// get
				break
			case 'set':
				// set
				// <distance: double>
				t.args.distance = C.requiredArg(s, Token.Double)
				// [<time: int>]
				t.args.time = C.optionalArg(s, Token.Int)
				break
			case 'warning':
				// warning
				// <warningMode: (distance|time)> ...
				t.args.warningMode = C.requiredArg(s, Token.Literal, [c.meta.warningMode])
				if (t.args.warningMode.value === 'distance') {
					// distance
					// <distance: int>
					t.args.distance = C.requiredArg(s, Token.Double)
				} else {
					// time
					// <time: int>
					t.args.time = C.requiredArg(s, Token.Int)
				}
				break
		}
		return t
	}
)

/**
 * ```html
 * /
 * ```
 */
// interface Token_Command extends  P.TokenCommand {
// 	name: '_'
// 	args: {}
// }
// export const _Command = CR.newCommand<Token_Command>('_', {}, (s,t,c) => {
// 	return t
// })
