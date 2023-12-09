import buildRoutePath from '../utils/build-route-path.js';

function createRoutes (routes) {
    return routes.map((route) => ({
        ...route,
        validators: route.validators || [],
        path: buildRoutePath(route.path),
        handler (request, response, dbInstance) {
            const { path } = request;
            const routeParams = path.match(this.path);
            if (routeParams?.groups) {
                request.params = { ...routeParams.groups };
            }

            console.log(path, {
                query: request.query,
                params: request.params,
                body: request.body,
            });

            for (const validator of this.validators) {
                const validation = validator.validate(request);
                if (validation?.errorMessage) {
                    return response
                        .writeHead(400)
                        .json({
                            message: validation.errorMessage,
                        });
                }
            }

            return route.handler(request, response, dbInstance);
        }
    }))
}

export default createRoutes;
