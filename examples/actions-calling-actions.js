var Firgilio = require('../');
var ns = Firgilio.create();

//Defining actions through chaining.
var foo = Firgilio.namespace(ns, 'foo');
Firgilio.defineAction(foo, function add(num1, num2) {
        return num1 + num2;
    });

Firgilio.defineAction(foo, function subtract(num1, num2) {
        return this.add(num1, -num2);
        // return foo.add(num1, -num2);
    });

//Calling an action that calls another action.
ns.foo.subtract(5, 2)
    .then(function(result) {
        console.log(result);    //=> 3
    });


