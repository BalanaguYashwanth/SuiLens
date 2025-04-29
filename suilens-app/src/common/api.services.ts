import { BACKEND_API, MCP_CLIENT_API, SUILENS_ANALYTICS_BACKEND_API } from "./env"
import { CreateEvents, GetSqlQueryResults, TableSchema } from "./types";

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

export const createUser = async (email: string, name: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/user/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  return res.json();
};

export const getProjectsByEmail = async (email: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/project/get/${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
};

export const createProject = async (email: string, projectName: string, projectDescription: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/project/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, projectName, projectDescription }),
  });
  return res.json();
};

export const getProjectUrl = async () => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/api-url/get`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
};

export const getDatabaseSchema = async (dbName: string): Promise<TableSchema[]> => {
  try {
    const response = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/${dbName}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching database schema:', error);
    throw error;
  }
};