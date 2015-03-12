'use strict'

var paypal = require('paypal-rest-sdk')


function PaypalGateway(configuration) {
    this.configuration = configuration
}
module.exports = exports = PaypalGateway

PaypalGateway.prototype = {
    supportsTransaction: function(currency, card) {
        if(card.type === 'AMEX' && currency.code === 'USD')
            return true
        if(currency.code === 'USD' || currency.code === 'EUR' || currency.code === 'AUD')
            return true
        return false
    },
    makePayment: function(currency, card, next) {
        paypal.configure(configuration)
        
        var sender_batch_id = Math.random().toString(36).substring(9);

        var params = {
            "sender_batch_header": {
                "sender_batch_id": sender_batch_id,
                "email_subject": "You have a payment"
            },
            "items": [
                {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": 0.90,
                        "currency": "USD"
                    },
                    "receiver": "shirt-supplier-three@mail.com",
                    "note": "Thank you.",
                    "sender_item_id": "item_3"
                }
            ]
        }

        paypal.payout.create(params, function(error, payout) {
            if(error)
                next(error)
            else {
                console.log(payout)
                next()
            }
        })
    }
}

