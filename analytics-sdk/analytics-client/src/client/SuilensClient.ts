import { createDatabaseAndTable, insertTable, updateTable, deleteTable } from '../services/apiService.js';
import { InitializationError } from '../errors/InitializationError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { InitOptions } from '../interfaces/InitOptions.js';

export class SuilensClient {
  private dbName: string;
  private tableName: string;

  constructor() {
    this.dbName = '';
    this.tableName = '';
  }

  async init(options: InitOptions): Promise<void> {
    const { dbName, tableName } = options;
    if (!dbName || !tableName) {
      throw new ValidationError('Both dbName and tableName must be provided.');
    }

    try {
      await createDatabaseAndTable(dbName, tableName);
      this.dbName = dbName;
      this.tableName = tableName;
    } catch (error: any) {
      console.error('Initialization failed:', error.message);
      throw error;
    }
  }

  private hasTableDBExists(): void {
    if (!this.dbName || !this.tableName) {
      throw new InitializationError('SuilensClient is not initialized. Call init() first.');
    }
  }

  async insert(data: any): Promise<void> {
    this.hasTableDBExists();
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Insert data must be a valid JSON object.');
    }
    await insertTable(this.dbName, this.tableName, data);
  }

  async update(data: any): Promise<void> {
    this.hasTableDBExists();
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Update data must be a valid JSON object.');
    }
    await updateTable(this.dbName, this.tableName, data);
  }

  async delete(data?: Record<string, any>): Promise<void> {
    this.hasTableDBExists();
    await deleteTable(this.dbName, this.tableName, data);
  }
}