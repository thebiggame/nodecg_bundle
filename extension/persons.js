'use strict';

module.exports = function (nodecg) {
    let timerClock;

    const wipeRep = nodecg.Replicant('persons', {
        defaultValue: {
        	live: true,
            person1: 'Person 1',
			person1desc: 'Person 1 Description',
			person2: 'Person 2',
			person2desc: 'Person 2 Description',
			person3: 'Person 3',
			person3desc: 'Person 3 Description',
        },
        persistent: false
    });

	nodecg.listenFor('startPersons', start);
	nodecg.listenFor('stopPersons', stop);

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
