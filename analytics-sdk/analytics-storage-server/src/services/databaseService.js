const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const ApiError = require('../errors/ApiError');

const DB_DIR = path.join(__dirname, '..', 'db');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// Helper to get DB instance
function getDB(dbName) {
  const dbPath = path.join(DB_DIR, `${dbName}.sqlite`);
  return new sqlite3.Database(dbPath);
}

// Create database file and table if not exists
async function createDatabaseAndTable(dbName, tableName) {
  const dbPath = path.join(DB_DIR, `${dbName}.sqlite`);

  const dbExists = fs.existsSync(dbPath);

  const db = getDB(dbName);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      if (!dbExists) {
        console.log(`Database ${dbName} created.`);
      }
      db.run(
        `CREATE TABLE IF NOT EXISTS ${tableName} (id TEXT PRIMARY KEY, data TEXT)`,
        (err) => {
          if (err) return reject(new ApiError(500, 'Failed to create table'));
          resolve();
        }
      );
    });
  });
}

// Insert data
async function insertData(dbName, tableName, data) {
  const db = getDB(dbName);

  const id = data.id;
  const jsonData = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO ${tableName} (id, data) VALUES (?, ?)`,
      [id, jsonData],
      function (err) {
        if (err) return reject(new ApiError(500, 'Insert failed'));
        resolve();
      }
    );
  });
}

// Update data
async function updateData(dbName, tableName, data) {
  const db = getDB(dbName);

  const id = data.id;
  const jsonData = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE ${tableName} SET data = ? WHERE id = ?`,
      [jsonData, id],
      function (err) {
        if (err) return reject(new ApiError(500, 'Update failed'));
        if (this.changes === 0) return reject(new ApiError(404, 'Record not found'));
        resolve();
      }
    );
  });
}

// Delete table
async function deleteTable(dbName, tableName) {
  const db = getDB(dbName);

  return new Promise((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
      if (err) return reject(new ApiError(500, 'Failed to delete table'));
      resolve();
    });
  });
}

module.exports = {
  createDatabaseAndTable,
  insertData,
  updateData,
  deleteTable,
};