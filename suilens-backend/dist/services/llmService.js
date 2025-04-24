"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callClaudeAI = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../constants/index");
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const callClaudeAI = async (prompt) => {
    const response = await axios_1.default.post(index_1.LLM.API_URL, {
        model: index_1.LLM.MODEL,
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
exports.callClaudeAI = callClaudeAI;
