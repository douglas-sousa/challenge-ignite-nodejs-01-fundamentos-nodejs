async function json (request, response) {
    if (request.headers['content-type']=== 'application/json') {
        try {
            const buffers = [];
            for await (const chunk of request) {
                buffers.push(chunk);
            }

            const fullBodyContent = Buffer.concat(buffers).toString();
            request.body = JSON.parse(fullBodyContent);
        } catch {
            request.body = null;
        }
    }

    response.setHeader('content-type', 'application/json');
    response.json = function (message) {
        try {
            return response.end(JSON.stringify(message));
        } catch {
            return response.end(JSON.stringify({ done: true }));
        }
    }
}

export default json;
