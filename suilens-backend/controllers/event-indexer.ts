import { EventId, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { CONFIG } from '../config.ts';
import { getClient } from '../sui-utils.ts';
import { handleHelloWorldEvents } from '../handlers/helloWorld.ts';
import { dbOperations } from './dbOperations.ts';
import { DB_OPERATIONS } from '../constant.ts';

type SuiEventsCursor = EventId | null | undefined;

type EventExecutionResult = {
  cursor: SuiEventsCursor;
  hasNextPage: boolean;
};

type EventTracker = {
  type: string;
  filter: SuiEventFilter;
  callback: (events: SuiEvent[], type: string,   module: string) => any;
};

type EventSetupListner = {
  module: string;
  packageId: string
}

const getEventsToTrack = ({module, packageId}: {module: string, packageId: string}) => {
  return [
    {
      type: `${packageId}::${module}`,
      filter: {
        MoveEventModule: {
          module,
          package: packageId,
        },
      },
      callback: handleHelloWorldEvents,
    }
  ];
}
  

const executeEventJob = async (
  client: SuiClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor,
  module: string
): Promise<EventExecutionResult> => {
  try {
    const { data, hasNextPage, nextCursor } = await client.queryEvents({
      query: tracker.filter,
      cursor,
      order: 'ascending',
    });
    await tracker.callback(data, tracker.type, module);

    if (nextCursor && data.length > 0) {
      await saveLatestCursor(tracker, nextCursor, module);

      return {
        cursor: nextCursor,
        hasNextPage,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    cursor,
    hasNextPage: false,
  };
};

const runEventJob = async (client: SuiClient, tracker: EventTracker, cursor: SuiEventsCursor, module: string) => {
  const result = await executeEventJob(client, tracker, cursor, module);

  setTimeout(
    () => {
      runEventJob(client, tracker, result.cursor, module);
    },
    result.hasNextPage ? 0 : CONFIG.POLLING_INTERVAL_MS,
  );
};

const getLatestCursor = async (tracker: EventTracker, module: string) => {
  const data = {
    id: tracker.type,
  }
  const cursor = dbOperations({tableName: 'cursor', data, operation: DB_OPERATIONS.GET_ID, dbName: module}) as any
  return cursor || undefined;
};

const saveLatestCursor = async (tracker: EventTracker, cursor: EventId, module: string) => {
  const data = {
    eventSeq: cursor.eventSeq,
    txDigest: cursor.txDigest,
  };

  dbOperations({tableName:'cursor', operation: DB_OPERATIONS.UPSERT, data, dbName: module})
};

export const setupListeners = async ({module, packageId}: EventSetupListner) => {
  const EVENTS_TO_TRACK = getEventsToTrack({module, packageId})
  for (const event of EVENTS_TO_TRACK) {
    runEventJob(getClient(CONFIG.NETWORK), event, await getLatestCursor(event, module), module);
  }
};