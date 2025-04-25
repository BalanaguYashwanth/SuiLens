export const classifyPrompt = (text: string) => `
You're a classifier. Determine if the following input is a raw SQL query or a human instruction.
Note - Return either: "query" or "instruction" in one word very strictly.

Input: ${text}
`;
