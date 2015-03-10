'use strict'

var phantom = require('phantom')


describe('server', function() {
    var phantomInstance
    var page
    
    beforeEach(function(done) {
        console.log(1)
        phantom.create(function(ph) {
            console.log(2)
            phantomInstance = ph
            ph.createPage(function(pg) {
                console.log(3)
                page = pg
                page.onConsoleMessage(function(msg) { console.log(msg); });
                done()
            })
        })
    })

    afterEach(function() {
        phantomInstance.exit()
    })

    it('can open google.com with phantom-jasmine', function(done) {
        console.log(4)
        page.open("http://www.google.com", function(status) {
            console.log("opened google? ", status)
            page.evaluate(function () {
                return document.title
            }, function(result) {
                console.log('Page title is ' + result)
                done()
            })
        })
    })
})

