"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartPrompt = void 0;
const chartPrompt = (data, schema) => `
Given the first 3 rows of data and the schema, decide the best chart to visualize it: "bar", "line", "pie" or "table".

Data (JSON): ${data}
Schema: ${schema.join(', ')}

Return only one word (chart type) from: bar, line, pie, or table. Do not explain.
`.trim();
exports.chartPrompt = chartPrompt;
