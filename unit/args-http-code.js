//  before
const mokes = require('./mokes');
const should = mokes.should;

//  main

console.info("\x1b[32m", "args-http-code…", "\x1b[0m");

const HttpCode = require('../http-code');

(function () { // set arguments

    let err = new Error('test', 14), code = new HttpCode(204, "any", err);

    should(code.getCode(), 204, "should return code 204");
    should(code.getTitle(), "No Content", "should return good title");
    should(code.getPrevious(), err, "should return inserted error");

    should(code.getMessage(), "This file has no content and can't be displayed.", "should have default message");
    HttpCode.DEBUG_MODE = true;
    should(code.getMessage(), "HttpCode (204): any", "should return inserted message at instance");
    HttpCode.DEBUG_MODE = false;

    should(code.setCookie("token", "you123"), code, "should return himself");
    should(code.getCookiesToString(), "token=you123", "should set cookie");

    code.setCookie({"tokenbis": "you&é\"'(-è123"});
    should(code.getCookiesToString(), "token=you123; tokenbis=you&é\"'(-è123", "should set second cookie");

    should(code.setHeader("Accept", "*/*"), code, "should return himself");
    should(JSON.stringify(code.getHeaders()), '{"Accept":"*/*"}', "should set header");

    code.setHeader({"Connection": "keep-alive"});
    should(JSON.stringify(code.getHeaders()), '{"Accept":"*/*","Connection":"keep-alive"}', "should set header");

})();

//  after