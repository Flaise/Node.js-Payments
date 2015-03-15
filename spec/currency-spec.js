'use strict'

var currency = require('../currency')


describe('currency', function() {
    ;['usd', 'eur', 'thb', 'hkd', 'sgd', 'aud'].forEach(function(code) {
        it('can load type ' + code.toUpperCase(), function() {
            var type = currency.code2type(code)
            expect(type).toBeDefined()
            expect(type.code).toBe(code.toUpperCase())
        })
        
        it('can construct amount for ' + code.toUpperCase(), function() {
            var cost = new currency.Currency(code, 10)
            cost.validate()
            expect(cost).toBeDefined()
            expect(cost.type).toBeDefined()
            expect(cost.type.code).toBe(code.toUpperCase())
            expect(cost.amount).toBe(10)
        })
    })
})
