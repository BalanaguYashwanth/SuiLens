"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPrompt = void 0;
const convertPrompt = (instruction) => `
Convert the following natural language instruction into a valid SQL query.
Return ONLY the raw SQL query without any explanations, suggestions or additional text.

Examples:
Instruction: "Show me all users older than 25"
Output: SELECT * FROM users WHERE age > 25

Instruction: "How many transactions occurred after January 2023?"
Output: SELECT COUNT(*) FROM transactions WHERE date > '2023-01-01'

Instruction: "Get the top 5 highest value orders"
Output: SELECT * FROM orders ORDER BY value DESC LIMIT 5

Instruction: "Find products with less than 10 items in stock"
Output: SELECT * FROM products WHERE stock < 10

Now convert this instruction:
Instruction: ${instruction}
`;
exports.convertPrompt = convertPrompt;
