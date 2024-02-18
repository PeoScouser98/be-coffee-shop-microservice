const crypto = require('node:crypto')

console.log(crypto.randomBytes(24).toString('hex'))
