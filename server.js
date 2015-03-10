'use strict'

var express = require('express')


var app = express()
app.set('view engine', 'jade')
app.use('/', require('./routes/index'))

app.listen(8080)
console.log('Listening on port 8080...')
