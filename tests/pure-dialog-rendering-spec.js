'use strict';

var nock = require('nock');
var jsdom = require('jsdom');
var path = require('path');

var document = null;
var window = null;

nock.disableNetConnect();

describe('pure-dialog rendering', function () {

    // create a new browser instance before each test
    beforeEach(function (done) {

        nock('http://localhost:8080')
            .get('/polyfills/document-register-element.js')
            .replyWithFile(200, path.resolve('./polyfills/document-register-element.js'))
            .get('/src/pure-dialog.js')
            .replyWithFile(200, path.resolve('./src/pure-dialog.js'));

        var virtualConsole = new jsdom.VirtualConsole();

        var options = {
            url: 'http://localhost:8080',
            contentType: 'text/html',
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole: virtualConsole.sendTo(console) // redirect browser output to terminal
        };

        // load test page from disk (includes links to dependent scripts)
        jsdom.JSDOM.fromFile(path.resolve(__dirname, 'test-page.html'), options).then(function(dom) {

            // expose the window/document object to tests
            window = dom.window;
            document = window.document;

            // slight wait to allow scripts to load
            setTimeout(function() {
                expect(document).toBeDefined();
                expect(document.title).toBe('Pure Dialog: Test Page');
                expect(document.registerElement).toBeDefined();
                done();
            }, 250);
        });
    });

    it('should only 1 title', function() {

        var title1 = 'Title1-' + (new Date()).getTime();
        var title2 = 'Title2-' + (new Date()).getTime();

        var el = document.createElement('pure-dialog');

        el.title = title1;
        el.title = title2;

        expect(el.querySelector('.pure-dialog-title').textContent).toBe(title2);
        expect(el.querySelectorAll('.pure-dialog-title').length).toBe(1);
    });

});
