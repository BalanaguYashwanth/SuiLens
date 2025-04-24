"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupListeners = void 0;
const config_1 = require("../config");
const sui_utils_1 = require("../sui-utils");
const helloWorld_1 = require("../handlers/helloWorld");
const dbOperations_1 = require("./dbOperations");
const constant_1 = require("../constant");
const getEventsToTrack = ({ module, packageId }) => {
    return [
        {
            type: `${packageId}::${module}`,
            filter: {
                MoveEventModule: {
                    module,
                    package: packageId,
                },
            },
            callback: helloWorld_1.handleHelloWorldEvents,
        }
    ];
};
const executeEventJob = async (client, tracker, cursor, module) => {
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
    }
    catch (e) {
        console.error(e);
    }
    return {
        cursor,
        hasNextPage: false,
    };
};
const runEventJob = async (client, tracker, cursor, module) => {
    const result = await executeEventJob(client, tracker, cursor, module);
    setTimeout(() => {
        runEventJob(client, tracker, result.cursor, module);
    }, result.hasNextPage ? 0 : config_1.CONFIG.POLLING_INTERVAL_MS);
};
const getLatestCursor = async (tracker, module) => {
    const data = {
        id: tracker.type,
    };
    const cursor = (0, dbOperations_1.dbOperations)({ tableName: 'cursor', data, operation: constant_1.DB_OPERATIONS.GET_ID, dbName: module });
    return cursor || undefined;
};
const saveLatestCursor = async (tracker, cursor, module) => {
    const data = {
        eventSeq: cursor.eventSeq,
        txDigest: cursor.txDigest,
    };
    (0, dbOperations_1.dbOperations)({ tableName: 'cursor', operation: constant_1.DB_OPERATIONS.UPSERT, data, dbName: module });
};
const setupListeners = async ({ module, packageId }) => {
    const EVENTS_TO_TRACK = getEventsToTrack({ module, packageId });
    for (const event of EVENTS_TO_TRACK) {
        runEventJob((0, sui_utils_1.getClient)(config_1.CONFIG.NETWORK), event, await getLatestCursor(event, module), module);
    }
};
exports.setupListeners = setupListeners;
