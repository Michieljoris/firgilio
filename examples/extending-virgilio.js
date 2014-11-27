var Firgilio = require('../');
var ns = new Firgilio.create();


//This is not implemented to Firgilio for Firgilio methods since they are not attached to instance. It is possible to do this for any methods attached a namespace object though. 

//Extending a firgilio method.
Firgilio.extend(function defineAction(ctx, actionName, func) {
    var newActionName = 'super' + actionName;
    return defineAction.super$.call(this, ctx, newActionName, func);
});

//Calling an extended firgilio method.
ns.defineAction$(function foo() {});
console.log(typeof ns.foo);       //=> 'undefined'
console.log(typeof ns.superfoo);  //=> 'function'
