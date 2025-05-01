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

export const createUser = async (token: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/user/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    credentials: 'include'
  });
  return res.json();
};

export const getProjectsByEmail = async () => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/project/get`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
    },
    credentials: 'include'
  });
  return res.json();
};

export const createProject = async (projectName: string, projectDescription: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/project/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    credentials: 'include',
    body: JSON.stringify({ projectName, projectDescription }),
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
    const response = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/event/schema/${dbName}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return data.schema;
  } catch (error) {
    console.error('Error fetching database schema:', error);
    throw error;
  }
};

export const createPackage = async (projectId: string, packageId: string, moduleName: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/package/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, packageId, moduleName }),
  });
  return res.json();
};

export const getPackagesByProject = async (projectId: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/package/get/${projectId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const getPackageAnalytics = async (packageId: string, batch_size=100) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/analytics?package_address=${packageId}&batch_size=${batch_size}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}