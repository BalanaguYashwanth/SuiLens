import fs from 'fs';
import DatabaseConstructor, {Database as DatabaseType} from 'better-sqlite3';
import { callClaudeAI } from '../services/llmService.ts';
import { chartPrompt } from './prompts/chartPrompt.ts';
import { convertPrompt } from './prompts/convertPrompt.ts';
import { classifyPrompt } from './prompts/classifyPrompt.ts';

type DB_QUERY = {
    module: string
    text: string
}

export const openDatabaseConnection = (module: string): DatabaseType => {
    const dbPath = `./db/${module}.sqlite`; 
    
    if (!fs.existsSync(dbPath)) {
        throw new Error('DB file does not exist');
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

export const executeSQLQuery = (db: DatabaseType, query: string) => {
    return db.prepare(query).all();
}

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

export const processQueryPipeline = async ({ text, module }: DB_QUERY) => {
    let query = text;

    // Step 1: Open the database connection
    const db = openDatabaseConnection(module);

    // Step 2: Classify the type of query
    const queryType = await classifyUserInput(text);

    if(queryType == 'instruction'){
        query = await convertInstructionToSQL(db, text)
        if(query == 'None'){
            return {
                message: `The table(s) do not exist in the database. Please select only from the following available tables:`,
                sqlQuery: null,
            };
        }
    }

    const rows = executeSQLQuery(db, query);
 
    // Step 7: Get chart type from sample data
    const schema = Object.keys(rows[0] || {});
    const chartType = await determineChartType(rows.slice(0, 3), schema);
  
    return { rows, chartType, sqlQuery: query };
  };
  