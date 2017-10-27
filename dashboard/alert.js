(function () {
    'use strict';

	const startButton = document.getElementById('start');
	const stopButton = document.getElementById('stop');
    const name = document.getElementById('alertName');
    const flair = document.getElementById('alertFlair');
    const delayelement = document.getElementById('alertDelay');

	startButton.addEventListener('click', () => {
		function firealert(flair, name) {
			nodecg.sendMessage('alert', {
				flair: flair,
				name: name
			});
		}
		if (delayelement.checked) {
			setTimeout(function () {
				firealert(flair.checked, name.value);
			}, 5000)
		} else {
			firealert(flair.checked, name.value);
		}
    });
    stopButton.addEventListener('click', () => {
    	console.log('sending leave event');
        nodecg.sendMessage('alert-end');
    });
})();
