'use strict';

module.exports = function (nodecg) {
    const wipeRep = nodecg.Replicant('halfwipe:data', {
        defaultValue: {
            now: 'theBIGGAME',
			next: ''
        },
        persistent: true
    });
    const wipeRepActive = nodecg.Replicant('halfwipe:active', {defaultValue: false, persistent: true});
};
