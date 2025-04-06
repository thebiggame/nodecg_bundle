"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
(0, nodecg_1.get)().log.trace('Extension schedule loaded.');
const config = (0, nodecg_1.get)().bundleConfig;
const ical = require('node-ical');
var icalAddress = config.schedule.icalAddress;
function updateSchedule() {
    (0, nodecg_1.get)().log.debug('Updating schedule...');
    (() => __awaiter(this, void 0, void 0, function* () {
        var webEvents;
        try {
            webEvents = yield ical.async.fromURL(icalAddress);
        }
        catch (error) {
            (0, nodecg_1.get)().log.error(error);
            return;
        }
        var nextEvent;
        var futureEvents = [];
        for (let k in webEvents) {
            if (webEvents.hasOwnProperty(k)) {
                const ev = webEvents[k];
                if (webEvents[k].type === 'VEVENT') {
                    if (Date.now() <= ev.end) {
                        // Valid event, in the future.
                        var event = {
                            title: ev.summary,
                            ts_start: ev.start,
                            ts_end: ev.end,
                        };
                        // Is this the first event?
                        if (nextEvent === undefined) {
                            nextEvent = event;
                        }
                        else {
                            futureEvents.push(event);
                        }
                    }
                }
            }
        }
        // Append dummy events (debugging)
        for (var i = 0; i < 10; i++) {
            futureEvents.push({
                title: 'Test Event',
                ts_start: new Date('2025-04-05T23:00:00.000Z').toISOString(),
                ts_end: new Date('2025-04-05T23:30:00.000Z').toISOString(),
            });
        }
        var expNewData = { now: nextEvent, upcoming: futureEvents };
        if (replicants_1.repScheduleData.value != expNewData) {
            replicants_1.repScheduleData.value = expNewData;
        }
        (0, nodecg_1.get)().log.trace(expNewData);
        (0, nodecg_1.get)().log.debug('Schedule updated successfully.');
        return;
    }))().catch((error) => {
        (0, nodecg_1.get)().log.error(error);
    });
}
setInterval(updateSchedule, 10000);
updateSchedule();
