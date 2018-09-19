const AnswerableMultiformat = require('./multiformat');

function is_object(el) {
    return (typeof el === 'object') && (el !== null);
}

class AnswerableError extends AnswerableMultiformat {

    constructor(message, code, previous) {
        super();

        this.code = typeof code === 'number' ? code : 0;
        this.message = message || 'No message suited.';
        this.stack = ( new Error() ).stack;
        this.previous = previous || null;

        this.name = "AnswerableError";
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
        let lines = this.stack.split(/\n/),
            res = [];
        lines.shift();
        lines.shift();
        lines.forEach(function (stack) {
            res.push(stack.trim());
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
            if (self instanceof AnswerableError) {
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
            debug = `${start}<pre>${this.getTrace().join('\n').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>\n`,
            self = this;
        while (self.getPrevious && ( self = self.getPrevious() )) {
            if (self instanceof AnswerableError) {
                debug += `<pre>${self.getMessage()}</pre>\n`;
                debug += `<pre>${self.getTrace().join('\n').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>\n`;
            }
            if (is_object(self)) {
                debug += `<pre>${self.constructor.name} (${self.code}): ${self.message}</pre>\n`;
                debug += `<pre>${self.stack.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>\n`;
            }
        }
        return debug;
    }


    /**
     * @function getContentJSON returns this instance as a JS object.
     * @returns {{code: (number|*), message: string, stack: *, previous: *}}
     */

    getContentJSON() {
        let previous = this.getPrevious();
        if (previous instanceof AnswerableError) {
            previous = previous.getContentJSON();
        }
        else if (is_object(previous)) {
            previous = {
                "code": previous.code,
                "message": previous.message,
                "stack": previous.stack.split(/\n\s+/g),
                "previous": null
            };
        }
        return {
            "code": this.getCode(),
            "message": this.getMessage(),
            "stack": this.getTrace(),
            "previous": previous
        };
    }
}

AnswerableError.AnswerableMultiformat = AnswerableMultiformat;
AnswerableError.Answerable = AnswerableMultiformat.Answerable;

module.exports = AnswerableError;