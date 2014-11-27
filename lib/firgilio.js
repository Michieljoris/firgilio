//#myfirgilio.js
//Bunyan is the logging framework we use.
var bunyan = require('bunyan');
var bluebird = require('bluebird');
// var nodeUtil = require('util');
var EventEmitter = require('events').EventEmitter;


var util = require('./util');
var errors = require('./errors');

var Firgilio;

function create(options) {
    options = options || {};
    util.validateArg('firgilio', 'options', options, 'object');

    var logOptions = options.logger || {};
    logOptions = util.extend({ level: 10, name: 'firgilio' }, logOptions);

    var ns = setPrototype({ path$: 'firgilio',
                            name$: 'firgilio',
                            log$: bunyan.createLogger(logOptions),
                            options$: options,
                            require$: {
                                bunyan: bunyan,
                                bluebird: bluebird
                            },
                            loadedModules$: {},
                            paths$: {}
                          }, { Promise: bluebird, util$: util });
    ns.baseFirgilio$ = ns;
    return ns;
}

// var myfirgilio = new EventEmitter();

function setPrototype(obj, proto) {
    var o = Object.create(proto);
    Object.keys(obj).forEach(function(prop) {
        o[prop] = obj[prop];
    });
    return o;
}

//## Namespaces

//Return namespace if it exists already, otherwise returns a freshly initialized
//namespace object with its prototype set to its parent
function retrieveNamespace(ctx, name, ctxPath) {
    //Check we're not overwriting an existing property.
    if (ctx.hasOwnProperty(name)) {
        if (ctxPath[name]) { return ctx[name]; }
        else { throw new Firgilio.IllegalNamespaceError(ctx.path$, name); }
    }
    var path$ = ctx.path$ + '.' + name;
    return setPrototype({
        path$: path$,
        parent$: ctx,
        name$: name,
        log$: ctx.log$.child({ context: path$  }) }, ctx);
}

//Returns an object at path in the ns object, creating the object and/or its
//parent objects if necessary;
function namespace(ns, path) {
    util.validateArg('namespace$', 'path', path, 'string');
    var namespaceStack = path.split('.').reverse();
    var paths = ns.paths$;
    function recur(ns, stack, path) {
        var el = stack.pop();
        if (!el) { return ns; }
        ns[el] = retrieveNamespace(ns, el, path);
        path[el] = path[el] || {};
        return recur(ns[el], stack, path[el]);
    }
    return recur(ns, namespaceStack, paths);
}

//##Base methods

//**loadModule** expects a direct reference to a Firgilio module.
//A Firgilio module is a function, which receives a single options object
//as argument and is bound to a firgilio instance (or namespace).
//A module's name is determined by the functions name.
//Only a single module with a certain name may be loaded.
//There is no limit on the amount of anonymous modules that may be loaded.
function loadModule(ctx, module) {
    util.validateArg('loadModule$', 'module', module, 'function');
    var moduleName = module.name;
    if (ctx.loadedModules$[moduleName]) {
        //This module is already loaded. Don't load it again.
        ctx.log$.info('Module `%s` already loaded.', moduleName);
        return Firgilio;
    } else if (moduleName) {
        //Save the module name, to prevent it from being loaded again.
        ctx.log$.info('Loading module: %s', moduleName);
        ctx.loadedModules$[moduleName] = true;
    }
    module.call(ctx, ctx, ctx.options$);
    return Firgilio;
}

//The handler passed to **defineAction** can be any function.
//This function can return a value or a promise.
function defineAction(ctx, path, handler) {
    if (typeof path === 'function') {
        //We're receiving a named function as single argument.
        handler = path;
        path = handler.name;
    }
    //Check that path is a non-empty string, and handler a function.
    util.validateArg('createAction', 'path', path || null, 'string');
    util.validateArg('createAction', 'handler', handler, 'function');
    var path$ = ctx.path$.split('.').slice(1).join('.');
    if (path$) { path$ += '.'; }
    var actionNamespace = namespace(ctx.baseFirgilio$, path$ + path); //FIX relying on
    //path$ being
    //present, maybe
    //turn ctx into
    //string to deref
    var boundHandler = handler.bind(actionNamespace);
    var action = handler.constructor.name === 'GeneratorFunction' ?
        bluebird.coroutine(boundHandler) :
        ctx.Promise.method(boundHandler);
    //The action can call itself recursively using `this.execute$()`.
    actionNamespace.execute$ = action;
    //Keep a reference to the action namespace for hacking.
    action.namespace$ = actionNamespace;
    //Replace the action name space with the function.
    actionNamespace.parent$[actionNamespace.name$] = action;
    return Firgilio;
}



