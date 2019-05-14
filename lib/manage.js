const path = require('path')
const { createRootCA, createHostCert } = require('./cert')
const { checkStructure, storeRootCA, checkCAExists, refreshRootCA, storeHostCA, readCA, rootDir } = require('./structure')

const generateRootCA = (commonName, rootCAPath) => {
  const { privateKey, certificate } = createRootCA(commonName)
  const writeSuccess = storeRootCA(privateKey, certificate, rootCAPath)
  !writeSuccess && checkCAExists(rootCAPath) && refreshRootCA(privateKey, certificate, rootCAPath)
}

const initialize = (options) => {
  const { commonName, caPath } = options
  const rootCAPath = caPath ? path.join(caPath, 'rootCA') : undefined

  const isStructured = checkStructure(caPath, rootCAPath)
  if (!isStructured) {
    rootDir()
    generateRootCA(commonName, rootCAPath)
  }
}

const generateCA = (host, rootCA = readCA(), caPath, unsafe = false) => {
  unsafe && initialize({ caPath })
  if (checkCAExists(caPath, host)) return false
  const { privateKey, certificate } = createHostCert(host, rootCA)
  storeHostCA(privateKey, certificate, host, caPath)
  return { privateKey, certificate }
}

module.exports.generateCA = generateCA
module.exports.generateRootCA = generateRootCA
module.exports.initialize = initialize
