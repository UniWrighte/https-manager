A simple library for managing (creating and retrieving) certificates and a root certificate authority

Usage with node projects:

Install:

    npm i https-manager

Usage:
    
    const httpsManager = require('https-manager')
    // TODO - better support and documentation for use with node will come in later updates

Usage as an interface with other programming languages:

Install:

    npm i -g https-manager

Usage:

Used from CLI and writes to stdout.

CLI Usage:

    https-cli init
    https-cli getCA [HOSTNAME]
    https-cli setCA [HOSTNAME]

run `https-cli init` to either initialize the rootCA and return the key and certificate or return the existing rootCA.

An example of usage with Go would be:

    func InitCert() (ﬆring, string) {
      certInit := exec.Command("https-cli", "init")
      stdin, err := certInit.StdinPipe()
      if err != nil {
        log.Fatal(err)
      }
      go func() {
        defer stdin.Close()
        io.WriteString(stdin, "something")
      }()
      out, err := certInit.CombinedOutput()
      if err != nil {
        log.Fatal(err)
      }
      var root map[string]interface{}
      if err := json.Unmarshal(out, &root); err != nil {
        panic(err)
      }
      cert := root["cert"].(string)
      key := root["key"].(string)
      return cert, key
    }