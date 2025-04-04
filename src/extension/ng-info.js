/* eslint-disable object-property-newline */
'use strict';

module.exports = function (nodecg) {
    const eventInfoActive = nodecg.Replicant('event:info:active', {defaultValue: false, persistent: true});
    const eventInfoBody = nodecg.Replicant('event:info:body', {defaultValue: 'Welcome to theBIGGAME, powered by NG-TBG!', persistent: true});
};
