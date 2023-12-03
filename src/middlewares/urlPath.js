function urlPath (request) {
    request.path = request.url.split('?').shift();
}

export default urlPath;
