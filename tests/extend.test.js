/* global describe, it, beforeEach */
// var format = require('util').format;
var Firgilio = require('../');

describe('Firgilio.extend()', function() {
    var ns = null;
    beforeEach(function(done) {
        ns = Firgilio.create({
            logger: {
                streams: []
            }
        });
        done();
    });
    
    it('Can call extend with a named function', function () {
        ns.someFun = function() { return 'bar'; };
        Firgilio.extend(ns, function someFun(arg) {
            return  arg + ns.someFun.super$();
        });
        ns.someFun('foo').must.equal('foobar');
    });

    it('Can call extend with a seperate name and function', function() {
        ns.someFun = function() { return 'bar'; };
        Firgilio.extend(ns, 'someFun', function (arg) {
            return  arg + ns.someFun.super$();
        });
        ns.someFun('foo').must.equal('foobar');
    });

    describe('Throws an error when called with wrong arguments', function() {
        var testCases = [
            [],
            [function() {}],
            ['']
        ];
        testCases.forEach(function(args) {
            function testFunc() {
                Firgilio.extend(ns, args);
            }
            it('Called with ' + args.join(', '), function() {
                testFunc.must.throw(/called with invalid arguments/);
            });
        });
    });
});
