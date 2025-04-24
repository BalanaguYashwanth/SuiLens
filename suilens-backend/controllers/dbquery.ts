import fs from 'fs';
import DatabaseConstructor, {Database as DatabaseType} from 'better-sqlite3';
import { callClaudeAI } from '../services/llmService';
import { chartPrompt } from './prompts/chartPrompt';
import { convertPrompt } from './prompts/convertPrompt';
import { classifyPrompt } from './prompts/classifyPrompt';
import { tableExtractionPrompt } from './prompts/tableExtractionPrompt';

type DB_QUERY = {
    module: string
    query: string
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
  
export const getAllTables = (db: DatabaseType): string[] => {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    return tables.map((table: any) => table.name);
};

export const executeSQLQuery = (db: DatabaseType, query: string) => {
    return db.prepare(query).all();
}

export const classifyUserInput = async (input: string) => {
    const prompt = classifyPrompt(input);
    const inputType = await callClaudeAI(prompt);
    return inputType;
};
  
export const convertInstructionToSQL = async (instruction: string) => {
    const prompt = convertPrompt(instruction);
    const sqlQuery = await callClaudeAI(prompt);
    return sqlQuery;
};

export const extractTablesFromQuery = async (query: string, queryType: string) => {
    const prompt = tableExtractionPrompt(query, queryType);
    const tablesResponse = await callClaudeAI(prompt);
    
    try {
        return JSON.parse(tablesResponse);
    } catch (error) {
        console.error("Error parsing table names from LLM response:", error);
        return [];
    }
};

export const determineChartType = async (sampleData: any[], schema: string[]) => {
  const prompt = chartPrompt(JSON.stringify(sampleData), schema);
  const chartType = await callClaudeAI(prompt);
  return chartType;
};

export const processQueryPipeline = async ({ query, module }: DB_QUERY) => {
    // Step 1: Open the database connection
    const db = openDatabaseConnection(module);

    // Step 2: Classify the type of query
    const queryType = await classifyUserInput(query);
    console.log("Query Type:", queryType);

    // Step 3: Extract table names based on the input type
    const tableNames = await extractTablesFromQuery(query, queryType);
    console.log("Extracted Table Names:", tableNames);

    // Step 4: Check if all tables exist
    const nonExistentTables = tableNames.filter((table: string) => !checkTableExistence(db, table));
    if (nonExistentTables.length > 0) {
        const availableTables = getAllTables(db);
        return {
            message: `The table(s) "${nonExistentTables.join('", "')}" do not exist in the database. Please select only from the following available tables:`,
            availableTables,
            sqlQuery: null,
        };
    }
  
    // Step 5: Convert natural language to SQL if needed
    let finalQuery = query;
    if (queryType.includes("instruction")) {
      finalQuery = await convertInstructionToSQL(query);
    }
    console.log("Final Query Updated:", finalQuery);
  
    // Step 6: Execute the query 
    const rows = executeSQLQuery(db, finalQuery);
    console.log("Rows Returned:", rows.length);
  
    // Step 7: Get chart type from sample data
    const schema = Object.keys(rows[0] || {});
    console.log("Schema:", schema)
    const chartType = await determineChartType(rows.slice(0, 3), schema);
    console.log("Chart Type:", chartType);
  
    return { rows, chartType, sqlQuery: finalQuery };
  };
  