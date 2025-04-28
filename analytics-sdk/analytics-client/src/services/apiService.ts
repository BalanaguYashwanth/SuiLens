import axios from 'axios';
import dotenv from 'dotenv';
import { ValidationError } from '../errors/ValidationError.js';
dotenv.config();

const { SUILENS_API_URL } = process.env;

const api = axios.create({
  baseURL: SUILENS_API_URL
});

export async function createDatabaseAndTable(dbName: string, tableName: string): Promise<void> {
  if (!dbName) throw new ValidationError('Database name are required.');
  try {
    const res = await api.post('/event/create', { dbName, tableName });
    if (res.status !== 200) throw new Error('Unexpected response while creating DB/Table.');
  } catch (error: any) {
    console.error('Error during createDatabaseAndTable:', error.message);
    throw new Error('Failed to create database and table: ' + (error.response?.data?.message || error.message));
  }
}

export async function insertTable(dbName: string, tableName: string, data: any): Promise<void> {
  if (!dbName || !tableName || !data) throw new ValidationError('Database, table, and data are required for insert.');
  try {
    const res = await api.post('/event/insert', { dbName, tableName, data });
    if (res.status !== 200) throw new Error('Unexpected response while inserting.');
  } catch (error: any) {
    console.error('Error during insertData:', error.message);
    throw new Error('Failed to insert data: ' + (error.response?.data?.message || error.message));
  }
}

export async function updateTable(dbName: string, tableName: string, data: any): Promise<void> {
  if (!dbName || !tableName || !data) throw new ValidationError('Database, table, and data are required for update.');
  try {
    const res = await api.put('/event/update', { dbName, tableName, data });
    if (res.status !== 200) throw new Error('Unexpected response while updating.');
  } catch (error: any) {
    console.error('Error during updateData:', error.message);
    throw new Error('Failed to update data: ' + (error.response?.data?.message || error.message));
  }
}

export async function deleteTable(dbName: string, tableName: string): Promise<void> {
  if (!dbName || !tableName) throw new ValidationError('Database and table are required for delete.');
  try {
    const res = await api.delete('/event/delete', { data: { dbName, tableName } });
    if (res.status !== 200) throw new Error('Unexpected response while deleting table.');
  } catch (error: any) {
    console.error('Error during deleteTable:', error.message);
    throw new Error('Failed to delete table: ' + (error.response?.data?.message || error.message));
  }
}