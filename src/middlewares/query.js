import extractQueryParams from "../utils/extract-query-params.js";

function query (request) {
    const { url, headers } = request;
    const { searchParams } = new URL(url, `http://${headers.host}`);
    request.query = extractQueryParams(searchParams);
}

export default query;
