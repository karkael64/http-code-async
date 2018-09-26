const Answerable = require('./answerable');

function is_function(el) {
    return (typeof el === 'function');
}

const MIME_JSON = "application/json";
const MIME_HTML = "text/html";

class AnswerableMultiformat extends Answerable {

    /**
     * @warn This class can't be instanciated as if, a child class should have getContentPlain, getContentHTML &
     *      getContentJSON as methods.
     * <getContentPlain> {async function({http.IncomingMessage}, {http.ServerResponse})}
     * <getContentHTML> {async function({http.IncomingMessage}, {http.ServerResponse})}
     * <getContentJSON> {async function({http.IncomingMessage}, {http.ServerResponse})}
     */

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
     * @method <getContent>
     * @param req {http.IncomingMessage}
     * @returns {Promise.<string>}
     */

    async getContent(req) {
        let mime = Answerable.getFilenameMime(req.url);
        if (mime === MIME_JSON)
            return JSON.stringify(await this.getContentJSON(req));
        if (mime === MIME_HTML)
            return await this.getContentHTML(req);
        else
            return await this.getContentPlain(req);
    }
}

AnswerableMultiformat.Answerable = Answerable;

module.exports = AnswerableMultiformat;