var Firgilio = require('../');
var ns = new Firgilio.create();

//Loading a module
Firgilio.loadModule(ns, myModule);
function myModule() {
    Firgilio.defineAction(this, 'answer', function() {
        return 42;
    });
}

//Calling an action loaded in a module.
ns.answer()
    .then(function(result) {
        console.log(result);    //=> 42
    });
