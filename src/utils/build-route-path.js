/**
 * @param {string} path 
 */
function buildRoutePath (path) {
    const routeParamsRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replace(routeParamsRegex, '(?<$1>[a-zA-Z0-9\-_]+)');
    const dynamicPathRegex = new RegExp(`^${pathWithParams}$`);
    return dynamicPathRegex;
}

export default buildRoutePath;
