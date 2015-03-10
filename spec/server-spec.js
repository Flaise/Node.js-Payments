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
        browser.visit('/asdf')
            .then(function() {
                throw new Error()
            })
            .error(function() {
                expect(browser.statusCode).toBe(404)
            })
            .finally(done)
    })
    
    it('can load route /', function(done) {
        browser.visit('/')
            .then(function() {
                browser.assert.success()
            })
            .finally(done)
    })
    
    function assertFormTag() {
        var elements = browser.queryAll('form')
        expect(elements.length).toBe(1)
        expect(elements[0].getAttribute('method').toLowerCase()).toBe('post')
        browser.assert.attribute('form', 'action', '.')
    }

    describe('form usage', function() {
        beforeEach(function(done) {
            browser.visit('/')
                .then(function() {
                    browser.assert.success()
                    assertFormTag()
                })
                .finally(done)
        })

        afterEach(function() {
            assertFormTag()
        })
        
        it('has no error message', function() {
            expect(browser.queryAll('.error').length).toBe(0)
        })
        
    })
    
})
