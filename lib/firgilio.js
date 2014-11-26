//#myvirgilio.js
//Bunyan is the logging framework we use.
var bunyan = require('bunyan');
var Promise = require('bluebird');
var nodeUtil = require('util');
var EventEmitter = require('events').EventEmitter;

var util = require('./util');
var errors = require('./errors');

function create(options) {
    options = options || {};
    util.validateArg('Virgilio', 'options', options, 'object');

    var logOptions = options.logger || {};
    util.extend({ level: 10, name: 'virgilio' }, logOptions);

    var obj = Object.create({ Promise: Promise, util$: util });
    return util.extend(
        obj,
        { path$: 'virgilio',
          name$: 'virgilio',
          log$: bunyan.createLogger(logOptions),
          options$: options,
          require$: {
              bunyan: bunyan,
              bluebird: Promise
          },
          baseVirgilio$: obj
        });
}

// var myvirgilio = new EventEmitter();

//##Base methods

//**loadModule** expects a direct reference to a Virgilio module.
//A Virgilio module is a function, which receives a single options object
//as argument and is bound to a virgilio instance (or namespace).
//A module's name is determined by the functions name.
//Only a single module with a certain name may be loaded.
//There is no limit on the amount of anonymous modules that may be loaded.
var loadModule = (function() {
    var loadedModules = {};
    return function loadModule(ctx, module) {
        util.validateArg('loadModule$', 'module', module, 'function');
            var moduleName = module.name;
        if (loadedModules$[moduleName]) {
            //This module is already loaded. Don't load it again.
            ctx.log$.info('Module `%s` already loaded.', moduleName);
            return ctx;
        } else if (moduleName) {
            //Save the module name, to prevent it from being loaded again.
            ctx.log$.info('Loading module: %s', moduleName);
            loadedModules[moduleName] = true;
        }
        module.call(ctx, ctx.options$);
        return ctx;
    };
}());

//The handler passed to **defineAction** can be any function.
//This function can return a value or a promise.
function createAction(ctx, path, handler) {
    if (typeof path === 'function') {
        //We're receiving a named function as single argument.
        handler = path;
        path = handler.name;
    }
    //Check that path is a non-empty string, and handler a function.
    util.validateArg('defineAction$', 'path', path || null, 'string');
    util.validateArg('defineAction$', 'handler', handler, 'function');
    var actionNamespace = namespace(ctx.path$ + '.' + path); //FIX relying on
    //path$ being
    //present, maybe
    //turn ctx into
    //string to deref
    var boundHandler = handler.bind(actionNamespace);
    var action = handler.constructor.name === 'GeneratorFunction' ?
        Promise.coroutine(boundHandler) :
        ctx.Promise.method(boundHandler);
    //The action can call itself recursively using `this.execute$()`.
    actionNamespace.execute$ = action;
    //Keep a reference to the action namespace for hacking.
    action.namespace$ = actionNamespace;
    //Replace the action name space with the function.
    actionNamespace.parent$[actionNamespace.name$] = action;
    return action;
};

//## Namespaces

//Return namespace if it exists already, otherwise returns a freshly initialized namespace object with its prototype set to its parent.
function retrieveNamespace(ctx, name, ctxPath) {
    //Check we're not overwriting an existing property.
    if (ctx.hasOwnProperty(name)) {
        if (ctxPath[name]) return ctx[name];
        else throw new errors.IllegalNamespaceError(ctx.path$, name);
    }

    var path$ = ctx.path$ + '.' + name;
    var obj = Object.create(ctx);
    return util.extend(
        obj,
        { path$: path$,
          parent$: ctx,
          name$: name,
          log$: ctx.log$.child({ context: path$  }) } );
}

//Returns an object at path in the ns object, creating the object and/or its
//parent objects if necessary;
var namespace = (function() {
    paths = {};
    function namespace(ns, path) {
        util.validateArg('namespace$', 'path', path, 'string');
            var namespaceStack = path.split('.').reverse();
        function recur(ns, stack, path) {
            var el = stack.pop();
            if (!el) return ns;
            ns[el] = retrieveNamespace(ns, el, path);
            paths[el] = paths[el] || {};
            return recur(ns[el], stack, path[el]);
        }
        return recur(ns, namespaceStack, paths);
    }
}());


//## Extension methods

//**extend** allows users to extend virgilio's default methods.
//It is called with the name of the method to extend and a replacement method.
function extend$(ctx, methodName, replacementMethod) {
    if (typeof methodName === 'function') {
        //We're receiving a named function as single argument.
        replacementMethod = methodName;
        methodName = replacementMethod.name;
    }
    this.util$.validateArg('extend$', 'methodName', methodName || null,
                           'string');
    this.util$.validateArg('extend$', 'replacementMethod', replacementMethod,
                           'function');
    //Store a reference to the super method.
    var superMethod = ctx[methodName];
    replacementMethod.super$ = superMethod;
    ctx[methodName] = replacementMethod;
    return ctx;
};

//**shareRequire$** add a provided required package to the virgilio's requires
function shareRequire(ctx, name, package) {
    if (typeof name === 'function') {
        //We're receiving a named function as single argument.
        package = name;
        name = package.name;
    }
    //FIX no validateArg here?

    if (typeof package === 'function' || typeof package === 'object') {
        var sharedPackage = ctx.require$[name];
        if (sharedPackage)
            ctx.baseVirgilio$.log$.info('Module %s is already registered',
                                         name);
        ctx.require$[name] = sharedPackage || package;
    }
};

//Add custom errors
function registerError$(ctx, name, init) {
    if (typeof name === 'function') {
        init = name;
        name = init.name;
    }
    util.validateArg('registerError$', 'name', name || null, 'string');
    util.validateArg('registerError$', 'init', init,
                           ['function', 'undefined']);
    if (ctx.baseVirgilio$[name]) {
        throw new errors.DuplicateErrorRegistrationError(name);
    }
    ctx.baseVirgilio$[name] = util.createCustomError(name, init);
};

module.exports = {
    create: create,
    namespace: namespace,
    loadModule: loadModule,
    bluebird: Promise,
    bunyan: bunyan,
    util: util
};

function pp(obj) {
    console.log(nodeUtil.inspect(obj, {depth: 8, colors: true}));
}

console.log(new EventEmitter({a:1}));

console.log(d.Promise);
console.log(namespace(ns, ''));
console.log(b.c);

var ns = init();
var a = namespace(ns, 'a');
a.bla = 'bla';
var b = namespace(ns, 'a.b');
var c = namespace(ns, 'a.c');
var d = namespace(ns, 'a.d');
// o.parent$.parent$.log$.info("hello");
// pp(ns);
console.log(ns);
// console.log(myvirgilio);
pp(paths);
