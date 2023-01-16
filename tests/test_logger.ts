import { getLogger } from '../src/utils/logger'

const logger = getLogger()
logger.debug('abc', 'tjeubaoit', 30)

const a = 1
const b = 0
const c = ''
const d = '1'

if (a) console.log('a ok')
if (b) console.log('b ok')
if (c) console.log('c ok')
if (d) console.log('d ok')
