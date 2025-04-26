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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseAndTable = createDatabaseAndTable;
exports.insertData = insertData;
exports.updateData = updateData;
exports.deleteTable = deleteTable;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { API_BASE_URL } = process.env;
function createDatabaseAndTable(db, table) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.post(`${API_BASE_URL}/create`, { db, table });
    });
}
function insertData(db, table, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.post(`${API_BASE_URL}/insert`, { db, table, data });
    });
}
function updateData(db, table, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.put(`${API_BASE_URL}/update`, { db, table, data });
    });
}
function deleteTable(db, table) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.delete(`${API_BASE_URL}/delete`, { data: { db, table } });
    });
}
