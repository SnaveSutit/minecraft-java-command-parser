export * as tokenizer from './tokenizers/vanillaTokenizer'
export * as parser from './parsers/vanillaParser'
export * as commands from './commands/vanillaCommands'

import { mcbuildTest, runPerfTest, vanillaTest } from './tests'

// await vanillaTest()
// void runPerfTest()
await mcbuildTest()
