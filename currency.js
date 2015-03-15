'use strict'

function CurrencyType(code, displayName) {
    this.code = code.toUpperCase()
    this.displayName = displayName
}

exports.types = [new CurrencyType('USD', 'US dollars'),
                 new CurrencyType('EUR', 'Euros'),
                 new CurrencyType('THB', 'Thai baht'),
                 new CurrencyType('HKD', 'Hong Kong dollars'),
                 new CurrencyType('SGD', 'Singapore dollars'),
                 new CurrencyType('AUD', 'Australian dollars')]

exports.code2type = function(code) {
    code = code.toUpperCase()
    var result
    exports.types.some(function(currency) {
        if(currency.code === code) {
            result = currency
            return true
        }
    })
    if(!result)
        throw new Error('Invalid currency type: "' + code + '"')
    return result
}

function Currency(type, amount) {
    if(typeof type === 'string') {
        this.typeCode = type
        this.type = undefined
    }
    else {
        this.typeCode = type.code
        this.type = type
    }
    this.type = type
    this.amount = amount
}
exports.Currency = Currency

Currency.prototype.validate = function() {
    if(!this.typeCode)
        throw new Error('Currency type is required.')
    this.type = exports.code2type(this.typeCode)
    if(!this.amount)
        throw new Error('Currency amount is required.')
}
