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
        return next('not implemented')
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

