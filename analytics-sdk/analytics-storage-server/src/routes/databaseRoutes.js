const express = require('express');
const {
  handleCreate,
  handleInsert,
  handleUpdate,
  handleDelete,
} = require('../controllers/databaseController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post('/create', validateRequest(['dbName', 'tableName']), handleCreate);
router.post('/insert', validateRequest(['dbName', 'tableName', 'data']), handleInsert);
router.put('/update', validateRequest(['dbName', 'tableName', 'data']), handleUpdate);
router.delete('/delete', validateRequest(['dbName', 'tableName']), handleDelete);

module.exports = router;