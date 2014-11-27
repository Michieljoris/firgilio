// Copyright (C) 2014 IceMobile Agency B.V.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global describe, it, beforeEach */
var Firgilio = require('../');

describe('Firgilio.loadModule()', function() {
    var ns = null;
    var firgilioOptions = {
        logger: {
            streams: []
        }
    };
    
    beforeEach(function() {
        ns = Firgilio.create(firgilioOptions);
    });

    it('loads a named module only once', function() {
        var executeCount = 0;
            function testModule() {
                executeCount++;
            }
        Firgilio
            .loadModule(ns, testModule)
            .loadModule(ns, testModule);
        executeCount.must.equal(1);
    });

    it('gets access to the options object', function(done) {
        Firgilio.loadModule(ns, function(ctx, moduleOptions) {
            moduleOptions.must.be(firgilioOptions);
            done();
        });
    });

    describe('it throws an error when loading an invalid module', function() {
        var nonModules = [{}, [1, 2], null, void(0), 'test', /test/];
        nonModules.forEach(function(nonModule) {
            it('throws an error when loading: ' + nonModule, function() {
                var testFunction = function() {
                    Firgilio.loadModule(ns, nonModule);
                };
                testFunction.must.throw(/called with invalid arguments/);
            });
        });
    });
});
