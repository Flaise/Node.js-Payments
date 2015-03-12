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

function Card(number, expirationMonth, expirationYear) {
    this.number = number
    this.expirationMonth = expirationMonth
    this.expirationYear = expirationYear
}
exports.Card = Card
