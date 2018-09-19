const Answerable = require('./answerable');

function is_function(el) {
    return (typeof el === 'function');
}

const MIME_JSON = "application/json";
const MIME_HTML = "text/html";

class AnswerableMultiformat extends Answerable {

    constructor() {
        super();

        if (!is_function(this.getContentPlain))
            throw new Error("This instance of Answerable has no getContentPlain function!");

        if (!is_function(this.getContentHTML))
            throw new Error("This instance of Answerable has no getContentHTML function!");

        if (!is_function(this.getContentJSON))
            throw new Error("This instance of Answerable has no getContentJSON function!");
    }


    /**
     * @function getContent
     * @param req {http.IncomingMessage}
     * @returns {Promise.<void>}
     */

    async getContent(req) {
        if (req === MIME_JSON)
            await this.getContentJSON(req);
        if (req === MIME_HTML)
            await this.getContentHTML(req);
        else
            await this.getContentPlain(req);
    }
}

AnswerableMultiformat.Answerable = Answerable;

module.exports = AnswerableMultiformat;