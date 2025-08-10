import fs from 'fs';
import path from "path";
import DatabaseConstructor, {Database as DatabaseType} from 'better-sqlite3';
import { callClaudeAI } from '../services/llmService';
import { chartPrompt } from './prompts/chartPrompt';
import { convertPrompt } from './prompts/convertPrompt';
import { classifyPrompt } from './prompts/classifyPrompt';

type DB_QUERY = {
    module: string
    text: string
}

export const openDatabaseConnection = (module: string) => {
    const projectRoot = path.resolve(__dirname, "../.."); // adjust depth like Python's parents[2]
    const dbDir = path.join(projectRoot, "db");
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, `${module}.sqlite`);

    if (!fs.existsSync(dbPath)) {
        return null;
    }

    return new DatabaseConstructor(dbPath);
};

export const checkTableExistence = (db: DatabaseType, tableName: string): boolean => {
    const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?").get(tableName);
    return result !== undefined;
};
  
export const getAllTablesWithSchema = (db: DatabaseType): { name: string; schema: string }[] => {
    return db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all()
      .map((row: any) => ({ name: row.name, schema: row.sql }));
  };  

export const executeSQLQuery = <T extends Record<string, any>>(db: DatabaseType, query: string): T[] => {
    const stmt = db.prepare(query);
    const rows = stmt.all() as T[];
    return rows.map(row => ({ ...row }));
};

export const classifyUserInput = async (input: string) => {
    const prompt = classifyPrompt(input);
    const inputType = await callClaudeAI(prompt);
    return inputType;
};
  
export const convertInstructionToSQL = async (db: DatabaseType, instruction: string) => {
    const tables = getAllTablesWithSchema(db);
    const prompt = convertPrompt(instruction, tables);    
    const sqlQuery = await callClaudeAI(prompt);
    return sqlQuery;
};

export const determineChartType = async (sampleData: any[], schema: string[]) => {
  const prompt = chartPrompt(JSON.stringify(sampleData), schema);
  const chartType = await callClaudeAI(prompt);
  return chartType;
};

export const processQueryPipeline = async ({ text, module }:{text: string, module: string}) => {
    const db = openDatabaseConnection(module);
    if (!db) {
        return { rows: [], sqlQuery: text };
    }

    try {
        const rows = executeSQLQuery(db, text);
        return {response:{ sql: rows, sqlQuery: text }};
    } finally {
        db.close(); // make sure to close like Python
    }
};