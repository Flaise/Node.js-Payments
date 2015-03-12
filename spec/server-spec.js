'use strict'

var phantom = require('phantom')
var Browser = require('zombie')
var server = require('../server')


var port = 9001
Browser.localhost('bunnies.com', port)
var browser = new Browser()

describe('server', function() {
    beforeEach(function() {
        server.run(port)
    })

    afterEach(function(done) {
        server.stop(done)
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
                    browser.assert.text('.error', 'required')
                })
                .finally(done)
        })
        
        it('keeps previously entered form data when submitting incomplete form', function(done) {
            browser
                .fill('[name="card_name"]', 'asdf')
                .select('[name="currency_type"]', 'SGD')
                .pressButton('input[type="submit"]')
                .then(function() {
                    browser.assert.element('.error')
                    browser.assert.attribute('[name="card_name"]', 'value', 'asdf')
                    browser.assert.attribute('[name="currency_type"]', 'value', 'SGD')
                })
                .finally(done)
        })
    })
})
