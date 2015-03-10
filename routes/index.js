'use strict'

var express = require('express')
var currency = require('../currency')

var router = express.Router()

var expirationDates = []
{
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
}

router.get('/', function(req, res) {
    res.render('index', {error: undefined, currencies: currency.all,
                         expirationDates: expirationDates})
})

module.exports = router
