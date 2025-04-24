"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyPrompt = void 0;
const classifyPrompt = (text) => `
You're a classifier. Determine if the following input is a raw SQL query or a human instruction.
Return ONLY one word - either "query" or "instruction" - with no explanations or additional text.

Examples:
Input: "SELECT * FROM users WHERE age > 25"
Output: query

Input: "Show me all users older than 25"
Output: instruction

Input: "SELECT COUNT(*) FROM transactions WHERE date > '2023-01-01'"
Output: query

Input: "How many transactions occurred after January 2023?"
Output: instruction

Now classify this input:
Input: ${text}
`;
exports.classifyPrompt = classifyPrompt;
