A first draft rewrite of [virgilio](https://github.com/icemobilelab/virgilio) at icemobilabs in a bit more functional style. No more prototype, this and new to emulate classes, but use of closures and pure functions.

Prototype is still being used to link namespaces.

All examples and tests are working, but of course modified to a functional style.

The whole code is shorter by about 50 lines. The errors code could benefit from getting rid of all the prototype and constructor wrangling, but I made it work to pass the tests.

What follows is copied from the Virgilio repository, adapted for Firgilio.

<a href="https://github.com/michiejoris/firgilio"><img src="https://raw.githubusercontent.com/michieljoris/firgilio/master/images/firgilio.png" align="center"  height="300" width="600"/></a>

# Firgilio
[![wercker status](https://app.wercker.com/status/69a7f421e9d59612238df4e8af206558/s/master "wercker status")](https://app.wercker.com/project/bykey/69a7f421e9d59612238df4e8af206558)
[![NPM version](https://badge.fury.io/js/firgilio.svg)](http://badge.fury.io/js/firgilio)

Firgilio is a tiny framework helping you write modular applications.
Start your project in a single file, then scale upwards as needed.
No refactoring needed.

* [Features](#features)
* [Getting Started](#getting-started)
* [Examples](https://github.com/michieljoris/firgilio/tree/master/examples)
* [API Reference](https://github.com/michieljoris/firgilio/wiki/API)
* [Development](https://github.com/michieljoris/firgilio/wiki/Development)
* [More Tags](#more-tags)

## Features

### Focus on writing code - not organising code
Build your application out of actions, small functions with a specific responsibility.
Move your actions about the project as development progresses without having to  wory about having to refactor.
Use namespaces to oranise your actions, and rest save in the knowledge that they will always return a promise.

### Extend it in any way you like
At less than a 100 lines of actual code, the main library is tiny and we aim to keep it that way.
Additional functionality goes into extensions, which you are free to use or not use as you see fit.
Mix Firgilio-extensions with your own favourite libraries any way you want.

## Getting Started
Get Firgilio from npm.

```js
npm install firgilio
```

Then start defining actions.

```js
Firgilio = require('firgilio');
var ns = new Firgilio.baseNamespace();
Firgilio.defineAction(ns, 'number.add', function add(num1, num2) {
    return num1 + num2;
});

ns.number.add(3, 6).then(function(result) {
    console.log(result);    //=> 9
});
```

## More tags
[![Code Climate](https://codeclimate.com/github/michieljoris/firgilio/badges/gpa.svg)](https://codeclimate.com/github/michieljoris/firgilio)
[![Test Coverage](https://codeclimate.com/github/michieljoris/firgilio/badges/coverage.svg)](https://codeclimate.com/github/michieljoris/firgilio)
[![Dependency Status](https://gemnasium.com/michieljoris/firgilio.svg)](https://gemnasium.com/michieljoris/firgilio)

We dedicate this Library to the ServiceRegistrar, the EigenServices and the PuppetDresser.
