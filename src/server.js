import { createServer } from 'node:http';

import json from './middlewares/json.js';
import query from './middlewares/query.js';
import urlPath from './middlewares/urlPath.js';
import createRoutes from './factory/create-routes.js';
import ROUTES from './routes.js';
import createDbInstance from './Database.js';

async function main () {
    const routes = createRoutes(ROUTES);
    const dbInstance = await createDbInstance();

    const server = createServer(async (request, response) => {
        query(request);
        urlPath(request);
        await json(request, response);
    
        const { method, path } = request;
    
        const route = routes.find((route) => {
            return route.method === method
                && route.path.test(path);
        });
    
        if (route) {
            return route.handler(request, response, dbInstance);
        }
    
        response.json({ message: 'Nothing to see here.' });
    });
    
    server.listen(2222);
}

main().catch(console.log);