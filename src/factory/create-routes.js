import buildRoutePath from '../utils/build-route-path.js';

function createRoutes (routes) {
    return routes.map((route) => ({
        ...route,
        path: buildRoutePath(route.path),
        handler (request, response) {
            const { path } = request;

            const routeParams = path.match(this.path);
            if (routeParams?.groups) {
                request.params = { ...routeParams.groups };
            }

            console.log(path, {
                query: request.query,
                params: request.params,
            });

            return route.handler(request, response);
        }
    }))
}

export default createRoutes;
