var Firgilio = require('../');
var options = {
    foo: 'bar'
};
var ns = Firgilio.baseNamespace(options);

//Getting the configuration in a module.
Firgilio.loadModule(ns, myModule);
function myModule(ctx, options) {
    console.log(options.foo);   //=> 'bar'
}
