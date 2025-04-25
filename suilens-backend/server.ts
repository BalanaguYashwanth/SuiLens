import express from 'express';
import cors from 'cors';
import { dbOperations } from './controllers/dbOperations';
import { setupListeners } from './controllers/event-indexer';
import { processQueryPipeline } from './controllers/dbquery';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/status', (req, res)=>{
  res.json({"status": 'working'})
})

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

app.post('/query', async (req, res)=>{
  const {text, module} = req.body;

  if (!text || !module) {
    return res.status(400).json({ error: 'Missing query or module in request body' });
  }

  try{
    const result = await processQueryPipeline({ text, module });
    return res.status(200).json(result)
  }catch(error){
    console.error('Error processing query pipeline:', error);
    return res.status(400).json({ error: 'Failed to process query pipeline' });
  }
})

app.post('/db_operations', (req, res) => {
  const { dbName, tableName, data, operation } = req.body;

  if (!dbName || !tableName || !operation) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try{
    const response = dbOperations({ dbName, tableName, data, operation })
    return res.status(200).json(response);
  }catch(err){
    return res.status(400).json({ error: 'Invalid operation or data' });
  }
});

app.post('/record-events', (req, res)=>{
  const {module, packageId} = req.body;
  setupListeners({module, packageId})
  return res.status(200).json({status:'started recording events'});
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});