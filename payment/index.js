'use strict'


function GatewayGroup(gateways) {
    this.gateways = gateways
}

GatewayGroup.prototype.makePayment = function(currency, card, next) {
    if(card.type === 'AMEX' && currency.type.code !== 'USD')
        // special case error message that gateways can't be specific about
        throw new Error('AMEX cards can only be used with US Dollars as a currency.')
    
    for(var i = 0; i < this.gateways.length; i += 1) {
        if(this.gateways[i].supportsTransaction(currency, card))
            this.gateways[i].makePayment(currency, card, next)
    }
    
    console.warn('Attempted to process transaction with card.type=' + card.type +
                 ' and currency.type.code=' + currency.type.code +
                 '. Check the server configuration.')
    throw new Error('Transactions with that currency type and card type are not supported.' +
                    ' Contact customer support if you need assistance.')
}

var currentGroup

exports.init = function(gateways) {
    currentGroup = new GatewayGroup(gateways)
}
exports.makePayment = function(currency, card, next) {
    currentGroup.makePayment(currency, card, next)
}
