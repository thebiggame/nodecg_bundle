'use strict';

module.exports = function (nodecg) {
    let timerClock;

    const personsRep = nodecg.Replicant('persons:data', {
        defaultValue: {
            person1: 'Person 1',
			person1desc: 'Person 1 Description',
			person2: 'Person 2',
			person2desc: 'Person 2 Description',
			person3: 'Person 3',
			person3desc: 'Person 3 Description',
        },
        persistent: true
    });

    const personsRepActive = nodecg.Replicant('persons:active', {defaultValue: false, persistent: true});
};
