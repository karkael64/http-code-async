let count = 0;

function assert(el, message) {
    if (!el) {
        console.error("\x1b[1m\x1b[31m", message || "Unit test error", "\x1b[0m");
        console.trace();
    }
    count++;
}

function should(el, be, message) {
    if (el !== be) {
        console.error("\x1b[1m\x1b[31m", message || "Unit test error", "\x1b[0m");
        console.trace();
    }
    count++;
}

async function returns(fn, be, message) {
    if (!(typeof fn === 'function')) {
        console.error("\x1b[1m\x1b[31m", message || "Unit test error: first parameter not a function", "\x1b[0m");
        console.trace();
    }
    else {

        let res;
        try {
            res = await fn();
        }
        catch (err) {
            console.warn("\x1b[1m\x1b[31m", message || "Unit test error: function thrown unexpected error", "\x1b[0m");
            console.trace();
        }

        if (res !== be) {
            console.warn("\x1b[1m\x1b[31m", message || "Unit test error", "\x1b[0m");
            console.trace();
        }
    }
    count++;
}

async function throws(fn, be, message) {
    if (!fn || !(fn instanceof Function)) {
        console.warn("\x1b[1m\x1b[31m", message || "Unit test error: first parameter not a function", "\x1b[0m");
        console.trace();
    }
    else {

        let err = null;
        try {
            await fn();
        }
        catch (err) {
        }

        if (err && !be && (err === be) && !(err instanceof be)) {
            console.warn("\x1b[1m\x1b[31m", message || "Unit test error", "\x1b[0m");
            console.trace();
        }
    }
    count++;
}

function stub(into, field, stub) {
    let std = into[field];
    into[field] = stub;
    into[field].revert = function () {
        into[field] = std;
    };
}

class IncomingMessage {
    constructor(method, file, headers, body) {
        this.method = method || "GET";
        this.file = file || ".";
        this.headers = headers || {};
        this.data = body || ["chunk1", "chunk2", "last_chunk"];
    }

    on(ev, fn) {

        if (ev === 'data') {
            let body = this.data.slice();
            while (body.length) {
                fn(Buffer.from(body.shift()));
            }
        }
        if (ev === 'end') {
            fn();
        }

    }
}

IncomingMessage.connection = {
    destroy: function () {
    }
};

module.exports = {
    'assert': assert,
    'should': should,
    'returns': returns,
    'throws': throws,
    'stub': stub,
    'IncomingMessage': IncomingMessage,
    'count': function(){ return count; }
};