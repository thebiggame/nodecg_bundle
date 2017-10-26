'use strict';

module.exports = function (nodecg) {

    const wipeRep = nodecg.Replicant('scoreboard', {
        defaultValue: {
        	live: true,
			title: "",
            p1: 'Player 1',
			p2: 'Player 2',
			p1score: "",
			p2score: "",
        },
        persistent: false
    });

	nodecg.listenFor('startScoreboard', start);
	nodecg.listenFor('stopScoreboard', stop);

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
