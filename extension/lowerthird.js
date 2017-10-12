'use strict';

module.exports = function (nodecg) {
    let timerClock;

    const wipeRep = nodecg.Replicant('lowerthird', {
        defaultValue: {
        	live: true,
            body: 'Welcome to The BIG GAME!',
        },
        persistent: false
    });

	nodecg.listenFor('startLowerThird', start);
	nodecg.listenFor('stopLowerThird', stop);

	function start(startTime) {
		if (wipeRep.value.live) {
			return;
		}

		wipeRep.value.live = true;
	}

	function stop() {
		if (!wipeRep.value.live) {
			return;
		}

		wipeRep.value.live = false;
	}
};
