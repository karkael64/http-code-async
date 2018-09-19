const mokes = require('./mokes');

console.info("\x1b[1m\x1b[32m", "start tests", "\x1b[0m" );

require('./page-builder');
require('./throw-http-code');
require('./default-settings');
require('./args-http-code');
require('./contents');

setTimeout(function(){
    console.info("\x1b[1m\x1b[32m", "done", mokes.count(), "\x1b[0m" );
}, 100);
