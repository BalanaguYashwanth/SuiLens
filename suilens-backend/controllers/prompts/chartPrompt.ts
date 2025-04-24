export const chartPrompt = (data: string, schema: string[]) => `
Given the first 3 rows of data and the schema, decide the best chart to visualize it: "bar", "line", "pie" or "table".

Data (JSON): ${data}
Schema: ${schema.join(', ')}

Return only one word (chart type) from: bar, line, pie, or table. Do not explain.
`.trim();