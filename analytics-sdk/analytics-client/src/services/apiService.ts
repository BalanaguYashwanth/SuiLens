import axios from 'axios';
import { ValidationError } from '../errors/ValidationError';

const { API_BASE_URL } = process.env;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export async function createDatabaseAndTable(db: string, table: string): Promise<void> {
  if (!db || !table) throw new ValidationError('Database name and table name are required.');
  try {
    const res = await api.post('/create', { db, table });
    if (res.status !== 200) throw new Error('Unexpected response while creating DB/Table.');
  } catch (error: any) {
    console.error('Error during createDatabaseAndTable:', error.message);
    throw new Error('Failed to create database or table: ' + (error.response?.data?.message || error.message));
  }
}

export async function insertData(db: string, table: string, data: any): Promise<void> {
  if (!db || !table || !data) throw new ValidationError('Database, table, and data are required for insert.');
  try {
    const res = await api.post('/insert', { db, table, data });
    if (res.status !== 200) throw new Error('Unexpected response while inserting.');
  } catch (error: any) {
    console.error('Error during insertData:', error.message);
    throw new Error('Failed to insert data: ' + (error.response?.data?.message || error.message));
  }
}

export async function updateData(db: string, table: string, data: any): Promise<void> {
  if (!db || !table || !data) throw new ValidationError('Database, table, and data are required for update.');
  try {
    const res = await api.post('/update', { db, table, data });
    if (res.status !== 200) throw new Error('Unexpected response while updating.');
  } catch (error: any) {
    console.error('Error during updateData:', error.message);
    throw new Error('Failed to update data: ' + (error.response?.data?.message || error.message));
  }
}

export async function deleteTable(db: string, table: string): Promise<void> {
  if (!db || !table) throw new ValidationError('Database and table are required for delete.');
  try {
    const res = await api.post('/delete', { db, table });
    if (res.status !== 200) throw new Error('Unexpected response while deleting table.');
  } catch (error: any) {
    console.error('Error during deleteTable:', error.message);
    throw new Error('Failed to delete table: ' + (error.response?.data?.message || error.message));
  }
}