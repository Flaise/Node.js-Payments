'use strict'


exports.init = function(gateways) {
    exports.gateways = gateways
}
exports.makePayment = function(cost, card, next) {
    if(card.type === 'AMEX' && cost.type.code !== 'USD')
        // special case error message that gateways can't be specific about
        return next('AMEX cards can only be used with US Dollars as a currency.')
    
    for(var i = 0; i < this.gateways.length; i += 1) {
        if(exports.gateways[i].supportsTransaction(cost.type, card))
            return exports.gateways[i].makePayment(cost, card, next)
    }
    
    console.warn('Attempted to process transaction with card.type=' + card.type +
                 ' and currency.type.code=' + cost.type.code +
                 '. Check the server configuration.')
    next('Transactions with that currency type and card type are not supported.' +
         ' Contact customer support if you need assistance.')
}
