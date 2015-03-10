'use strict'

var express = require('express')
var http = require('http')


var app = express()
app.set('view engine', 'jade')
app.use('/', require('./routes/index'))

var httpServer

exports.run = function(port) {
    if(httpServer)
        throw new Error()
    httpServer = http.createServer(app)
    httpServer.listen(port)
}

exports.stop = function(callback) {
    if(!httpServer)
        throw new Error()
    httpServer.close(callback)
    httpServer = undefined
}


if(require.main === module) {
    exports.run(8080)
    console.log('Listening on port 8080...')
}
