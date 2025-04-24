"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHelloWorldEvents = void 0;
const dbOperations_1 = require("../controllers/dbOperations");
const constant_1 = require("../constant");
const handleHelloWorldEvents = async (events, type, module) => {
    const eventsByType = new Map();
    for (const event of events) {
        if (!event.type.startsWith(type))
            throw new Error('Invalid event module origin');
        const eventData = eventsByType.get(event.type) || [];
        eventData.push(event.parsedJson);
        eventsByType.set(event.type, eventData);
    }
    await Promise.all(Array.from(eventsByType.entries()).map(async ([eventType, events]) => {
        const eventName = eventType.split('::').pop() || eventType;
        (0, dbOperations_1.dbOperations)({ tableName: eventName, data: events, operation: constant_1.DB_OPERATIONS.CREATE_MANY, dbName: module });
    }));
};
exports.handleHelloWorldEvents = handleHelloWorldEvents;
