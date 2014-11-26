var assert = require('assert');
var util = require('util');

//**extend** shallowly extends a base object with the properties of one or
//more other objects. Inspired by underscore.
function extend( obj /*, obj2, obj3, ... */) {
    var extensions = Array.prototype.slice.call(arguments, 1);
    return extensions.reduce(function(p, n){
        Object.keys(n).forEach(function(property) {
            p[property] = n[property];
        } );
        return p;
    }, obj);
}

//**createCustomError** returns the constructor for a custom error type.
function createCustomError(name, msgFn) {
    assert(name, 'You are trying to register an invalid error');
    return function() {
        var stack = Error().stack.split('\n').slice(3).join('\n');
        return {name: name,
                message: msgFn ? msgFn.apply(null, arguments): arguments[0],
                stack: stack };
    };
}

var InvalidArgumentsError = createCustomError(
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
        var error =  InvalidArgumentsError(methodName, argName, types);
        throw error;
    }
}

exports.extend = extend;
exports.createCustomError = createCustomError;
exports.validateArg = validateArg;


// try {
//     validateArg('bla', 'argname', null, 'string');
// } catch(e) {
//     console.log(e);
// }
