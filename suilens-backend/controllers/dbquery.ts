import fs from 'fs';
import Database from 'better-sqlite3';

type DB_QUERY = {
    module: string
    query: string
}

export const dbquery = ({module, query}: DB_QUERY) => {
    const dbPath = `./db/${module}.sqlite`;

    if (!fs.existsSync(dbPath)) {
        throw new Error('DB file does not exist');
    }
    const db = new Database(dbPath);
    
    const row = db.prepare(query).all();
    return row
}