'use strict'

var expirationDates = []
var expiration = new Date()
for(var i = 0; i < 12 * 6; i += 1) {
    var monthZeroBased = expiration.getMonth()
    var realMonth = monthZeroBased + 1
    var year = expiration.getFullYear()
    expirationDates.push({
        code: realMonth + '/' + year,
        displayName: realMonth + '/' + (year.toString().slice(-2))
    })
    
    expiration.setMonth(monthZeroBased + 1)
}

exports.expirationDates = expirationDates

exports.typeCodes = ['VISA', 'MASTERCARD', 'DISCOVER', 'AMEX']

function validateType(type) {
    type = type.toUpperCase()
    if(!exports.typeCodes.some(function(r) { return r === type }))
        throw new Error('Invalid card type: "' + type + '"')
    return type
}

function Card(number, ccv, type, expirationMonth, expirationYear, name) {
    this.number = number
    this.ccv = ccv
    this.type = type
    this.expirationMonth = expirationMonth
    this.expirationYear = expirationYear
    this.name = name
    this.firstName = undefined
    this.lastName = undefined
}
exports.Card = Card

Card.prototype.validate = function() {
    if(!this.number)
        throw new Error('Card number is required.')
    if(!this.ccv)
        throw new Error('Card CCV is required.')
    this.type = validateType(this.type)
    if(!this.expirationMonth || ! this.expirationYear)
        throw new Error('Card expiration date is required.')
    if(!this.name)
        throw new Error('Name on card is required.')
    var names = this.name.split(' ')
    this.firstName = names[0]
    this.lastName = names[names.length - 1]
    if(names.length < 2)
        throw new Error('First and last name on card are required.')
}

