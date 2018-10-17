/* eslint-disable object-property-newline */
'use strict';

module.exports = function (nodecg) {
    const alertData = nodecg.Replicant('alert:data');
    const alertFlair = nodecg.Replicant('alert:flair', {defaultValue: false, persistent: false});
    const alertDelay = nodecg.Replicant('alert:delay', {defaultValue: false, persistent: false});
};
