const Error = require('./error');

function is_object(el) {
    return (typeof el === 'object') && (el !== null);
}

const httpCode = {
    200: {
        "title": "OK",
        "message": "Hello World!"
    },
    204: {
        "title": "No Answerable",
        "message": "This file has no content and can't be displayed."
    },
    304: {
        "title": "Not Modified",
        "message": "This file is not modified since your last request."
    },
    307: {
        "title": "Temporary Redirect",
        "message": "The server redirected page to another link."
    },
    308: {
        "title": "Permanent Redirect",
        "message": "The server redirected page to another link."
    },
    400: {
        "title": "Bad Request",
        "message": "The server cannot or will not process request due to an apparent request error."
    },
    403: {
        "title": "Forbidden",
        "message": "The user does not have the necessary permissions for the resource."
    },
    404: {
        "title": "Not Found",
        "message": "The resource is not reachable or does not exists."
    },
    418: {
        "title": "I'm a Teapot",
        "message": "You can brew me, I'm hot !"
    },
    500: {
        "title": "Internal Server Error",
        "message": "An unexpected condition was encountered and no specific message is suitable. Please try again or contact administrator."
    },
    503: {
        "title": "Service Unavailable",
        "message": "The server HTTP is currently unavailable. Please try again or contact administrator."
    },
    "default": {
        "title": "Unknown Error",
        "message": "An unknown error was encountered and no specific message is suitable."
    }
};


/**
 * @class HttpCode is a main class to rule Http requests and send a good object in this motor. For example, a
 * HttpCode 200 send an "OK" status to client, and his body as body response.
 */

class HttpCode extends Error {

    constructor(code, message, previous) {

        super(message, code, previous);
        this.code = typeof code === 'number' ? code : 500;
        this.headers = {};
        this.cookies = {};

        this.name = "HttpCode";
    }


    /**
     * @function getTitle returns the HttpCode title corresponding this code or a default value. This is send at "HTTP"
     * header line for example, next to the code.
     * @returns string
     */

    getTitle() {
        return ( httpCode[this.getCode()] || httpCode["default"] ).title;
    }


    /**
     * @function getMessage returns the body of the HttpCode. The message is also used for the Response body.
     * @returns string
     */

    getMessage() {
        if (HttpCode.DEBUG_MODE)
            return `${this.name} (${this.getCode()}): ${this.message}`;
        else
            return ( httpCode[this.getCode()] || httpCode["default"] ).message;
    }


    /**
     * @function getContentPlain returns this HttpCode in a string formatted as a 'text/plain' mime.
     * @returns {string}
     */

    getContentPlain() {
        let start = `${this.getCode()} - ${this.getTitle()}\n${this.getMessage()}\n`;

        if (HttpCode.DEBUG_MODE) {
            let debug = `${start}${this.getTrace().join('\n')}\n`,
                self = this;
            while (self.getPrevious && ( self = self.getPrevious() )) {
                if (self instanceof Error) {
                    debug += `${self.getMessage()}\n`;
                    debug += `${self.getTrace().join('\n')}\n`;
                }
                if (is_object(self)) {
                    debug += `${self.name} (${self.code}): ${self.message}\n`;
                    debug += `${self.stack}\n`;
                }
            }
            return debug;
        }
        else {
            return start;
        }
    }


    /**
     * @function getContentHTML returns this HttpCode in a string formatted as a 'text/html' mime.
     * @returns {string}
     */

    getContentHTML() {
        if (HttpCode.DEBUG_MODE) {
            let start = `<h1>${this.getCode()} - ${this.getTitle()}</h1>\n<pre>${this.getMessage()}</pre>\n`,
                debug = `${start}<pre>${this.getTrace().join('\n')}</pre>`,
                self = this;
            while (self.getPrevious && ( self = self.getPrevious() )) {
                if (self instanceof Error) {
                    debug += `<pre>${self.getMessage()}</pre>`;
                    debug += `<pre>${self.getTrace().join('\n')}</pre>`;
                }
                if (is_object(self)) {
                    debug += `<pre>${self.constructor.name} (${self.code}): ${self.message}</pre>`;
                    debug += `<pre>${self.stack}</pre>`;
                }
            }
            return debug;
        }
        else {
            return ( `<h1>${this.getCode()} - ${this.getTitle()}</h1>\n<p>${this.getMessage()}</p>\n` );
        }
    }


    /**
     * @function getContentJSON returns this HttpCode in an object.
     * @returns object
     */

    getContentJSON() {
        let obj = {
            "code": this.getCode(),
            "title": this.getTitle(),
            "message": this.getMessage()
        };
        if (HttpCode.DEBUG_MODE) {
            obj.trace = this.getTrace();
            let p;
            if (p = this.getPrevious()) {
                if (p instanceof Error) {
                    obj.previous = p.getContentJSON();
                }
                if (is_object(p)) {
                    obj.previous = {
                        "code": p.code,
                        "message": p.message,
                        "trace": p.stack
                    };
                }
            }
        }
        return obj;
    }


    /**
     * @function setHeader set header sent to the client
     * @param field Object|string
     * @param value string
     * @returns HttpCode
     */

    setHeader(field, value) {
        if (field instanceof Object) {
            for (let f in field)
                this.setHeader(f, field[f]);
        }
        else {
            this.headers[field] = value;
        }
        return this;
    }


    /**
     * @function setCookie set cookie sent to the client
     * @param field Object|string
     * @param value string
     * @returns HttpCode
     */

    setCookie(field, value) {
        if (field instanceof Object) {
            for (let f in field)
                this.setCookie(f, field[f]);
        }
        else {
            this.cookies[field] = value;
        }
        return this;
    }


    /**
     * @function setCookiesOptions set all cookies options
     * @param expires {Date}
     * @param domain {string}
     * @param path {string}
     * @param secure {*}
     * @returns {HttpCode}
     */

    setCookiesOptions(expires, domain, path, secure) {
        if (expires instanceof Date) this.setCookie('expires', expires.toUTCString());
        if (domain !== undefined) this.setCookie('domain', domain);
        if (path !== undefined) this.setCookie('path', path);
        if (secure !== undefined) this.setCookie('secure', '');
        return this;
    }


    /**
     * @function getCookiesToString returns a string to build a header
     * @returns string
     */

    getCookiesToString() {
        let sum = [];
        for (let c in this.cookies)
            sum.push(c.replace(/[=;\\]/, '\\$0') + '=' + this.cookies[c].replace(/[=;\\]/, '\\$0'));
        return sum.join('; ');
    }
}

HttpCode.DEBUG_MODE = false;
HttpCode.Error = Error;

module.exports = HttpCode;