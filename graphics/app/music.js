// edit these!
var titletime = nodecg.bundleConfig.titletime;	// how long song title is displayed, in seconds
if (titletime==undefined) titletime = 10;
var msgtime = nodecg.bundleConfig.msgtime;		// how long sub message is displayed, in seconds
if (msgtime==undefined) msgtime = 5;
var update = nodecg.bundleConfig.update;		// how often the title is updated, in seconds
if (update==undefined) update = 1;
//var apikey = nodecg.bundleConfig.apikey;		// your last.fm API key (last.fm/api)
var apikey = "2f3b91506c384e7c4a238294c6cebea9";		// your last.fm API key (last.fm/api)

var auto = 0;
var showing = 0;
//var songsource = nodecg.bundleConfig.songsource;
var songsource = "adamcathersides";
var lastsong = "";

var curline = -1;
var toggleto;
var autotoggleto;
var autohideto;

(function () {
	'use strict';

	function updateMusic(data) {
		songsource = data.lastfm;

		auto = data.auto;

		var msg = data.msg;
		if(msg) {
			if (curline == -1) {
				curline = 0;
				toggleto=setTimeout(toggleLines,titletime*1000);
			}
			$('#musicmessage').html(msg);
		} else {
			if (curline != -1) {
				if (curline==1) {
					toggleLines();
				}
				clearTimeout(toggleto);
				curline = -1;
			}
		}
	}

	setInterval(updateSong,update*1000);
	function updateSong() {
		var request = new XMLHttpRequest();
		request.open('GET', "http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user="+songsource+"&api_key="+apikey+"&limit=2&format=json&callback=", true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				var data = JSON.parse(request.responseText);
				updateTitle(data.recenttracks.track[0].artist['#text'] + " - " + data.recenttracks.track[0].name)
			} else {
				// We reached our target server, but it returned an error
				console.log('Data error.')
			}
		};

		request.onerror = function() {
			// There was a connection error of some sort
			console.log('Connection error.')
		};

		request.send();
	}
	function updateTitle(song) {
		document.getElementById('music-title').textContent = song;
		if (song != lastsong && auto != 0) {
			if (curline==1) {
				toggleLines();
			}
			clearTimeout(toggleto);
			clearTimeout(autotoggleto);
			clearTimeout(autohideto);
			autotoggleto = setTimeout(toggleLines,auto*600);
			autohideto = setTimeout(hideMusic,auto*1000);
		}
		lastsong = song;
	}

	function toggleLines() {
		if (curline==0) {
			document.getElementById('music-title').transition({
				'opacity': '0',
				'margin-top': '-4px'
			}, 300, 'ease-out');
			curline = 1;
			if (auto==0) toggleto=setTimeout(toggleLines,msgtime*1000);
		} else if (curline==1) {
			document.getElementById('music-title').delay(150).transition({
				'opacity': '1',
				'margin-top': '8px'
			}, 300, 'ease-out');
			curline = 0;
			if (auto==0) toggleto=setTimeout(toggleLines,titletime*1000);
		}
	}
})();
