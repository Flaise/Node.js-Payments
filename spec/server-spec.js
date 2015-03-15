'use strict'

var phantom = require('phantom')
var Browser = require('zombie')
var server = require('../server')
var payment = require('../payment')
var cards = require('../cards')

try {
    var paypalSettings = require('../settings/paypal').sandbox || {}
}
catch(err) {
    if(err.code !== 'MODULE_NOT_FOUND')
        throw err
    console.warn('No configuration file found for paypal. See /settings/readme.txt.')
    paypalSettings = {}
}


var port = 9001
Browser.localhost('bunnies.com', port)
var browser = new Browser()

function submit() {
    return browser.pressButton('input[type="submit"]')
}

function expectSuccessfulPayment() {
    expect(browser.text('.error')).toBeFalsy()
    browser.assert.success()
    browser.assert.element('.success')
    expect(payment.makePayment).toHaveBeenCalled()
    browser.assert.text('[name="card_number"]', '')
    browser.assert.text('[name="card_ccv"]', '')
}
function expectRenderedError() {
    browser.assert.element('.error')
    expect(browser.text('.error')).toBeTruthy()
}

function payments() {
    describe('payments', function() {
        beforeEach(function() {
            browser
                .fill('[name="currency_amount"]', '5.00')
                .select('[name="currency_type"]', 'USD')
                .fill('[name="fullName"]', 'Lycalopex sechurae')
                .fill('[name="card_name"]', 'food platformation')
            
            spyOn(payment, 'makePayment').and.callThrough()
        })
        
        amex()
        visa()
    })
}

function amex() {
    describe('amex', function() {
        beforeEach(function() {
            browser
                .fill('[name="currency_amount"]', '5.00')
                .select('[name="currency_type"]', 'USD')
                .select('[name="card_type"]', 'AMEX')
                .fill('[name="card_number"]', paypalSettings.test_cards.AMEX.number)
                .select('[name="card_expiration"]', paypalSettings.test_cards.AMEX.expiration)
                .fill('[name="card_ccv"]', '123')
        })

        it('can process USD transactions (Paypal)', function(done) {
            submit()
                .then(function() {
                    expectSuccessfulPayment()
                })
                .finally(done)
        })

        it("can not process AUD transactions", function(done) {
            browser
                .select('[name="currency_type"]', 'AUD')
            submit()
                .then(function() {
                    expectRenderedError()
                })
                .finally(done)
        })
    })
}

function visa() {
    describe('visa', function() {
        beforeEach(function() {
            browser
                .fill('[name="currency_amount"]', '5.00')
                .select('[name="currency_type"]', 'USD')
                .select('[name="card_type"]', 'VISA')
                .fill('[name="card_number"]', paypalSettings.test_cards.VISA.number)
                .select('[name="card_expiration"]', paypalSettings.test_cards.VISA.expiration)
                .fill('[name="card_ccv"]', '123')
        })

        it('can process EUR transactions (Paypal)', function(done) {
            browser
                .select('[name="currency_type"]', 'EUR')
            submit()
                .then(function() {
                    expectSuccessfulPayment()
                })
                .finally(done)
        })

        it('can process SGD transactions (Braintree)', function(done) {
            browser
                .select('[name="currency_type"]', 'SGD')
            submit()
                .then(function() {
                    expectSuccessfulPayment()
                })
                .finally(done)
        })
    })
}

describe('server', function() {
    beforeEach(function() {
        server.run(port)
    })
    
    afterEach(function(done) {
        server.stop(done)
    })
    
    it('has gateways loaded', function() {
        expect(payment.gateways.length).toBe(2)
    })
    
    it("can't load route /asdf", function(done) {
        browser
            .visit('/asdf')
            .then(function() {
                throw new Error()
            })
            .error(function() {
                expect(browser.statusCode).toBe(404)
            })
            .finally(done)
    })
    
    it('can load route /', function(done) {
        browser
            .visit('/')
            .then(function() {
                browser.assert.success()
            })
            .finally(done)
    })
    
    function assertFormTag() {
        var elements = browser.queryAll('form')
        if(!elements.length)
            throw new Error('No form elements')
        expect(elements.length).toBe(1)
        expect(elements[0].getAttribute('method').toLowerCase()).toBe('post')
        browser.assert.attribute('form', 'action', '.')
    }
    
    describe('form usage', function() {
        beforeEach(function(done) {
            browser
                .visit('/')
                .then(function() {
                    browser.assert.success()
                    assertFormTag()
                })
                .finally(done)
        })
        
        afterEach(function() {
            assertFormTag()
        })
        
        it('has no error message on first load', function() {
            expect(browser.queryAll('.error').length).toBe(0)
        })
        
        it('displays an error upon posting an empty form', function(done) {
            browser
                .pressButton('input[type="submit"]')
                .then(function() {
                    browser.assert.element('.error')
                    expect(browser.text('.error')).toContain('required')
                })
                .finally(done)
        })
        
        it('keeps previously entered form data when submitting incomplete form', function(done) {
            browser
                .fill('[name="card_name"]', 'asdf')
                .select('[name="currency_type"]', 'SGD')
            submit()
                .then(function() {
                    browser.assert.element('.error')
                    browser.assert.attribute('[name="card_name"]', 'value', 'asdf')
                    browser.assert.attribute('[name="currency_type"]', 'value', 'SGD')
                })
                .finally(done)
        })
        
        payments()
    })
})
