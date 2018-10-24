'use strict';

module.exports = function (nodecg) {
    const ltRep = nodecg.Replicant('lowerthird:data', {
        defaultValue: 'theBIGGAME',
        persistent: true
    });
    const ltRepActive = nodecg.Replicant('lowerthird:active', {defaultValue: false, persistent: true});
};

