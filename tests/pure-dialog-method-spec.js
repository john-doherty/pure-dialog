'use strict';

var nock = require('nock');
var jsdom = require('jsdom');
var path = require('path');

var document = null;
var window = null;

nock.disableNetConnect();

describe('pure-dialog methods', function () {

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

    it('should add [open] attribute when .show() is called', function(done) {

        var el = document.createElement('pure-dialog');

        el.addEventListener('pure-dialog-opened', function(e) {
            expect(this).toEqual(el);
            expect(e.target).toEqual(el);
            expect(e.target.getAttribute('open')).toEqual('true');
            expect(e.target.getAttribute('modal')).toBe(null);
            done();
        });

        el.show();
    });

    it('should add [open][modal] attributes when .showModal() is called', function(done) {

        var el = document.createElement('pure-dialog');

        el.addEventListener('pure-dialog-opened', function(e) {
            expect(this).toEqual(el);
            expect(e.target).toEqual(el);
            expect(e.target.getAttribute('open')).toBeDefined();
            expect(e.target.getAttribute('modal')).toBeDefined();
            done();
        });

        el.showModal();
    });

    it('should remove [open][modal] attributes when .close() is called', function(done) {

        var el = document.createElement('pure-dialog');

        el.addEventListener('pure-dialog-opened', function(e) {
            expect(this).toEqual(el);
            expect(e.target).toEqual(el);
            expect(e.target.getAttribute('open')).toBeDefined();
            expect(e.target.getAttribute('modal')).toBeDefined();
            e.target.close();
        });

        el.addEventListener('pure-dialog-closed', function(e) {
            expect(this).toEqual(el);
            expect(e.target).toEqual(el);
            expect(e.target.getAttribute('open')).toBe(null);
            expect(e.target.getAttribute('modal')).toBe(null);
            done();
        });

        el.showModal();
    });

    it('should add to DOM when .appendToDOM() is called', function() {

        var el = document.createElement('pure-dialog');

        expect(el.parentElement).toBe(null);
        el.appendToDOM();

        expect(el.parentElement).not.toBe(null);
        expect(el.parentElement.tagName).toBe('BODY');
    });

    it('should remove element from DOM when .remove() is called', function() {

        var el = document.createElement('pure-dialog');

        el.appendToDOM();

        expect(el.parentElement).not.toBe(null);
        expect(el.parentElement.tagName).toBe('BODY');

        el.remove();

        expect(el.parentElement).toBe(null);
    });

});
