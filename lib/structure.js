const fs = require('fs')
const os = require('os')
const path = require('path')

const MAIN_PATH = path.join(os.homedir(), '.tls-manager-certs')
const ROOT_PATH = path.join(MAIN_PATH, 'rootCA')

const checkStructure = (rootDirName = ROOT_PATH, dirName = MAIN_PATH) => {
  return fs.existsSync(rootDirName) && fs.existsSync(dirName)
}

const initDir = (dirName = MAIN_PATH) => {
  // const dir = path.join(os.homedir(), dirName)
  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)
  return dirName
}

const rootDir = (rootDirName = ROOT_PATH) => {
  try {
    return initDir(rootDirName)
  } catch (error) {
    initDir()
    return initDir(rootDirName)
  }
}

const hostPaths = (p, host = 'rootCA') => {
  return {
    certPath: path.join(p, `${host}.crt`),
    keyPath: path.join(p, `${host}.key`)
  }
}

const storeCA = (privateKey, certificate, keyPath, certPath) => {
  fs.writeFileSync(certPath, certificate)
  fs.writeFileSync(keyPath, privateKey)
}

const storeHostCA = (privateKey, certificate, hostName, path = MAIN_PATH) => {
  const { certPath, keyPath } = hostPaths(path, hostName)
  storeCA(privateKey, certificate, keyPath, certPath)
}

const storeRootCA = (privateKey, certificate, rootPath = ROOT_PATH) => {
  const { certPath, keyPath } = hostPaths(rootPath)
  if (!fs.existsSync(certPath) && !fs.existsSync(keyPath)) {
    storeCA(privateKey, certificate, keyPath, certPath)
    return true
  } else {
    return false
  }
}

const refreshRootCA = (privateKey, certificate, rootPath) => {
  const { certPath, keyPath } = hostPaths(rootPath)
  if (fs.existsSync(certPath)) fs.unlinkSync(certPath)
  if (fs.existsSync(keyPath)) fs.unlinkSync(keyPath)
  return storeRootCA(privateKey, certificate, rootPath)
}

const readCA = (host = 'rootCA', path) => {
  // const defaultPath = host === 'rootCA' && path === undefined ? ROOT_PATH : path === undefined ? MAIN_PATH : path
  const defaultPath = !path ? host === 'rootCA' ? ROOT_PATH : MAIN_PATH : path
  const paths = hostPaths(defaultPath, host)
  return {
    cert: fs.readFileSync(paths.certPath, 'utf-8'),
    key: fs.readFileSync(paths.keyPath, 'utf-8')
  }
}

const checkCAExists = (path, hostName) => {
  const defaultHost = !hostName ? 'rootCA' : hostName
  const defaultPath = !path ? hostName === 'rootCA' ? ROOT_PATH : MAIN_PATH : path
  const { certPath, keyPath } = hostPaths(defaultPath, defaultHost)
  return fs.existsSync(certPath) && fs.existsSync(keyPath)
}

module.exports.initDir = initDir
module.exports.rootDir = rootDir
module.exports.storeRootCA = storeRootCA
module.exports.checkCAExists = checkCAExists
module.exports.refreshRootCA = refreshRootCA
module.exports.readCA = readCA
module.exports.storeHostCA = storeHostCA
module.exports.checkStructure = checkStructure
