#!/usr/bin/env node
const { initialize, generateCA } = require('../lib/manage')
const args = process.argv.slice(2)
const { readCA } = require('../lib/structure')
// console.log({ args })

function write (string) {
  return process.stdout.write(string)
}

function read () {
  const name = args.length > 1 ? args[1] : undefined
  const ca = readCA(name)
  write(JSON.stringify(ca))
}
function create () {
  if (args.length < 2) return write(`Error: please provide host name`)
  const result = generateCA(args[1])
  write(JSON.stringify(result))
}

switch (args[0]) {
  case 'init':
    initialize({})
    read()
    break
  case 'setCA':
    create()
    break
  case 'getCA':
    // const name = args.length > 1 ? args[1] : undefined
    // const ca = readCA(name)
    // write(JSON.stringify(ca))
    read()
    break
  case 'echo':
    write('echoed')
    break
  default:
    write(`
    Commands are:
      https-cli init - initilizes a default rootCA
      https-cli getCA [HOSTNAME] - returns the cert for the hostname it was initialized with
      https-cli setCA [HOSTNAME] - creates and returns the cert for the hostname. Returns false if host is already set

      https-cli echo - returns 'echoed' - use to test your integrations though stdin
  `)
}
