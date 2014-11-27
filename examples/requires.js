var Firgilio = require('../');
var ns = new Firgilio.create();
var assert = require('assert');

// Testing the require with explicit name
Firgilio.shareRequire(ns, 'foo', module.exports.foo = function foo() {
    return 'foo';
});
var test1 = ns.require$.foo();
console.log(test1); //=> 'foo'

// Testing the require with implicit name
Firgilio.shareRequire(ns, module.exports.asd = function asd() {
    return 'asd';
});
var test2 = ns.require$.asd();
console.log(test2); //=> 'asd'

// testing the require override
Firgilio.shareRequire(ns, module.exports.asd = function asd() {
    return 'asd2';
});
var test3 = ns.require$.asd();
console.log(test3); //=> 'asd'

