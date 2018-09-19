//  before
const mokes = require('./mokes');
const assert = mokes.assert;
const throws = mokes.throws;

//  main

console.info("\x1b[32m", "throw-http-code…", "\x1b[0m");

const HttpCode = require('../http-code');

(function () { // throw works

    assert(new HttpCode(), "should create instance of HttpCode");

    throws(function () {
        throw new HttpCode(400);
    }, HttpCode, "should throw an HttpCode");

})();

//  after