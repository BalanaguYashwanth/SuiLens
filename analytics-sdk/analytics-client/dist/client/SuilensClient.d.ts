import { InitOptions } from '../interfaces/initOptions.js';
export declare class SuilensClient {
    private dbName;
    private tableName;
    private initialized;
    constructor();
    init(options: InitOptions): Promise<void>;
    private ensureInitialized;
    insert(data: any): Promise<void>;
    update(data: any): Promise<void>;
    delete(): Promise<void>;
}
