"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuilensClient = void 0;
const apiService_1 = require("../services/apiService");
class SuilensClient {
    constructor() {
        this.initialized = false;
        this.dbName = '';
        this.tableName = '';
    }
    init(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dbName, tableName } = options;
            yield (0, apiService_1.createDatabaseAndTable)(dbName, tableName);
            this.dbName = dbName;
            this.tableName = tableName;
            this.initialized = true;
        });
    }
    push(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initialized) {
                throw new Error('SuilensClient is not initialized. Call init() first.');
            }
            yield (0, apiService_1.insertData)(this.dbName, this.tableName, data);
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initialized) {
                throw new Error('SuilensClient is not initialized. Call init() first.');
            }
            yield (0, apiService_1.updateData)(this.dbName, this.tableName, data);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initialized) {
                throw new Error('SuilensClient is not initialized. Call init() first.');
            }
            yield (0, apiService_1.deleteTable)(this.dbName, this.tableName);
            this.initialized = false;
        });
    }
}
exports.SuilensClient = SuilensClient;
