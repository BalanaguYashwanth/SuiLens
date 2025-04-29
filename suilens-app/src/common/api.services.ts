import { BACKEND_API, MCP_CLIENT_API } from "./env"
import { CreateEvents, GetSqlQueryResults } from "./types";

export const createEvents = async (data: CreateEvents) => {
    const response = await fetch(`${BACKEND_API}/record-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  
export const getSqlQueryResults = async (data: GetSqlQueryResults) => {
  const response = await fetch(`${MCP_CLIENT_API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
