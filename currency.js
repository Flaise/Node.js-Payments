'use strict'

function CurrencyType(code, displayName) {
    this.code = code.toUpperCase()
    this.displayName = displayName
}

exports.all = [new CurrencyType('USD', 'US dollars'),
               new CurrencyType('EUR', 'Euros'),
               new CurrencyType('THB', 'Thai baht'),
               new CurrencyType('HKD', 'Hong Kong dollars'),
               new CurrencyType('SGD', 'Singapore dollars'),
               new CurrencyType('AUD', 'Australian dollars')]

exports.code2type = function(code) {
    code = code.toUpperCase()
    var result
    exports.all.some(function(currency) {
        if(currency.code === code) {
            result = currency
            return true
        }
    })
    return result
}

function Currency(type, amount) {
    if(typeof type === 'string')
        type = exports.code2type(type)
    this.type = type
    this.amount = amount
}
exports.Currency = Currency
