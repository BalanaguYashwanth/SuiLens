import { BACKEND_API } from "./env"

interface CreateEvents {
    packageId: string
    module: string
}

export const createEvents = async (data: CreateEvents) => {
    const response = await fetch(`${BACKEND_API}/record-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  