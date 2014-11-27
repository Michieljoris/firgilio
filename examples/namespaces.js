var Firgilio = require('../');
var ns = Firgilio.create();

//Defining actions on namespaces.
Firgilio.defineAction(ns, 'animal.human.speak', function() {
    return 'Hello world!';
});

Firgilio.defineAction(ns.animal, 'eat', function(food) {
    this.log$.info('Eating ' + food);
    return 'Om nom nom.';
});

var plant = Firgilio.namespace(ns, 'plant');
Firgilio.defineAction(plant, 'photosynthesis',
                                            function(light) {
    return light ? 'C6H1206' : 'Zzzzzzz';
});

//Calling an action on a namespace.
ns.animal.human.speak()
    .then(function(result) {
        console.log(result);    //=> 'Hello world!'
    });

//Calling an action on a lower namespace.
ns.animal.human.eat('apple')
    .then(function(result) {
        console.log(result);    //=> 'Om nom nom.'
    });

//Calling an action on a sibling namespace fails.
try {
    ns.animal.photosynthesis();
}
catch(err) {
    console.log(err instanceof TypeError);  //=> true
}
