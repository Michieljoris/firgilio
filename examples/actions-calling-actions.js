var Virgilio = require('../');
var virgilio = new Virgilio();

//Defining actions through chaining.
virgilio.namespace$('bla')
    .defineAction$(function add(num1, num2) {
        console.log('aaaa',this);
        return num1 + num2;
    })
    .defineAction$(function subtract(num1, num2) {
        return this.add(num1, -num2);
    });

//Calling an action that calls another action.
virgilio.bla.subtract(5, 2)
    .then(function(result) {
        console.log(result);    //=> 3
    });


console.log(virgilio);
