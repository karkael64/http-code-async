//  before
const mokes = require('./mokes');
const should = mokes.should;

//  main

console.info("\x1b[32m", "default-settings…", "\x1b[0m");

const HttpCode = require('../http-code');

(function () { // default settings

    let code = new HttpCode();

    should(code.getCode(), 500, "should returns 500 as default code");
    should(code.getMessage(), "An unexpected condition was encountered and no specific message is suitable. Please try again or contact administrator.", "should have default message");
    should(code.getTitle(), "Internal Server Error", "should title internal server error");
    should(code.getPrevious(), null, "should not have any previous");
    should(code.getCookiesToString(), "", "should not have set cookies");
    should(JSON.stringify(code.getHeaders()), "{}", "should not have set headers");

})();

//  after