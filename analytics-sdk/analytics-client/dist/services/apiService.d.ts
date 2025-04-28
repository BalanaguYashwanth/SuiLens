export declare function createDatabaseAndTable(dbName: string, tableName: string): Promise<void>;
export declare function insertData(dbName: string, tableName: string, data: any): Promise<void>;
export declare function updateData(dbName: string, tableName: string, data: any): Promise<void>;
export declare function deleteTable(dbName: string, tableName: string): Promise<void>;
