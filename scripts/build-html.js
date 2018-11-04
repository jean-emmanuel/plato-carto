var mustache = require('mustache'),
    data = require('../config/locale'),
    fs = require('fs'),
    path = require('path'),
    send = require('./ipc')

var inputPath = path.resolve(__dirname + '/../src/mustache/index.mustache'),
    outputPath = path.resolve(__dirname + '/../app/index.html')

fs.writeFileSync(outputPath, mustache.render(fs.readFileSync(inputPath).toString(), data))

setTimeout(()=>{
    send('reload')
}, 1000)
