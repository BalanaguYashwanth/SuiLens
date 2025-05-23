import { FIREBASE_DB_API } from "./constant";
import { BACKEND_API, MCP_CLIENT_API, SUILENS_ANALYTICS_BACKEND_API } from "./env"
import { CreateEvents, CreatePackageProps, GetSqlQueryResults, TableSchema } from "./types";

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

export const authenticateUser = async (token: string) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/user/authenticate`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({ token })
  });
  return res.json();
};

export const createUser = async () => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/user/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    credentials: 'include'
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

export const createPackage = async ({packageAddress, packageName}: CreatePackageProps) => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/package/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    credentials: 'include',
    body: JSON.stringify({ packageAddress, packageName }),
  });
  return res.json();
};

export const getPackagesByEmail = async () => {
  const res = await fetch(`${SUILENS_ANALYTICS_BACKEND_API}/package/get`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
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

export const recordNFT = async (nftID: string) => {
  const timestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
    }).replace(/[, ]/g, '-').replace(/:/g, '-');

    await fetch(`${FIREBASE_DB_API}/suilens/${timestamp}.json`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nftID })
  })
}

export const fetchNFT = async () => {
  const data = await fetch(`${FIREBASE_DB_API}/suilens.json`, {
    method: 'GET',
    headers: { "Content-Type": "application/json" },
  })
  const response = await data.json()
  return response
}

export const deleteNFT = async(keyName: string) => {
  const data = await fetch(`${FIREBASE_DB_API}/suilens/${keyName}.json`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
  })
  const response = await data.json()
  return response
}

export type TimelineData = Record<string, Record<string, number>>;