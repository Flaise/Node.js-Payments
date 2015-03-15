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
        
        function formatError(method, err) {
            var prefix = '[Paypal ' + method + ' HTTP' + err.httpStatusCode + '] '
            
            if(err.response.error === 'invalid_client') {
                console.warn('Invalid Paypal client credentials. Check the server configuration.')
                return prefix + err.response.error_description
            }
            else if(err.response.name === 'VALIDATION_ERROR') {
                err.response.details.forEach(function(subErr) {
                    if(subErr.field.indexOf('credit_card.number') > -1)
                        prefix += '<br/>Credit Card Number: ' + subErr.issue
                    else if(subErr.field.indexOf('amount.total') > -1)
                        prefix += '<br/>Currency Amount: ' + subErr.issue
                    else if(subErr.field.indexOf('credit_card') > -1)
                        prefix += '<br/>Credit Card: ' + subErr.issue
                    else
                        prefix += '<br/>' + JSON.stringify(subErr)
                })
                return prefix
            }
            else if(err.response.name === 'INTERNAL_SERVICE_ERROR') {
                return prefix + 'Paypal is experiencing technical difficulties. Try again later ' +
                       'or contact customer support if you need immediate assistance.'
            }
            else if(err.response.name) {
                return prefix + err.response.message +
                       '<br/><a href="' + err.response.information_link + '">More information</a>'
            }
            else {
                console.warn(require('util').inspect(err, true, 10))
                return prefix + 'Unknown error.'
            }
        }

        paypal.payment.create(payment, function(err, payment) {
            if(err)
                return next(formatError('payment create', err))
            
            if(payment.state === 'approved')
                next()
            else
                next('Paypal returned a status of "' + payment.state + '" - expected "approved".')
        })
    }
}

