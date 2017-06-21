'use strict';

var nock = require('nock');
var jsdom = require('jsdom');
var path = require('path');

var document = null;
var window = null;

nock.disableNetConnect();

describe('pure-dialog interface', function () {

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

    it('should be creatable', function () {

        var el = document.createElement('pure-dialog');

        expect(el).toBeDefined();
        expect(el.tagName).toEqual('PURE-DIALOG');
    });

    it('should expose properties with correct types', function() {

        var el = document.createElement('pure-dialog');

        expect(typeof el.title).toEqual('string');
        expect(typeof el.buttons).toEqual('string');
        expect(typeof el.closeButton).toEqual('boolean');
    });

    it('should expose properties with correct defaults', function() {

        var el = document.createElement('pure-dialog');

        expect(el.title).toEqual('');
        expect(el.innerHTML).toEqual('');
        expect(el.buttons).toEqual('');
        expect(el.closeButton).toEqual(false);
    });

    it('should expose correct public methods', function() {

        var el = document.createElement('pure-dialog');

        expect(typeof el.show).toEqual('function');
        expect(typeof el.showModal).toEqual('function');
        expect(typeof el.close).toEqual('function');
        expect(typeof el.appendToDOM).toEqual('function');
        expect(typeof el.remove).toEqual('function');
    });

    it('should not expose private methods', function() {

        var el = document.createElement('pure-dialog');

        expect(el.renderBody).not.toBeDefined();
        expect(el.renderTitle).not.toBeDefined();
        expect(el.renderButtons).not.toBeDefined();
        expect(el.renderCloseButton).not.toBeDefined();
        expect(el.removeElementBySelector).not.toBeDefined();
        expect(el.createEl).not.toBeDefined();
        expect(el.stringToDOM).not.toBeDefined();
    });

});