//## Extension methods

//**extend** allows users to extend firgilio's default methods.
//It is called with the name of the method to extend and a replacement method.
function extend(ctx, methodName, replacementMethod) {
    if (typeof methodName === 'function') {
        //We're receiving a named function as single argument.
        replacementMethod = methodName;
        methodName = replacementMethod.name;
    }
    util.validateArg('extend$', 'methodName', methodName || null,
                           'string');
    util.validateArg('extend$', 'replacementMethod', replacementMethod,
                           'function');
    //Store a reference to the super method.
    var superMethod = ctx[methodName];
    replacementMethod.super$ = superMethod;
    ctx[methodName] = replacementMethod;
    return Firgilio;
}

//**shareRequire$** add a provided required package to the firgilio's requires
function shareRequire(ctx, name, package) {
    if (typeof name === 'function') {
        //We're receiving a named function as single argument.
        package = name;
        name = package.name;
    }
    //FIX no validateArg here?

    if (typeof package === 'function' || typeof package === 'object') {
        var sharedPackage = ctx.require$[name];
        if (sharedPackage) {
            ctx.baseFirgilio$.log$.info('Module %s is already registered',
                                        name);
        }
        ctx.require$[name] = sharedPackage || package;
    }
}

//Add custom errors
function registerError(ctx, name, init) {
    if (typeof name === 'function') {
        init = name;
        name = init.name;
    }
    util.validateArg('registerError', 'name', name || null, 'string');
    util.validateArg('registerError', 'init', init,
                           ['function', 'undefined']);
    if (ctx.baseFirgilio$[name]) {
        throw new Firgilio.DuplicateErrorRegistrationError(name);
    }
    ctx.baseFirgilio$[name] = util.createCustomError(name, init);
}

Firgilio = {
    create: create,
    baseNamespace: create,
    namespace: namespace,
    loadModule: loadModule,
    defineAction: defineAction,
    createAction: defineAction,
    extend: extend,
    shareRequire: shareRequire,
    registerError: registerError,
    bluebird: bluebird,
    bunyan: bunyan,
    util: util
};

Firgilio = util.extend(Firgilio, errors);

module.exports = Firgilio;

// var ns = Firgilio.create();

// function testFunc() {
//     ns.foo = {};
//     Firgilio.namespace(ns, 'foo');
// }
// try {

// testFunc();
// } catch(e) {
//     // console.log(ns.IllegalNamespaceError);
//     console.log(e instanceof Firgilio.IllegalNamespaceError);
// }
// console.log(Firgilio.DuplicateErrorRegistrationError);
// testFunc.must.throw(Firgilio.IllegalNamespaceError);
// var foo = Firgilio.namespace(ns, 'foo');
// console.log(foo);
// Firgilio.createAction(ns, foo, 'foo', function() {});
// // console.log(ns.Promise);
// Firgilio.createAction(ns, ns, 'foo', function() {});
// // console.log(Firgilio);
// try {
// // Firgilio.registerError(ns, 'FooError', function() {});
//     Firgilio.registerError(ns,[]);

// } catch (e) {
//     console.log(e);
//     // console.log(typeof Firgilio.DuplicateErrorRegistrationError);
// }
// Firgilio.registerError(ns, 'FooError');
// var error = ns.FooError('test');
// console.log(error);
// error.name.must.be('FooError');
// error.stack.must.not.be.null();
// error.must.be.instanceof(Error);
// ns.someFun = function() { return 'bar'; };
// Firgilio.extend(ns, function someFun(arg) {
//     return  arg + ns.someFun.super$();
// });

// console.log(ns.someFun('foo'));
// function pp(obj) {
//     console.log(nodeUtil.inspect(obj, {depth: 8, colors: true}));
// }

// console.log(new EventEmitter({a:1}));

// console.log(d.Promise);
// console.log(namespace(ns, ''));
// console.log(b.c);

// var ns = create();
// var a = namespace(ns, 'a');
// a.bla = 'bla';
// var b = namespace(ns, 'a.b');
// var c = namespace(ns, 'a.c');
// var d = namespace(ns, 'a.d');
// // o.parent$.parent$.log$.info("hello");
// // pp(ns);
// console.log(ns);

