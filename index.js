const { initialize, generateCA } = require('./lib/manage')
const { readCA } = require('./lib/structure')

function Main (options = {}) {
  initialize(options)
  this.generateCA = generateCA
  this.getCA = readCA
}

const certMgr = new Main()

certMgr.generateCA('google.com')
const ca = certMgr.getCA('google.com')

console.log({ ca })

module.exports = Main
