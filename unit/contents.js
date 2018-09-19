//  before
const mokes = require('./mokes');
const should = mokes.should;
const IncomingMessage = mokes.IncomingMessage;

//  main

console.info("\x1b[32m", "contents…", "\x1b[0m");

const HttpCode = require('../http-code');

(async function () { // get contents for each formats

    let err = new Error('test', 14),
        code = new HttpCode(204, "any", err),
        req = new IncomingMessage('GET', '/test.html');

    should(await code.getContent(req), "<h1>204 - No Content</h1>\n<p>This file has no content and can't be displayed.</p>\n",
        "should return standard message html");
    should(JSON.stringify(await code.getContentJSON()), "{\"code\":204,\"title\":\"No Content\",\"message\":\"This file has no content and can't be displayed.\"}",
        "should return standard message json");
    should(await code.getContentPlain(), "204 - No Content\nThis file has no content and can't be displayed.\n",
        "should return standard message plain");

    HttpCode.DEBUG_MODE = true;

    should((await code.getContent(req)).indexOf(
        "<h1>204 - No Content</h1>\n<pre>HttpCode (204): any</pre>\n<pre>at new HttpCode (/home/vcourtin/wks/src/http-code-async/http-code.js:68:9)\n"),
        0, "should be formatted html and return this");
    should(JSON.stringify(await code.getContentJSON()).indexOf(
        "{\"code\":204,\"title\":\"No Content\",\"message\":\"HttpCode (204): any\",\"trace\":[\"at new HttpCode (/home/vcourtin/wks/src/http-code-async/http-code.js:68:9)\","),
        0, "should be formatted json and return this");
    should((await code.getContentPlain()).indexOf(
        "204 - No Content\nHttpCode (204): any\nat new HttpCode (/home/vcourtin/wks/src/http-code-async/http-code.js:68:9)\nat" ),
        0, "should be formatted plain and return this");

    HttpCode.DEBUG_MODE = false;

})();

//  after