/* global describe, it, beforeEach */
var Firgilio = require('../');

describe('Firgilio.registerError()', function() {
    var ns = null;
    beforeEach(function() {
        ns = Firgilio.create({
            logger: {
                streams: []
            }
        });
    });

    it('Can create an error with just a name', function() {
        Firgilio.registerError(ns, 'FooError');
        var error = new ns.FooError('test');
        error.name.must.be('FooError');
        error.stack.must.not.be.null();
        error.must.be.instanceof(Error);
    });

    it('Can create an error with a named function', function() {
        Firgilio.registerError(ns, function FooError(arg) {
            this.arg = arg;
        });
        var error = new ns.FooError('test');
        error.name.must.be('FooError');
        error.stack.must.not.be.null();
        error.must.be.instanceof(Error);
        error.arg.must.be('test');
    });

    it('Can create an error with a name and init function', function() {
        Firgilio.registerError(ns, 'FooError', function errorInit(arg) {
            this.arg = arg;
        });
        var error = new ns.FooError('test');
        error.name.must.be('FooError');
        error.stack.must.not.be.null();
        error.must.be.instanceof(Error);
        error.arg.must.be('test');
    });

    it('Cannot register an error with the same name twice', function() {
        function testFunc() {
            Firgilio.registerError(ns, 'FooError', function() {});
            Firgilio.registerError(ns, function FooError() {});
        }
        testFunc.must.throw(Firgilio.DuplicateErrorRegistrationError);
    });

    describe('Throws an error when called with wrong arguments', function() {
        var testCases = [
            [],
            [function() {}],
            ['']
        ];
        testCases.forEach(function(args) {
            function testFunc() {
                Firgilio.registerError(ns, args);
            }
            it('Called with ' + args.join(', '), function() {
                testFunc.must.throw(/called with invalid arguments/);
            });
        });
    });
});
