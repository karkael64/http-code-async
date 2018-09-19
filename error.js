const Answerable = require('./answerable-multiformat');

function is_object(el) {
    return (typeof el === 'object') && (el !== null);
}

class Error extends Answerable {

    constructor(message, code, previous) {
        super();

        this.code = typeof code === 'number' ? code : 0;
        this.message = message || 'No message suited.';
        this.stask = ( new Error() ).stack;
        this.previous = previous || null;

        this.name = "Error";
    }

    /**
     * @function getCode returns the Error code.
     * @returns number
     */

    getCode() {
        return this.code;
    }


    /**
     * @function getMessage returns the body of the Error. The message is also used for the Response body.
     * @returns string
     */

    getMessage() {
        return `${this.name} (${this.getCode()}): ${this.message}`;
    }


    /**
     * @function getTrace is used to return each lines of the stack at the construction of Error.
     * @returns {Array}
     */

    getTrace() {
        let lines = this.stask.split(/\n/),
            res = [];
        lines.shift();
        lines.shift();
        lines.forEach(function (stask) {
            res.push(stask.trim());
        });
        return res;
    }


    /**
     * @function getPrevious returns an Error or a Error created before this one.
     * @returns Error.
     */

    getPrevious() {
        return this.previous;
    }


    /**
     * @function getContentPlain returns this Error in a string formatted as a 'text/plain' mime.
     * @returns {string}
     */

    getContentPlain() {
        let start = `${this.getMessage()}\n`;

        let debug = `${start}${this.getTrace().join('\n')}\n`,
            self = this;
        while (self.getPrevious && ( self = self.getPrevious() )) {
            if (self instanceof Error) {
                debug += `${self.getMessage()}\n`;
                debug += `${self.getTrace().join('\n')}\n`;
            }
            if (is_object(self)) {
                debug += `${self.constructor.name} (${self.code}): ${self.message}\n`;
                debug += `${self.stack}\n`;
            }
        }
        return debug;
    }


    /**
     * @function getContentHTML returns this instance as a string in HTML format.
     * @returns {string}
     */

    getContentHTML() {
        let start = `<h1>${this.getMessage()}</h1>\n`,
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


    /**
     * @function getContentJSON returns this instance as a JS object.
     * @returns {{code: (number|*), message: string, stask: *, previous: *}}
     */

    getContentJSON() {
        let previous = this.getPrevious();
        if (previous instanceof Error) {
            previous = previous.getContentJSON();
        }
        else if (is_object(previous)) {
            previous = {
                "code": previous.code,
                "message": previous.message,
                "stask": previous.stask,
                "previous": null
            };
        }
        return {
            "code": this.getCode(),
            "message": this.getMessage(),
            "stask": this.getTrace(),
            "previous": previous
        };
    }
}

Error.AnswerableMultiformat = Answerable;
Error.Answerable = Answerable.Answerable;

module.exports = Error;