/* eslint-disable object-property-newline */
'use strict';

module.exports = function (nodecg) {
    const alertData = nodecg.Replicant('alert:data', {defaultValue: 'Pay Attention!', persistent: true);
    const alertFlair = nodecg.Replicant('alert:flair', {defaultValue: false, persistent: false});
    const alertDelay = nodecg.Replicant('alert:delay', {defaultValue: false, persistent: false});
};
