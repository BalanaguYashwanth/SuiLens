export const convertPrompt = (instruction: string) => `
Convert the following natural language instruction into a valid SQL query.
Instruction: ${instruction}
`;
