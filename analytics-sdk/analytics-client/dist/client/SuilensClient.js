import { createDatabaseAndTable, insertData, updateData, deleteTable } from '../services/apiService.js';
import { InitializationError } from '../errors/InitializationError.js';
import { ValidationError } from '../errors/ValidationError.js';
export class SuilensClient {
    constructor() {
        this.initialized = false;
        this.dbName = '';
        this.tableName = '';
    }
    async init(options) {
        const { dbName, tableName } = options;
        if (!dbName || !tableName) {
            throw new ValidationError('Both dbName and tableName must be provided.');
        }
        try {
            await createDatabaseAndTable(dbName, tableName);
            this.dbName = dbName;
            this.tableName = tableName;
            this.initialized = true;
        }
        catch (error) {
            console.error('Initialization failed:', error.message);
            throw error;
        }
    }
    ensureInitialized() {
        if (!this.initialized) {
            throw new InitializationError('SuilensClient is not initialized. Call init() first.');
        }
    }
    async insert(data) {
        this.ensureInitialized();
        if (!data || typeof data !== 'object') {
            throw new ValidationError('Insert data must be a valid JSON object.');
        }
        await insertData(this.dbName, this.tableName, data);
    }
    async update(data) {
        this.ensureInitialized();
        if (!data || typeof data !== 'object') {
            throw new ValidationError('Update data must be a valid JSON object.');
        }
        await updateData(this.dbName, this.tableName, data);
    }
    async delete() {
        this.ensureInitialized();
        await deleteTable(this.dbName, this.tableName);
        this.initialized = false;
    }
}
