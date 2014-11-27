var Firgilio = require('../');
var ctx = Firgilio.create();

//Defining a simple error.
Firgilio.registerError(ctx, 'FooError');
var fooError = new ctx.FooError('foo!');
console.log(fooError.name);     //=> 'FooError'
console.log(fooError.message);  //=> 'foo!'

//Defining an error with a custom constructor.
Firgilio.registerError(ctx, function DivideByZeroError(number) {
    this.message = 'Can`t divide ' + number + ' by zero.';
    this.failingNumber = number;
});
var divideByZeroError = new ctx.DivideByZeroError(5);
console.log(divideByZeroError.message);         //=> 'Can`t divide 5 by zero.'
console.log(divideByZeroError.failingNumber);   //=> 5
