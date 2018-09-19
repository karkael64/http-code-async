//  before
const mokes = require('./mokes');
const assert = mokes.assert;
const should = mokes.should;

//  main

console.info("\x1b[32m", "page-builder…", "\x1b[0m" );

const Content = require('../answerable');

class HtmlPage extends Content {

    constructor(into) {
        super();
        this.into = into;
    }

    async getContent() {

        let param = null;
        await new Promise(function (resolve) {
            setTimeout(resolve, 10, 'param');
        }).then(function (arg) {
            param = arg;
        });
        return `<html>
<head>${param}</head>
<body>${this.into}</body>
</html>`;
    }
}

(async function(){

    let html = new HtmlPage("test");

    assert( html instanceof HtmlPage, "should be instance of HtmlPage" );
    assert( html instanceof Content, "should be instance of Content" );
    should( await html.getContent(), "<html>\n<head>param</head>\n<body>test</body>\n</html>", "should build html as expected");

})();

//  after