const forge = require('node-forge')
const { adjustDateByCalendarYears } = require('./util')

const defaultAttributes = [
  { name: 'countryName', value: 'US' },
  { name: 'organizationName', value: 'TLS Manager' },
  { shortName: 'ST', value: 'IN' },
  { shortName: 'OU', value: 'TLS Manger' }
]

const createKeysCert = (serialNumber = ((Math.random() * 100000 | 0) + ''), strength = 2048) => {
  const [keys, cert] = [
    forge.pki.rsa.generateKeyPair(strength),
    forge.pki.createCertificate()
  ]
  const { publicKey } = keys
  const [notBefore, notAfter] = adjustDateByCalendarYears(10)
  cert.publicKey = publicKey
  cert.serialNumber = serialNumber
  cert.validity.notBefore = new Date(notBefore) // 10 years
  cert.validity.notAfter = new Date(notAfter) // 10 yearsr
  return { keys, cert }
}

const createRootCA = (value = 'TLSCertManager', defaultAttribs = defaultAttributes) => {
  const { keys, cert } = createKeysCert()
  const attributes = [ ...defaultAttribs, { name: 'commonName', value } ]

  cert.setSubject(attributes)
  cert.setIssuer(attributes)
  cert.setExtensions([
    { name: 'basicConstraints', cA: true }
  ])
  cert.sign(keys.privateKey, forge.md.sha256.create())
  return {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert)
  }
}

// TODO - add default config from json file
const getRootCA = (rootCA) => {
  const { key, cert } = rootCA
  // console.log({ key, cert })
  return {
    caCertificate: forge.pki.certificateFromPem(cert),
    caKey: forge.pki.privateKeyFromPem(key)
  }
}

const createHostCert = (host, rootCA) => {
  const sn = forge.md.md5.create().update(host).digest().toHex()
  // md.update(host)
  const { keys, cert } = createKeysCert(sn)
  const { caCertificate, caKey } = getRootCA(rootCA)
  cert.setIssuer(caCertificate.subject.attributes)
  const attributes = [ ...defaultAttributes, { name: 'commonName', value: host } ]
  // TODO - extensions
  cert.setSubject(attributes)
  cert.sign(caKey, forge.md.sha256.create())
  return {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert)
  }
}

module.exports.createKeysCert = createKeysCert
module.exports.createRootCA = createRootCA
module.exports.createHostCert = createHostCert
