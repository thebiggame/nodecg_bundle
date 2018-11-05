'use strict';

module.exports = function (nodecg) {

    const scoreboardRep = nodecg.Replicant('scoreboard:data', {
        defaultValue: {
			title: "",
            team1: {
			    name: 'Player 1',
                score: 0
            },
            team2: {
                name: 'Player 2',
                score: 0
            }
        },
        persistent: true
    });

    const scoreboardRepActive = nodecg.Replicant('scoreboard:active', {defaultValue: false, persistent: true});

};
