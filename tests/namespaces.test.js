/* global describe, it, beforeEach */
var Firgilio = require('../');

describe('Firgilio.prototype.namespace$()', function() {
    var ns = null;
    beforeEach(function() {
        ns = Firgilio.create({
            logger: {
                streams: []
            }
        });
    });

    it('can reuse names in a namespace-chain', function() {
        Firgilio.namespace(ns, 'fooz.fooz');
        ns.fooz.fooz.must.exist();
        ns.fooz.must.not.be(ns.fooz.fooz);
    });

    it('can give an action the name of a namespace', function() {
        var fooz = Firgilio.namespace(ns, 'fooz');
        Firgilio.createAction(fooz, 'fooz', function() {});
        ns.fooz.fooz.must.exist();
        //Firgilio.fooz is a namespace.
        // ns.fooz.must.be.instanceof(Firgilio);
        ns.fooz.name$.must.exist();
        //Firgilio.fooz.fooz is an action.
        ns.fooz.fooz.must.be.a.function();
    });

    it('will not overwrite with a namespace an existing property', function() {
        function testFunc() {
            ns.foo = {};
            Firgilio.namespace(ns, 'foo');
        }
        testFunc.must.throw(Firgilio.IllegalNamespaceError);
    });

    describe('Throws an error when called with wrong arguments', function() {
        var testCases = [
            [],
            [{}],
            [function() {}],
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
