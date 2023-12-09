import { randomUUID } from 'node:crypto';
import body from './validator/body.js';

const TABLE_NAME = 'tasks';

const ROUTES = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (request, response, dbInstance) => {
            const { search } = request.query;

            const filter = !search
                ? null
                : { 
                    title: search,
                    description: search,
                };

            const tasks = dbInstance.select(TABLE_NAME, filter);

            response.json({
                data: {
                    tasks,
                },
            });
        },
    },
    {
        method: 'POST',
        path: '/tasks',
        validators: [
            body('title').isString(),
            body('description').isString()
        ],
        handler: async (request, response, dbInstance) => {
            const { title, description } = request.body;

            const taskId = randomUUID();
            await dbInstance.insert(TABLE_NAME, {
                id: taskId,
                created_at: new Date(),
                updated_at: new Date(),
                completed_at: null,
                title,
                description,
            });

            response.json({
                data: {
                    createdId: taskId,
                }
            });
        },
    },
    {
        method: 'PUT',
        path: '/tasks/:id',
        validators: [
            body('title').isString().optional(),
            body('description').isString().optional()
        ],
        handler: async (request, response, dbInstance) => {
            const { id: taskId } = request.params;
            const { title, description } = request.body || {};

            const hasNoPropToUpdate = !title && !description;
            if (hasNoPropToUpdate) {
                return response
                    .writeHead(204)
                    .end();
            }

            if (!dbInstance.exists(TABLE_NAME, taskId)) {
                return response
                    .writeHead(404)
                    .end();
            }

            const dataToUpdate = {
                updated_at: new Date(),
            };

            Object.entries({ title, description }).forEach(([key, value]) => {
                if (value != null) {
                    dataToUpdate[key] = value;
                }
            });

            await dbInstance.update(TABLE_NAME, taskId, dataToUpdate);

            response.json({
                message: 'Task updated successfully',
            });
        },
    },
    {
        method: 'DELETE',
        path: '/tasks/:id',
        handler: async (request, response, dbInstance) => {
            const { id: taskId } = request.params;

            if (!dbInstance.exists(TABLE_NAME, taskId)) {
                return response
                    .writeHead(404)
                    .end();
            }

            await dbInstance.delete(TABLE_NAME, taskId);

            response.json({
                message: 'Task deleted successfully',
            });
        },
    },
    {
        method: 'PATCH',
        path: '/tasks/:id/complete',
        handler: (request, response, dbInstance) => {
            const { id: taskId } = request.params;

            const foundEntry = dbInstance.findOne(TABLE_NAME, taskId);
            if (!foundEntry) {
                return response
                    .writeHead(404)
                    .end();
            }

            const willSetTaskAsComplete = !foundEntry.completed_at;

            dbInstance.update(TABLE_NAME, taskId, {
                updated_at: new Date(),
                completed_at: willSetTaskAsComplete
                    ? new Date()
                    : null,
            });

            response.json({
                message: willSetTaskAsComplete
                    ? 'Task set as complete successfully'
                    : 'Task set as incomplete successfully'
            });
        },
    },
];

export default ROUTES;
