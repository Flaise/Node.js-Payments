'use strict'

var cards = require('../cards')
var currency = require('../currency')
var Paypal = require('../payment/paypal')
var Braintree = require('../payment/braintree')


describe('Gateways', function() {
    it('Paypal supports AMEX and USD', function() {
        var card = new cards.Card('asdlf', '123', 'amex', '1', '18', 'Rsgasw edas')
        card.validate()
        expect(new Paypal().supportsTransaction(currency.code2type('usd'), card)).toBe(true)
    })
    it('Paypal does not support AMEX and a currency other than USD', function() {
        var card = new cards.Card('asdlf', '123', 'amex', '1', '18', 'Rsgasw edas')
        card.validate()
        expect(card.type).toBe('AMEX')
        
        var type = currency.code2type('aud')
        expect(type.code).toBe('AUD')
        
        expect(new Paypal().supportsTransaction(type, card)).toBe(false)
    })
    it('Braintree does not support AMEX', function() {
        var card = new cards.Card('asdlf', '123', 'amex', '1', '18', 'Rsgasw edas')
        card.validate()
        expect(new Braintree().supportsTransaction(currency.code2type('usd'), card)).toBe(false)
    })
    it('Braintree supports visa and SGD', function() {
        var card = new cards.Card('asdlf', '123', 'visa', '1', '18', 'Rsgasw edas')
        card.validate()
        expect(new Braintree().supportsTransaction(currency.code2type('sgd'), card)).toBe(true)
    })
})
