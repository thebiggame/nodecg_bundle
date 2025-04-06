"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.repScoreboardActive = exports.repScoreboardData = exports.repScheduleData = exports.repProjectorActive = exports.repPersonsActive = exports.repPersonsData = exports.repAlertDelay = exports.repAlertFlair = exports.repAlertData = exports.repEventInfoActive = exports.repEventInfoBody = exports.repNetworkWANBandwidth = exports.repMusicData = exports.repLowerthirdActive = exports.repLowerthirdData = exports.repHalfwipeActive = exports.repHalfwipeData = exports.repCountdownActive = exports.repCountdownName = exports.repCountdownData = exports.repClock = void 0;
const nodecg_1 = require("./nodecg");
/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
// Clock.
exports.repClock = (0, nodecg_1.get)().Replicant('clock', {
    defaultValue: Date.now().toString(),
    persistent: false,
});
// Countdown.
exports.repCountdownData = (0, nodecg_1.get)().Replicant('countdown:data', {
    defaultValue: 0,
    persistent: false,
});
exports.repCountdownName = (0, nodecg_1.get)().Replicant('countdown:name', {
    defaultValue: '',
    persistent: true,
});
exports.repCountdownActive = (0, nodecg_1.get)().Replicant('countdown:active', {
    defaultValue: false,
    persistent: false,
});
// Halfwipe.
exports.repHalfwipeData = (0, nodecg_1.get)().Replicant('halfwipe:data', {
    defaultValue: {
        now: 'theBIGGAME',
        next: '',
    },
    persistent: true,
});
exports.repHalfwipeActive = (0, nodecg_1.get)().Replicant('halfwipe:active', {
    defaultValue: false,
    persistent: true,
});
// Lowerthird.
exports.repLowerthirdData = (0, nodecg_1.get)().Replicant('lowerthird:data', {
    defaultValue: 'theBIGGAME',
    persistent: true,
});
exports.repLowerthirdActive = (0, nodecg_1.get)().Replicant('lowerthird:active', {
    defaultValue: false,
    persistent: true,
});
// Music data.
exports.repMusicData = (0, nodecg_1.get)().Replicant('music:data', {
    defaultValue: { title: 'Unknown Song', artist: 'Unknown Artist' },
    persistent: false,
});
// Network bandwidth.
exports.repNetworkWANBandwidth = (0, nodecg_1.get)().Replicant('network:wan:bandwidth');
// Notifications - Events.
exports.repEventInfoBody = (0, nodecg_1.get)().Replicant('event:info:body', {
    defaultValue: 'theBIGGAME',
    persistent: true,
});
exports.repEventInfoActive = (0, nodecg_1.get)().Replicant('event:info:active', {
    defaultValue: false,
    persistent: true,
});
// Notifications - Alerts.
exports.repAlertData = (0, nodecg_1.get)().Replicant('alert:data', {
    defaultValue: 'Pay Attention!',
    persistent: false,
});
exports.repAlertFlair = (0, nodecg_1.get)().Replicant('alert:flair', {
    defaultValue: false,
    persistent: false,
});
exports.repAlertDelay = (0, nodecg_1.get)().Replicant('alert:delay', {
    defaultValue: 0,
    persistent: false,
});
// Persons.
exports.repPersonsData = (0, nodecg_1.get)().Replicant('persons:data', {
    defaultValue: {
        person1: 'Person 1',
        person1desc: 'Person 1 Description',
        person2: 'Person 2',
        person2desc: 'Person 2 Description',
        person3: 'Person 3',
        person3desc: 'Person 3 Description',
    },
    persistent: true,
});
exports.repPersonsActive = (0, nodecg_1.get)().Replicant('persons:active', {
    defaultValue: false,
    persistent: true,
});
// Projector - global animate in state.
exports.repProjectorActive = (0, nodecg_1.get)().Replicant('projector:active', {
    defaultValue: true,
    persistent: true,
});
// Schedule.
exports.repScheduleData = (0, nodecg_1.get)().Replicant('schedule:data', {
    defaultValue: {
        now: {
            title: 'Synchronisation Error!',
            ts_start: '0',
            ts_end: '0',
        },
        upcoming: [],
    },
    persistent: true,
});
// Scoreboard.
exports.repScoreboardData = (0, nodecg_1.get)().Replicant('scoreboard:data', {
    defaultValue: {
        title: '',
        team1: {
            name: 'Player 1',
            score: 0,
        },
        team2: {
            name: 'Player 2',
            score: 0,
        },
    },
    persistent: true,
});
exports.repScoreboardActive = (0, nodecg_1.get)().Replicant('scoreboard:active', {
    defaultValue: false,
    persistent: true,
});
