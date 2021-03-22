var homeDir = require('path').join(require('os').homedir());
require('greenlock-express').create({
  version: 'draft-11'
, server: 'https://acme-v02.api.letsencrypt.org/directory'
, email: ''                                     // CHANGE THIS
, agreeTos: true
, approveDomains: [ 'example.com', 'www.example.com' ]              // CHANGE THIS
, store: require('greenlock-store-fs')
, configDir: homeDir
, app: require('./server.js')
}).listen(8080, 8443);

