'use strict'

var paypal = require('paypal-rest-sdk')


function PaypalGateway(configuration, productionMode) {
    this.configuration = configuration
}
module.exports = exports = PaypalGateway

PaypalGateway.prototype = {
    supportsTransaction: function(currencyType, card) {
        if(card.type === 'AMEX')
            return currencyType.code === 'USD'
        if(currencyType.code === 'USD' || currencyType.code === 'EUR' || currencyType.code === 'AUD')
            return true
        return false
    },
    makePayment: function(cost, card, next) {
        paypal.configure(this.configuration)
        
        var payment = {
            "intent": "sale",
            "transactions": [{
                "amount": {
                    "currency": cost.type.code,
                    "total": cost.amount
                },
                "description": 'TEST TRANSACTION'
            }]
        }
        
        var funding_instruments = [
            {
                "credit_card": {
                    "type": card.type.toLowerCase(),
                    "number": card.number,
                    "expire_month": card.expirationMonth,
                    "expire_year": card.expirationYear,
                    "first_name": card.firstName,
                    "last_name": card.lastName
                }
            }
        ]
        var payer = {
            payment_method: 'credit_card',
            funding_instruments: funding_instruments
        }
        payment.payer = payer

        paypal.payment.create(payment, function(err, payment) {
            console.log(err)
            if(err)
                return next('[Paypal payment create HTTP' + err.httpStatusCode + '] ' +
                            err.response.error_description)
            //req.session.paymentId = payment.id;
            //res.render('create', { 'payment': payment })
            
            console.log('payment')
            console.log(payment)
            
                

            var paymentId = req.session.paymentId
            var payerId = req.param('PayerID')

            var details = {"payer_id": payerId}
            var payment = paypal.payment.execute(payment.id, details, function(err, payment) {
                console.log(err)
                if(err)
                    return next('[Paypal payment execute HTTP' + err.httpStatusCode + '] ' +
                                err.response.error_description)
                
                //res.render('execute', {'payment': payment})
                console.log('payment')
                console.log(payment)
                next()
            })
        })
    }
}

