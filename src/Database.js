import { writeFile, readFile } from 'node:fs/promises';

const dbPath = new URL('../db.json', import.meta.url);

class Database {
    #database;

    constructor (initDbData) {
        this.#database = initDbData;
    }

    findOne (table, id) {
        const foundEntry = this.select(table).find((entry) => {
            return entry.id === id;
        });

        return foundEntry;
    }

    exists (table, id) {
        return !!this.findOne(table, id);
    }

    select (table, filter) {
        let entries = this.#database[table] || [];

        if (!!filter) {
            entries = entries.filter((entry) => {
                const hasAnyMatch = Object
                    .entries(filter)
                    .some(([key, value]) => {
                        const dbValue = entry[key].toLowerCase();
                        const filterValue = value.toLowerCase();

                        return dbValue.includes(filterValue);
                    });

                return hasAnyMatch;
            });
        }

        return entries;
    }

    async insert (table, data) {
        if (this.#hasTable(table)) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }

        return this.#persist();
    }

    async update (table, id, dataToUpdate) {
        if (this.#hasTable(table)) {
            const entryToUpdate = this.findOne(table, id);

            if (!!entryToUpdate) {
                Object.entries(dataToUpdate).forEach(([key, value]) => {
                    entryToUpdate[key] = value;
                });
            }

            return this.#persist();
        }
    }

    async delete (table, id) {
        if (this.#hasTable(table)) {
            this.#database[table] = this.#database[table].filter((entry) => {
                return entry.id !== id;
            });

            return this.#persist();
        }
    }

    async #persist () {
        writeFile(dbPath, JSON.stringify(this.#database, null, '\t'));
    }

    #hasTable (table) {
        return Array.isArray(this.#database[table]);
    }
}

async function createDbInstance () {
    try {
        const stringifiedDbData = await readFile(dbPath, 'utf-8');
        const deserializedDbData = JSON.parse(stringifiedDbData);
        return new Database(deserializedDbData);
    } catch {
        const dbData = {};
        await writeFile(dbPath, JSON.stringify(dbData, null, '\t'));
        return new Database(dbData);
    }
}

export default createDbInstance;
