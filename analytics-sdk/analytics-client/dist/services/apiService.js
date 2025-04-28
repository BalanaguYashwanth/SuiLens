import axios from 'axios';
// import dotenv from 'dotenv';
import { ValidationError } from '../errors/ValidationError.js';
// dotenv.config();
const API_BASE_URL = 'http://localhost:8000/api';
// const { API_BASE_URL } = process.env;
const api = axios.create({
    baseURL: API_BASE_URL,
    // timeout: 5000,
});
export async function createDatabaseAndTable(dbName, tableName) {
    if (!dbName)
        throw new ValidationError('Database name are required.');
    try {
        const res = await api.post('/create', { dbName, tableName });
        if (res.status !== 200)
            throw new Error('Unexpected response while creating DB/Table.');
    }
    catch (error) {
        console.error('Error during createDatabaseAndTable:', error.message);
        throw new Error('Failed to create database and table: ' + (error.response?.data?.message || error.message));
    }
}
export async function insertData(dbName, tableName, data) {
    if (!dbName || !tableName || !data)
        throw new ValidationError('Database, table, and data are required for insert.');
    try {
        const res = await api.post('/insert', { dbName, tableName, data });
        if (res.status !== 200)
            throw new Error('Unexpected response while inserting.');
    }
    catch (error) {
        console.error('Error during insertData:', error.message);
        throw new Error('Failed to insert data: ' + (error.response?.data?.message || error.message));
    }
}
export async function updateData(dbName, tableName, data) {
    if (!dbName || !tableName || !data)
        throw new ValidationError('Database, table, and data are required for update.');
    try {
        const res = await api.put('/update', { dbName, tableName, data });
        if (res.status !== 200)
            throw new Error('Unexpected response while updating.');
    }
    catch (error) {
        console.error('Error during updateData:', error.message);
        throw new Error('Failed to update data: ' + (error.response?.data?.message || error.message));
    }
}
export async function deleteTable(dbName, tableName) {
    if (!dbName || !tableName)
        throw new ValidationError('Database and table are required for delete.');
    try {
        const res = await api.delete('/delete', { data: { dbName, tableName } });
        if (res.status !== 200)
            throw new Error('Unexpected response while deleting table.');
    }
    catch (error) {
        console.error('Error during deleteTable:', error.message);
        throw new Error('Failed to delete table: ' + (error.response?.data?.message || error.message));
    }
}
