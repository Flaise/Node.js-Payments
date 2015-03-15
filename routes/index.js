'use strict'

var express = require('express')
var currency = require('../currency')
var cards = require('../cards')
var bodyParser = require('body-parser')
var payment = require('../payment')


var router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))

var fields = [{name: 'currency_amount', displayName: 'Price'},
              {name: 'currency_type', displayName: 'Currency'},
              {name: 'fullName', displayName: 'Full Name'},
              {name: 'card_name', displayName: 'Name on Card'},
              {name: 'card_type', displayName: 'Card Type'},
              {name: 'card_number', displayName: 'Card Number'},
              {name: 'card_expiration', displayName: 'Expiration Date'},
              {name: 'card_ccv', displayName: 'CCV'}]

router.get('/', function(req, res) {
    res.render('index', {error: undefined, currencies: currency.types,
                         expirationDates: cards.expirationDates, reqBody: {},
                         cardTypes: cards.typeCodes})
})

router.post('/', function(req, res) {
    function renderError(error) {
        res.render('index', {error: error, currencies: currency.types,
                             expirationDates: cards.expirationDates, reqBody: req.body,
                             cardTypes: cards.typeCodes})
    }
    
    for(var i = 0; i < fields.length; i += 1) {
        if(!req.body[fields[i].name]) {
            return renderError(fields[i].displayName + ': This field is required.')
        }
    }
    
    try {
        var cost = new currency.Currency(req.body.currency_type, req.body.currency_amount)
        
        var exp = req.body.card_expiration.split('/')
        var card = new cards.Card(req.body.card_number, req.body.card_ccv, req.body.card_type,
                                  exp[0], exp[1], req.body.card_name)
        
        cost.validate()
        card.validate()
    }
    catch(err) {
        console.warn(err.stack || err)
        return renderError(err)
    }
    
    payment.makePayment(cost, card, function(err) {
        if(err)
            return renderError(err)
        
        res.render('index', {success: 'Payment processed successfully. ' +
                                      'Thank you for doing business with us.',
                             currencies: currency.types, expirationDates: cards.expirationDates,
                             reqBody: {}, cardTypes: cards.typeCodes})
    })
})

module.exports = exports = router
