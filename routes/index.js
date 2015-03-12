'use strict'

var express = require('express')
var currency = require('../currency')
var cards = require('../cards')
var bodyParser = require('body-parser')


var router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))

router.get('/', function(req, res) {
    res.render('index', {error: undefined, currencies: currency.all,
                         expirationDates: cards.expirationDates, reqBody: {}})
})

router.post('/', function(req, res) {
    res.render('index', {error: 'Not implemented.', currencies: currency.all,
                         expirationDates: cards.expirationDates, reqBody: req.body})
})

module.exports = exports = router
