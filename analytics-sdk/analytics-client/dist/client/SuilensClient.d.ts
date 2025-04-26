interface InitOptions {
    dbName: string;
    tableName: string;
}
export declare class SuilensClient {
    private dbName;
    private tableName;
    private initialized;
    constructor();
    init(options: InitOptions): Promise<void>;
    push(data: any): Promise<void>;
    update(data: any): Promise<void>;
    delete(): Promise<void>;
}
export {};
