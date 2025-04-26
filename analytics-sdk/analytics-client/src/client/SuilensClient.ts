import { createDatabaseAndTable, insertData, updateData, deleteTable } from '../services/apiService';
import { InitializationError } from '../errors/InitializationError';
import { ValidationError } from '../errors/ValidationError';
import { InitOptions } from '../interfaces/InitOptions';

export class SuilensClient {
  private dbName: string;
  private tableName: string;
  private initialized: boolean = false;

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
      this.initialized = true;
    } catch (error: any) {
      console.error('Initialization failed:', error.message);
      throw error;
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new InitializationError('SuilensClient is not initialized. Call init() first.');
    }
  }

  async push(data: any): Promise<void> {
    this.ensureInitialized();
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Push data must be a valid JSON object.');
    }
    await insertData(this.dbName, this.tableName, data);
  }

  async update(data: any): Promise<void> {
    this.ensureInitialized();
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Update data must be a valid JSON object.');
    }
    await updateData(this.dbName, this.tableName, data);
  }

  async delete(): Promise<void> {
    this.ensureInitialized();
    await deleteTable(this.dbName, this.tableName);
    this.initialized = false;
  }
}