const {
  createDatabaseAndTable,
  insertData,
  updateData,
  deleteTable,
} = require('../services/databaseService');

async function handleCreate(req, res, next) {
  try {
    const { dbName, tableName } = req.body;
    await createDatabaseAndTable(dbName, tableName);
    res.status(201).json({ success: true, message: 'Database and table ready' });
  } catch (err) {
    next(err);
  }
}

async function handleInsert(req, res, next) {
  try {
    const { dbName, tableName, data } = req.body;
    await insertData(dbName, tableName, data);
    res.status(201).json({ success: true, message: 'Data inserted' });
  } catch (err) {
    next(err);
  }
}

async function handleUpdate(req, res, next) {
  try {
    const { dbName, tableName, data } = req.body;
    await updateData(dbName, tableName, data);
    res.status(200).json({ success: true, message: 'Data updated' });
  } catch (err) {
    next(err);
  }
}

async function handleDelete(req, res, next) {
  try {
    const { dbName, tableName } = req.body;
    await deleteTable(dbName, tableName);
    res.status(200).json({ success: true, message: 'Table deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleCreate,
  handleInsert,
  handleUpdate,
  handleDelete,
};
