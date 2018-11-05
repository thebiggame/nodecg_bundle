'use strict';

module.exports = function (nodecg) {

    const eventRep = nodecg.Replicant('event', {
        defaultValue: {
			day: 1,
			time: Date.now()
        },
        persistent: false
    });


    function tick() {
        eventRep.value.time = Date.now();
		setDay();
    }
    function setDay() {
		var period = new Date(eventRep.value.time);
		if (period.getDay() == 5) {
			eventRep.value.day = 1;
		} else if (period.getDay() == 6) {
			eventRep.value.day = 2;
		} else if (period.getDay() == 0) {
			eventRep.value.day = 3;
		} else {
			eventRep.value.day = 0
		}

	}
	const timer = setInterval(tick, 1000);

};
