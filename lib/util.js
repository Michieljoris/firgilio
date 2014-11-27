var assert = require('assert');
var util = require('util');

//**extend** shallowly extends a base object with the properties of one or
//more other objects. Inspired by underscore.
function extend( /*, obj2, obj3, ... */) {
    var extensions = Array.prototype.slice.call(arguments, 0);
    return extensions.reduce(function(p, n){
        Object.keys(n).forEach(function(property) {
            p[property] = n[property];
        } );
        return p;
    }, {});
}

//**createCustomError** returns the constructor for a custom error type.
function createCustomError(name, msgFn) {
    assert(name, 'You are trying to register an invalid error');
    function ErrorConstructor() {
        // console.log(this.constructor);
        if (this.constructor !== Error) {
            var newObj = Object.create(ErrorConstructor.prototype);
            var ret = ErrorConstructor.apply(newObj, arguments);
            ret.stack = ret.stack.split('\n').slice(1).join('\n');
            // Some constructors return a value; make sure to use it!
            return ret !== undefined ? ret: newObj;
        }
        var e = Error();
        this.name = name;
        var message = msgFn ? msgFn.apply(this, arguments): arguments[0];
        if (!this.message) this.message = message;
        this.stack = e.stack.split('\n').slice(3).join('\n');
        return this;
        }
    ErrorConstructor.prototype = new Error();
    return ErrorConstructor;
}

var invalidArgumentsError = createCustomError(
    'InvalidArgumentsError',
    function(method, argName, argType) {
        var message = [
            '%s() called with invalid arguments.',
            '%s should be a %s.'
        ].join(' ');
        argType = util.isArray(argType) ? argType.join('/') : argType;
        return util.format(message, method, argName, argType);
    }
);

function validateArg(methodName, argName, arg, types) {
    if (!util.isArray(types)) {
        types = [types];
    }
    if (types.indexOf(typeof arg) === -1) {
        var error =  invalidArgumentsError(methodName, argName, types);
        throw error;
    }
}

exports.extend = extend;
exports.createCustomError = createCustomError;
exports.validateArg = validateArg;

// var t = {
//     e: invalidArgumentsError
// };
// var error =  new t.e('mname', 'aname', ['string']);
// console.log(error instanceof invalidArgumentsError);
// console.log(error instanceof Error);
// console.log(error.stack);

// error =  t.e('mname', 'aname', ['string']);
// console.log(error instanceof invalidArgumentsError);
// console.log(error instanceof Error);
// console.log(error.stack);
// try {
//     validateArg('bla', 'argname', null, 'string');
// } catch(e) {
//     console.log(e);
// }

// var bla = function () {
// };

// var e;
// e = Object.create(new bla());


// console.log(e.constructor.name);
// console.log(e instanceof bla);

// var NotImplementedError = function(message) {
//     this.name = 'NotImplementedError';
//     this.message = message;
//     this.stack = (new Error()).stack;
// };

// // Later on...

// e = new NotImplementedError();

// console.log(e instanceof NotImplementedError);
