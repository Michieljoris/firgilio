var Firgilio = require('../');
var ns = Firgilio.baseNamespace();

//Loading a module on a namespace.
var answers = Firgilio.namespace(ns, 'answers');
Firgilio.loadModule(answers, myModule);
function myModule(ctx) {
    Firgilio.defineAction(ctx, 'ultimate', function() {
        return 42;
    });
}

//Calling an action loaded in a module on a namespace.
answers.ultimate()
    .then(function(result) {
        console.log(result);    //=> 42
    });
