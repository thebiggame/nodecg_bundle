'use strict';

module.exports = function (nodecg) {
    const ical = require("node-ical");
    var icalAddress = nodecg.bundleConfig.schedule.icalAddress;

    const schedData = nodecg.Replicant("schedule:data", {
        defaultValue: {"now": {"title": "Synchronisation Error!", "ts_start": 0, "ts_end": 0}, "upcoming": []},
        persistent: false
    });

    function updateSchedule() {
        nodecg.log.debug("Updating schedule...")
        ;(async () => {
            var webEvents;
            try {
                webEvents = await ical.async.fromURL(icalAddress);
            } catch (error) {
                nodecg.log.error(err);
                return
            }
            var nextEvent;
            var futureEvents = [];
            for (let k in webEvents) {
                if (webEvents.hasOwnProperty(k)) {
                    const ev = webEvents[k];
                    if (webEvents[k].type == 'VEVENT') {
                        if (Date.now() <= ev.end) {
                            // Valid event, in the future.
                            var event = {"title": ev.summary, "ts_start": ev.start, "ts_end": ev.end};
                            // Is this the first event?
                            if (nextEvent == null) {
                                nextEvent = event;
                            } else {
                                futureEvents.push(event);
                            }
                        }
                    }
                }
            }

            var expNewData = {"now": nextEvent, "upcoming": futureEvents};
            if (schedData.value != expNewData) {
                schedData.value = expNewData;
            }
            nodecg.log.debug(expNewData);
            
            nodecg.log.debug("Schedule updated successfully.");
            return;
        })()
        .catch(console.error.bind());
    }

    setInterval(updateSchedule, 10000);
    updateSchedule();
    
};
