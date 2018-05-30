'use strict';

module.exports = function (nodecg) {
    let timerClock;

    const wipeRep = nodecg.Replicant('halfwipe', {
        defaultValue: {
        	live: true,
            now: 'theBIGGAME',
			next: ''
        },
        persistent: false
    });

	nodecg.listenFor('startHalfWipe', start);
	nodecg.listenFor('stopHalfWipe', stop);

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
