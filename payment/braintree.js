'use strict'

var braintree = require('braintree')


function BraintreeGateway(configuration) {
    this.configuration = configuration
}
module.exports = exports = BraintreeGateway

BraintreeGateway.prototype = {
    supportsTransaction: function(currency, card) {
        if(card.type === 'AMEX')
            return false
        if(currency.code === 'THB' || currency.code === 'HKD' || currency.code === 'SGD')
            return true
        return false
    },
    makePayment: function(currency, card, next) {
        var gateway = braintree.connect(this.configuration)
        
        gateway.transaction.sale({
            amount: currency.amount,
            creditCard: {
                number: card.number,
                expirationMonth: card.expirationMonth,
                expirationYear: card.expirationYear
            }
        }, function(err, result) {
            if(err)
                next(err)
            else {
                var transactionID = result.transaction.id
                var message = result.message
                
                console.log(result)
                next()
            }
        })
    }
}
