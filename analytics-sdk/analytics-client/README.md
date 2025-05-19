# 📘 SuilensClient Usage Guide

This document explains how to use the SuilensClient library to interact with your SQLite-backed backend for database operations: `init`, `insert`, `update`, and `delete`.

## 🔧 Initialization

```bash
init({ dbName, tableName })
```

Initializes the database and table. This must be called before any other operation.

Payload:

```bash
await client.init({
  dbName: 'myDatabase',
  tableName: 'myTable'
});
```
⚠️ Throws ValidationError if dbName or tableName is missing.

## ➕ Insert

```bash
insert(data: object | object[])
```

Inserts a single record or an array of records into the table. The table is auto-created if it doesn't exist, and columns are auto-added if new keys are detected.

Example 1 – Insert a single object:

```bash
await client.insert({
  name: 'Alice',
  email: 'alice@example.com'
});
```

Example 2 – Insert multiple records:

```bash
await client.insert([
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@example.com' }
]);
```
⚠️ Throws ValidationError if the data is missing or not an object/array.

## 🔄 Update

```bash
update(data: object)
```

Updates records in the table. The first key-value pair is used as the WHERE condition (e.g., WHERE name = 'Alice'), and the rest are the fields to be updated.

Example:

```bash
await client.update({
  name: 'Alice',         // used as WHERE clause
  email: 'alice@new.com' // field to be updated
});
```
⚠️ Must provide at least one matching field and one field to update. Otherwise, an ApiError is thrown.

## ❌ Delete

```bash
delete(data?: object)
```

Deletes records matching any of the provided key-value pairs using OR logic.

If no data is provided, all records in the table are deleted.

Example 1 – Delete records where `name = 'Alice'` OR `email = 'bob@example.com'`:

```bash
await client.delete({
  name: 'Alice',
  email: 'bob@example.com'
});
```

This internally translates to SQL like:
```sql
DELETE FROM myTable WHERE name = 'Alice' OR email = 'bob@example.com';
```

Example 2 – Delete all records:

```bash
await client.delete(); // no payload needed
```
⚠️ Use with caution — deletes all data in the table if no condition is specified.


## ⚠️ Errors
- ValidationError: Thrown for missing required parameters.

- InitializationError: Thrown if you call insert, update, or delete before init().

- ApiError: Thrown by the backend for malformed payloads or runtime failures (e.g., bad update/delete logic).

## 🏁 Example Flow

```ts
const client = new SuilensClient();

await client.init({ dbName: 'appDB', tableName: 'users' });

await client.insert({ name: 'Diana', email: 'diana@example.com' });

await client.update({ name: 'Diana', email: 'diana@updated.com' });

await client.delete({ email: 'diana@updated.com' });

await client.delete(); // Clears the entire 'users' table
```

## 📂 Folder Structure

```bash
client/
  └── SuilensClient.ts      # The main client
  └── services/
        └── apiService.ts   # API service handlers

backend/
  └── routes/event.py       # FastAPI router
  └── services/event_service.py
  └── dbhandlers/event_handler.py
```

## ⚙️ Project Setup with Webpack Overrides

To support certain Node.js core modules like path, os, crypto, and buffer in the browser (required by the SuilensClient), we’ve customized the Webpack configuration using react-app-rewired.

### 🛠 Required Files and Scripts

1. Install `react-app-rewired`

This overrides the default Webpack config from Create React App without ejecting:
```bash
npm install react-app-rewired --save-dev
```

2. Create a `config-overrides.js` file in the project root:
```js
const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser.js'),
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
```

3. Update the scripts in package.json:

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
}
```

4. Install the required browser-compatible modules:
```bash
npm install path-browserify os-browserify crypto-browserify stream-browserify buffer process
```