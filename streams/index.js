import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';

async function main () {
    const filePath = new URL('tasks.csv', import.meta.url);
    const fileReadStream = createReadStream(filePath);

    const parser = fileReadStream.pipe(parse({ columns: true }))

    for await (const record of parser) {
        const response = await fetch('http://localhost:2222/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title: record.title,
                description: record.description,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(data);
    }
}

main().catch(console.error);