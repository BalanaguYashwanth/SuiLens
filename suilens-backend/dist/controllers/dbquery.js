"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processQueryPipeline = exports.determineChartType = exports.convertInstructionToSQL = exports.classifyUserInput = exports.executeSQLQuery = exports.getAllTables = exports.checkTableExistence = exports.openDatabaseConnection = void 0;
const fs_1 = __importDefault(require("fs"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const llmService_1 = require("../services/llmService");
const chartPrompt_1 = require("./prompts/chartPrompt");
const convertPrompt_1 = require("./prompts/convertPrompt");
const classifyPrompt_1 = require("./prompts/classifyPrompt");
const openDatabaseConnection = (module) => {
    const dbPath = `./db/${module}.sqlite`;
    if (!fs_1.default.existsSync(dbPath)) {
        throw new Error('DB file does not exist');
    }
    return new better_sqlite3_1.default(dbPath);
};
exports.openDatabaseConnection = openDatabaseConnection;
const checkTableExistence = (db, tableName) => {
    const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?").get(tableName);
    return result !== undefined;
};
exports.checkTableExistence = checkTableExistence;
const getAllTables = (db) => {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    return tables.map((table) => table.name);
};
exports.getAllTables = getAllTables;
const executeSQLQuery = (db, query) => {
    return db.prepare(query).all();
};
exports.executeSQLQuery = executeSQLQuery;
const classifyUserInput = async (input) => {
    const prompt = (0, classifyPrompt_1.classifyPrompt)(input);
    const inputType = await (0, llmService_1.callClaudeAI)(prompt);
    return inputType;
};
exports.classifyUserInput = classifyUserInput;
const convertInstructionToSQL = async (instruction) => {
    const prompt = (0, convertPrompt_1.convertPrompt)(instruction);
    const sqlQuery = await (0, llmService_1.callClaudeAI)(prompt);
    return sqlQuery;
};
exports.convertInstructionToSQL = convertInstructionToSQL;
const determineChartType = async (sampleData, schema) => {
    const prompt = (0, chartPrompt_1.chartPrompt)(JSON.stringify(sampleData), schema);
    const chartType = await (0, llmService_1.callClaudeAI)(prompt);
    return chartType;
};
exports.determineChartType = determineChartType;
const processQueryPipeline = async ({ query, module }) => {
    // Step 1: Open the database connection
    const db = (0, exports.openDatabaseConnection)(module);
    // Step 2: Check if the table exists
    const match = query.match(/from\s+(\w+)/i);
    const tableName = match?.[1];
    if (tableName && !(0, exports.checkTableExistence)(db, tableName)) {
        const availableTables = (0, exports.getAllTables)(db);
        return {
            message: `The table "${tableName}" does not exist in the database. Please select only from the following available tables:`,
            availableTables,
            sqlQuery: null,
        };
    }
    // Step 3: Classify the type of query
    const queryType = await (0, exports.classifyUserInput)(query);
    console.log("Query Type:", queryType);
    // Step 4: Convert natural language to SQL if needed
    let finalQuery = query;
    if (queryType.includes("instruction")) {
        finalQuery = await (0, exports.convertInstructionToSQL)(query);
    }
    console.log("Final Query Updated:", finalQuery);
    // Step 5: Execute the query using reusable function
    const rows = (0, exports.executeSQLQuery)(db, finalQuery);
    console.log("Rows Returned:", rows.length);
    // Step 6: Get chart type from sample data
    const schema = Object.keys(rows[0] || {});
    console.log("Schema:", schema);
    const chartType = await (0, exports.determineChartType)(rows.slice(0, 3), schema);
    console.log("Chart Type:", chartType);
    return { rows, chartType, sqlQuery: finalQuery };
};
exports.processQueryPipeline = processQueryPipeline;
