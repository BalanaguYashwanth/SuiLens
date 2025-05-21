import axios from "axios";
import { LLM } from '../constants/index.ts'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

export const callClaudeAI = async (prompt: string): Promise<string> => {
  const response = await axios.post(LLM.API_URL, {
    model: LLM.MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
  }, {
    headers: {
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    }
  });

  return response.data?.content[0]?.text?.trim();
};
