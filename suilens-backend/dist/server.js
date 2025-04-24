"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbOperations_1 = require("./controllers/dbOperations");
const event_indexer_1 = require("./controllers/event-indexer");
const dbquery_1 = require("./controllers/dbquery");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/status', (req, res) => {
    res.json({ "status": 'working' });
});
// Event query endpoints
// app.get('/events/hello-world/message-sent', async (req, res) => {
//       try {
//         const events = await prisma.messageSent.findMany();
//         res.json(events);
//       } catch (error) {
//         console.error('Failed to fetch hello_world-MessageSent:', error);
//         res.status(500).json({ error: 'Failed to fetch events' });
//       }
//     });
// app.get('/events/hello-world/platform-fee-cut', async (req, res) => {
//       try {
//         const events = await prisma.platformFeeCut.findMany();
//         res.json(events);
//       } catch (error) {
//         console.error('Failed to fetch hello_world-PlatformFeeCut:', error);
//         res.status(500).json({ error: 'Failed to fetch events' });
//       }
//     });
app.post('/query', async (req, res) => {
    const { query, module } = req.body;
    if (!query || !module) {
        return res.status(400).json({ error: 'Missing query or module in request body' });
    }
    try {
        const result = await (0, dbquery_1.processQueryPipeline)({ query, module });
        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error processing query pipeline:', error);
        return res.status(400).json({ error: 'Failed to process query pipeline' });
    }
});
app.post('/db_operations', (req, res) => {
    const { dbName, tableName, data, operation } = req.body;
    if (!dbName || !tableName || !operation) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const response = (0, dbOperations_1.dbOperations)({ dbName, tableName, data, operation });
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(400).json({ error: 'Invalid operation or data' });
    }
});
app.post('/record-events', (req, res) => {
    const { module, packageId } = req.body;
    (0, event_indexer_1.setupListeners)({ module, packageId });
    return res.status(200).json({ status: 'started recording events' });
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
