var PassThrough = require('stream').PassThrough;
var logStream = new PassThrough();

var Firgilio = require('../');
var options = {
    logger: {
        name: 'blastream',
        streams: [{
            stream: logStream,
            level: 'info'
        }]
    }
};
var ns = new Firgilio.baseNamespace(options);

//Log a message from an action on a namespace.
Firgilio.defineAction(ns, 'parrot.talk', function(line) {
    this.log$.info(line);
});

logStream.on('data', function(chunk) {
    var log = JSON.parse(chunk.toString());
    console.log(log.name);      //=> 'blastream'
    console.log(log.context);   //=> 'firgilio.parrot.talk'
    console.log(log.msg);       //=> 'Hi there!'
});

ns.parrot.talk('Hi there!');
