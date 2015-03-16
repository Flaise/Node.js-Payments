'use strict'

var braintree = require('braintree')


function BraintreeGateway(configuration) {
    this.configuration = configuration
}
module.exports = exports = BraintreeGateway

BraintreeGateway.prototype = {
    supportsTransaction: function(currencyType, card) {
        if(card.type === 'AMEX')
            return false
        if(currencyType.code === 'THB' || currencyType.code === 'HKD' || currencyType.code === 'SGD')
            return true
        return false
    },
    makePayment: function(cost, card, next) {
        var gateway = braintree.connect(this.configuration)
        
        gateway.transaction.sale({
            amount: cost.amount,
            creditCard: {
                number: card.number,
                expirationMonth: card.expirationMonth,
                expirationYear: card.expirationYear
            }
        }, function(err, result) {
            if(err)
                next(err)
            else if(!result.success)
                next(result.message)
            else
                next()
        })
    }
}

