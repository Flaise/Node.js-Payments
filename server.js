'use strict'

try {
    var settings = require('./settings')
}
catch(err) {
    if(err.code !== 'MODULE_NOT_FOUND')
        throw err
    var settings = {}
    console.warn('No configuration file found at "./settings". See /settings/readme.txt.')
}

var express = require('express')
var http = require('http')


var app = express()
app.set('view engine', 'jade')
app.use('/', require('./routes/index'))


var payment = require('./payment')
var Paypal = require('./payment/paypal')
var Braintree = require('./payment/braintree')

var gatewayParams = [{path: './settings/paypal', name: 'Paypal', constructor: Paypal},
                     {path: './settings/braintree', name: 'Braintree', constructor: Braintree}]

function configure(productionMode) {
    var key = (productionMode? 'production': 'sandbox')
    
    var gateways = gatewayParams.map(function(settings) {
        try {
            return new settings.constructor(require(settings.path)[key])
        }
        catch(err) {
            if(err.code !== 'MODULE_NOT_FOUND')
                throw err
            console.warn('No configuration file found for ' + settings.name +
                         '. See /settings/readme.txt.')
        }
    })
    gateways = gateways.filter(function(a) { return a != null })
    
    payment.init(gateways)
}

var httpServer

exports.run = function(port, productionMode) {
    if(httpServer)
        throw new Error()
    configure(productionMode)
    httpServer = http.createServer(app)
    httpServer.listen(port)
}

exports.stop = function(callback) {
    if(!httpServer)
        throw new Error()
    httpServer.close(function() {
        httpServer = undefined
        callback()
    })
}


if(require.main === module) {
    exports.run(settings.port || 8080, settings.productionMode)
    console.log('Listening on port ' + (settings.port || 8080) + '...')
}
