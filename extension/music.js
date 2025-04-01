'use strict';

module.exports = function (nodecg) {
    const repSong = nodecg.Replicant("music:song", {
        defaultValue: "Unknown Track",
        persistent: false
    });
    const repArtist = nodecg.Replicant("music:artist", {
        defaultValue: "Unknown Artist",
        persistent: false
    });

    var songsource = nodecg.bundleConfig.music.Source;
    var update = nodecg.bundleConfig.music.updateInterval;		// how often the title is updated, in seconds
    if (update==undefined) update = 1;
    var apikey = nodecg.bundleConfig.music.apiKey;		// your last.fm API key (last.fm/api)

    var lastsong = "";

    if (nodecg.bundleConfig.music.enabled) {
        setInterval(updateSong,nodecg.bundleConfig.music.updateInterval*1000);
    }

    function updateSong() {
        const http = require('http');
        const url = `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${encodeURIComponent(songsource)}&api_key=${encodeURIComponent(apikey)}&limit=2&format=json&callback=`;

        // Parse the URL into its components
        const options = new URL(url);

        http.request(options, (response) => {
            let data = '';

            // Collect data chunks
            response.on('data', (chunk) => {
                data += chunk;
            });

            // When the response is finished, parse the data
            response.on('end', () => {
                try {
                    const body = JSON.parse(data); // Parse JSON response
                    if (response.statusCode >= 200 && response.statusCode < 400) {
                        // Success!
                        const track = body.recenttracks.track[0];
                        if (track) {
                            updateReplicants(track.name, track.artist['#text']);
                        } else {
                            nodecg.log.debug('Music: No track data found.');
                        }
                    } else {
                        // We reached the target server, but it returned an error
                        nodecg.log.error('Music: Data error.');
                    }
                } catch (error) {
                    nodecg.log.error('Music: Error parsing JSON:', error);
                }
            });

        }).on('error', (error) => {
            nodecg.log.error('Music: Request error:', error);
        }).end();
    }

    function updateReplicants(song, artist) {
        if (song !== lastsong) {
            nodecg.log.trace('Music: Old song: ' + lastsong);
            nodecg.log.debug('Music: New Song detected: ' + song + " / " + artist);
            repSong.value = song;
            repArtist.value = artist;
        }
        lastsong = song;
    }
};
