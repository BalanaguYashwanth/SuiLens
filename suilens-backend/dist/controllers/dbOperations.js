"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbOperations = void 0;
const fs_1 = __importDefault(require("fs"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const dbOperations = ({ dbName, operation, data, tableName }) => {
    const dbPath = `./db/${dbName}.sqlite`;
    if (!fs_1.default.existsSync('./db'))
        fs_1.default.mkdirSync('./db');
    const db = new better_sqlite3_1.default(dbPath);
    if (operation === 'getId') {
        try {
            const key = Object.keys(data)[0];
            const value = Object.values(data)[0];
            const row = db.prepare(`SELECT * FROM ${tableName} WHERE ${key} = ?`).get(value);
            return row || undefined;
        }
        catch (error) {
            return undefined;
        }
    }
    // Handle single upsert
    if (data && operation === 'upsert') {
        const columns = Object.keys(data).map(key => `${key} TEXT`).join(', ');
        db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`).run();
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data);
        const upsertQuery = `
      INSERT OR REPLACE INTO ${tableName} (${keys})
      VALUES (${placeholders})
    `;
        db.prepare(upsertQuery).run(...values);
        return { status: 'upserted' };
    }
    // Handle delete
    if (data && operation === 'delete') {
        const key = Object.keys(data)[0];
        const value = Object.values(data)[0];
        const deleteQuery = `DELETE FROM ${tableName} WHERE ${key} = ?`;
        db.prepare(deleteQuery).run(value);
        return { status: 'deleted' };
    }
    // Handle createMany
    if (Array.isArray(data) && data.length && operation === 'createMany') {
        const keys = Object.keys(data[0]);
        const columns = keys.map(key => `${key} TEXT`).join(', ');
        db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`).run();
        const placeholders = keys.map(() => '?').join(', ');
        const insertQuery = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
        const insertStmt = db.prepare(insertQuery);
        const insertMany = db.transaction((rows) => {
            for (const row of rows) {
                insertStmt.run(Object.values(row));
            }
        });
        insertMany(data);
        return { status: 'createMany', count: data.length };
    }
    return { error: 'Invalid operation or data' };
};
exports.dbOperations = dbOperations;
