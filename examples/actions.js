var Firgilio = require('../');
var ns = Firgilio.create();
var FRUITS = [ 'apple', 'pear', 'banana', 'melon' ];

//Defining an action.
Firgilio.defineAction(ns, 'getFruit', function(fruitId) {
    if (fruitId >= FRUITS.length) {
        throw new Error('404 fruit not found');
    }
    return FRUITS[fruitId];
});
console.log(ns);

//Calling an action.
ns.getFruit(0)
    .then(function(result) {
        console.log(result);    //=> 'apple'
    });

//Calling an action that throws an error results in a rejected promise.
ns.getFruit(100)
    .catch(function(err) {
        console.log(err.message);   //=> '404 fruit not found'
    });
