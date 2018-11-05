'use strict';

module.exports = function (nodecg) {
    let timerClock;

    const clockRep = nodecg.Replicant('clock', {
        defaultValue: {
            time: Date.now()
        },
        persistent: false
    });


    function tick() {
        clockRep.value.time = Date.now();
    }
	const timer = setInterval(tick, 1000);

};
