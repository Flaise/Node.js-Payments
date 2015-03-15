'use strict'

var cards = require('../cards')


describe('Cards', function() {
    it('will not validate if only one name is given', function() {
        var card = new cards.Card('asdlf', '123', 'amex', '1', '18', 'Rsgaswedas')
        expect(function() {
            card.validate()
        }).toThrow()
    })
})
