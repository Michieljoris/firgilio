var Firgilio = require('../');
var ns = new Firgilio.create();

//Defining and calling a recursive action.
Firgilio.defineAction(ns, 'factorial', function(number) {
    if (number <= 1) {
        return 1;
    }
    return this.execute$(number - 1).then(function(result) {
        return result * number;
    });
});

ns.factorial(3)
    .then(function(result) {
        console.log(result);    //=> 6
    });
