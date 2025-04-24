export const classifyPrompt = (text: string) => `
You're a classifier. Determine if the following input is a raw SQL query or a human instruction.
Return either: "query" or "instruction".

Input: ${text}
`;
