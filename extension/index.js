'use strict';

module.exports = function (nodecg) {
    // Initialize replicants.

    nodecg.Replicant('showHashtag', {defaultValue: true});

    try {
        require('./alert')(nodecg);
    } catch (e) {
        nodecg.log.error('Failed to load "alert" lib:', e.stack);
        process.exit(1);
    }
	try {
		require('./ng-info')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load NG "info" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./ng-network')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load NG "network" lib:', e.stack);
		process.exit(1);
	}
    try {
        require('./countdown')(nodecg);
    } catch (e) {
        nodecg.log.error('Failed to load "countdown" lib:', e.stack);
        process.exit(1);
    }
	try {
		require('./clock')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "clock" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./halfwipe')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "halfwipe" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./scoreboard')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "scoreboard" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./lowerthird')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "lowerthird" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./music')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "music" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./ng-databoard')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load NG "databoard" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./persons')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "persons" lib:', e.stack);
		process.exit(1);
	}
	try {
		require('./eventmeta')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "eventmeta" lib:', e.stack);
		process.exit(1);
	}

};
