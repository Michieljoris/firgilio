/* global describe, it */
var Firgilio = require('../');

describe('Firgilio.namespace()', function() {

    var ns = null;
    beforeEach(function() {
        ns = Firgilio.create({
            logger: {
                streams: []
            }
        });
    });

    describe('Throws an error when called with wrong arguments', function() {
        var testCases = [
            ['foo'],
            [function() {}]
        ];
        
        testCases.forEach(function(args) {
            function testFunc() {
                Firgilio.namespace(ns, args);
            }
            it('Called with ' + args.join(', '), function() {
                testFunc.must.throw(/called with invalid arguments/);
            });
        });
    });
});
