'use strict';

module.exports = function (nodecg) {
    const schedNow = nodecg.Replicant("schedule:now", {
        defaultValue: 'theBIGGAME-NG',
        persistent: true
    });
    const schedNext = nodecg.Replicant("schedule:next", {
        defaultValue: '',
        persistent: true
    });
    const wipeRepActive = nodecg.Replicant('databoard:active', {defaultValue: false, persistent: true});
};
