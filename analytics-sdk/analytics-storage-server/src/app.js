const express = require('express');
const apiRoutes = require('./routes/databaseRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;