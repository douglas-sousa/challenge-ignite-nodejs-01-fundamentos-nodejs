const ROUTES = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (request, response) => {
            response.json({ GET: true });
        },
    },
    {
        method: 'POST',
        path: '/tasks',
        handler: (request, response) => {
            response.json({ POST: true });
        },
    },
    {
        method: 'PUT',
        path: '/tasks/:id',
        handler: (request, response) => {
            response.json({ PUT: true });
        },
    },
    {
        method: 'DELETE',
        path: '/tasks/:id',
        handler: (request, response) => {
            response.json({ DELETE: true });
        },
    },
    {
        method: 'PATCH',
        path: '/tasks/:id/complete',
        handler: (request, response) => {
            response.json({ PATCH: true });
        },
    },
];

export default ROUTES;
