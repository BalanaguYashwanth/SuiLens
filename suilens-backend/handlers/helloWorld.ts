import { SuiEvent } from '@mysten/sui/client';
import { dbOperations } from '../controllers/dbOperations';
import { DB_OPERATIONS } from '../constant';

export const handleHelloWorldEvents = async (events: SuiEvent[], type: string, module: string) => {
  const eventsByType = new Map<string, any[]>();
  
  for (const event of events) {
    if (!event.type.startsWith(type)) throw new Error('Invalid event module origin');
    const eventData = eventsByType.get(event.type) || [];
    eventData.push(event.parsedJson);
    eventsByType.set(event.type, eventData);
  }

  await Promise.all(
    Array.from(eventsByType.entries()).map(async ([eventType, events]) => {
      const eventName = eventType.split('::').pop() || eventType;
      dbOperations({tableName: eventName, data: events, operation: DB_OPERATIONS.CREATE_MANY, dbName:module})
    }),
  );
};
