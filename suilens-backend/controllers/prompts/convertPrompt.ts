export const convertPrompt = (instruction: string, tables: { name: string; schema: string }[]) => `
You are a SQL expert. Given the tables and an instruction, return ONLY the SQL query. If none of the table names clearly match the instruction, return exactly: None. No explanation, no extra text 
Note — only the SQL or None strictly.

Tables:
${JSON.stringify(tables, null, 2)}

Instruction: ${instruction}
SQL:
`;
