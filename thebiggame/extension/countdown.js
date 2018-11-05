'use strict';

const TimeObject = require('./classes/time-object');

module.exports = function (nodecg) {
    let timerCountdown;

    const countdownData = nodecg.Replicant('countdown:data', {
        defaultValue: new TimeObject(600),
        persistent: false
    });

    const countdownName = nodecg.Replicant('countdown:name', {defaultValue: '', persistent: true});
    const countdownActive = nodecg.Replicant('countdown:active', {defaultValue: false, persistent: false});

    /* When the replicant is persisted to disk, it's class doesn't survive stringification.
     * We must replace the persisted values (if any) with new class instances based on those values.
     */

    // If the countdown was running when NodeCG last stopped, figure out how much time passed.
    if (countdownData.running && countdownData.time.raw && countdownData.time.timestamp) {
        const lostSeconds = Math.floor((Date.now() - countdownData.time.timestamp) / 1000);
        countdownData.time = new TimeObject(countdownData.time.raw + lostSeconds);
        timerCountdown = setInterval(tick, 1000);
    } else {
        countdownData.running = false;
    }

    nodecg.listenFor('countdown:start', start);
    nodecg.listenFor('countdown:stop', stop);

    function start(startTime) {
        if (countdownData.running) {
            return;
        }

        const timeObj = new TimeObject(TimeObject.parseSeconds(startTime));
        if (timeObj.raw <= 0) {
            return;
        }

        countdownActive.value = true;
        countdownData.value = timeObj;
        timerCountdown = setInterval(tick, 1000);
    }

    function stop() {
        if (!countdownActive) {
            return;
        }

        countdownActive.value = false;
        clearInterval(timerCountdown);
    }

    function tick() {
        TimeObject.decrement(countdownData.value);

        if (countdownData.value.raw <= 0) {
            stop();
        }
    }
};
